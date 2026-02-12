import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/settings'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings()
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    await updateSettings(body)

    const updated = await getSettings()
    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
