import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Get country from Vercel's geolocation (only works when deployed)
  const { country } = geolocation(request);

  return NextResponse.json({
    country: country || null,
    isDevelopment: !country,
  });
}
