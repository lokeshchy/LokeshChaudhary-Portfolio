import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
    })

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...blog,
        tags: parseJson<string[]>(blog.tags, []),
      },
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
