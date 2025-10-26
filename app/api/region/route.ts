import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Get country from Vercel's geolocation (only works when deployed)
  const country = request.geo?.country;

  return NextResponse.json({
    country: country || null,
    isDevelopment: !country,
  });
}
