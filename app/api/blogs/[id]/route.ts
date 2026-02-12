import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson, stringifyJson } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      tags,
      published,
      seoTitle,
      seoDesc,
    } = body

    const existing = await prisma.blog.findUnique({ where: { id: params.id } })
    const wasPublished = existing?.published
    const isPublishing = published && !wasPublished

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        tags: tags ? stringifyJson(tags) : undefined,
        published,
        publishedAt: isPublishing ? new Date() : existing?.publishedAt,
        seoTitle,
        seoDesc,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...blog,
        tags: parseJson<string[]>(blog.tags, []),
      },
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    await prisma.blog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
