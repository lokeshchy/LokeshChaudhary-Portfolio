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

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        overview,
        problem,
        process,
        solution,
        result,
        techStack: techStack ? stringifyJson(techStack) : undefined,
        imageGallery: imageGallery ? stringifyJson(imageGallery) : undefined,
        featured,
        order,
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
    console.error('Error updating project:', error)
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

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
