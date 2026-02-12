import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson, stringifyJson } from '@/lib/utils'
import { cookies } from 'next/headers'
import type { PageContent } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: params.slug },
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    const content = parseJson<PageContent>(page.content, { sections: [] })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        content,
      },
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('auth-session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, seoTitle, seoDesc, enabled, order } = body

    const page = await prisma.page.update({
      where: { slug: params.slug },
      data: {
        title,
        content: typeof content === 'string' ? content : stringifyJson(content),
        seoTitle,
        seoDesc,
        enabled: enabled ?? true,
        order: order ?? 0,
      },
    })

    const parsedContent = parseJson<PageContent>(page.content, { sections: [] })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        content: parsedContent,
      },
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
