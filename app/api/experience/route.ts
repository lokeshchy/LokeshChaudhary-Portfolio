import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseJson, stringifyJson } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const experiences = await prisma.experience.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    })

    const formatted = experiences.map(exp => ({
      ...exp,
      description: parseJson<string[]>(exp.description, []),
    }))

    return NextResponse.json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    console.error('Error fetching experience:', error)
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

    const experience = await prisma.experience.create({
      data: {
        role,
        organization,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: stringifyJson(description || []),
        type,
        order: order ?? 0,
        visible: visible ?? true,
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
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
