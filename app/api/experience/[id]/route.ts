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
      role,
      organization,
      location,
      startDate,
      endDate,
      description,
      type,
      order,
      visible,
    } = body

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        role,
        organization,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        description: description ? stringifyJson(description) : undefined,
        type,
        order,
        visible,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...experience,
        description: parseJson<string[]>(experience.description, []),
      },
    })
  } catch (error) {
    console.error('Error updating experience:', error)
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

    await prisma.experience.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
