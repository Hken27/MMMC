import { NextRequest, NextResponse } from 'next/server';
import { getCities } from '@/app/lib/geo-api';

/**
 * GET /api/geo/cities?country=US&state=CA
 * Return cities for a state (Level 3)
 * Query: country (required), state (optional)
 * State can be empty for countries without subdivisions
 * Caching: 24 hours
 */
export async function GET(req: NextRequest) {
  try {
    const countryCode = req.nextUrl.searchParams.get('country');
    const stateCode = req.nextUrl.searchParams.get('state') || undefined;

    if (!countryCode) {
      return NextResponse.json(
        { error: 'Missing country parameter' },
        { status: 400 }
      );
    }

    const cities = await getCities(
      countryCode.toUpperCase(),
      stateCode ? stateCode.toUpperCase() : undefined
    );

    const response = NextResponse.json(
      cities.map((c) => c.name)
    );
    response.headers.set('Cache-Control', 'public, max-age=86400');

    return response;
  } catch (error) {
    console.error('[Geo API] Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities', data: [] },
      { status: 500 }
    );
  }
}
