import { NextRequest, NextResponse } from 'next/server';
import { getStates } from '@/app/lib/geo-api';

/**
 * GET /api/geo/states?country=US
 * Return states/provinces for a country (Level 2)
 * Query: country (ISO 3166-1 alpha-2 code)
 * Caching: 24 hours
 */
export async function GET(req: NextRequest) {
  try {
    const countryCode = req.nextUrl.searchParams.get('country');

    if (!countryCode) {
      return NextResponse.json(
        { error: 'Missing country parameter' },
        { status: 400 }
      );
    }

    const states = await getStates(countryCode.toUpperCase());

    const response = NextResponse.json(states);
    response.headers.set('Cache-Control', 'public, max-age=86400');

    return response;
  } catch (error) {
    console.error('[Geo API] Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states', data: [] },
      { status: 500 }
    );
  }
}
