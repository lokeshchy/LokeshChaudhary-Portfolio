import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson, stringifyJson } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const where: any = {}
    if (featured === 'true') {
      where.featured = true
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    const formatted = projects.map(project => ({
      ...project,
      techStack: parseJson<string[]>(project.techStack, []),
      imageGallery: parseJson<string[]>(project.imageGallery, []),
    }))

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
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
      overview,
      problem,
      process,
      solution,
      result,
      techStack,
      imageGallery,
      featured,
      order,
      seoTitle,
      seoDesc,
    } = body

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        overview,
        problem,
        process,
        solution,
        result,
        techStack: stringifyJson(techStack || []),
        imageGallery: stringifyJson(imageGallery || []),
        featured: featured ?? false,
        order: order ?? 0,
        seoTitle,
        seoDesc,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        techStack: parseJson<string[]>(project.techStack, []),
        imageGallery: parseJson<string[]>(project.imageGallery, []),
      },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
