import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson, stringifyJson } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    const where: any = {}
    if (published === 'true') {
      where.published = true
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const formatted = blogs.map(blog => ({
      ...blog,
      tags: parseJson<string[]>(blog.tags, []),
    }))

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        tags: stringifyJson(tags || []),
        published: published ?? false,
        publishedAt: published ? new Date() : null,
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
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
