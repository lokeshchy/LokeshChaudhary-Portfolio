import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        techStack: parseJson<string[]>(project.techStack, []),
        imageGallery: parseJson<string[]>(project.imageGallery, []),
      },
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
