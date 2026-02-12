import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      data: skills,
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
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
    const { name, category, icon, order } = body

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        icon,
        order: order ?? 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: skill,
    })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
