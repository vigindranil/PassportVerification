import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('API route hit: /api/ip')
  try {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    const ip = forwardedFor?.split(',')[0] || realIp || 'Unknown'

    console.log('Detected IP:', ip)

    return NextResponse.json({
      ip,
      headers: Object.fromEntries(request.headers)
    })
  } catch (error) {
    console.error('Error in IP API route:', error)
    return NextResponse.json({ error: 'Failed to retrieve IP information' }, { status: 500 })
  }
}
