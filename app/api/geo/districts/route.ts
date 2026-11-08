import { NextRequest, NextResponse } from 'next/server';
import { getDistricts } from '@/app/lib/geo-api';

/**
 * GET /api/geo/districts?country=ID&state=JK&city=Jakarta
 * Return districts/subdistricts for a city (Level 4)
 * Query: country (required), city (required), state (optional)
 * Caching: 24 hours
 */
export async function GET(req: NextRequest) {
  try {
    const countryCode = req.nextUrl.searchParams.get('country');
    const stateCode = req.nextUrl.searchParams.get('state') || undefined;
    const cityName = req.nextUrl.searchParams.get('city');

    if (!countryCode || !cityName) {
      return NextResponse.json(
        { error: 'Missing country or city parameter' },
        { status: 400 }
      );
    }

    const districts = await getDistricts(
      countryCode.toUpperCase(),
      cityName,
      stateCode ? stateCode.toUpperCase() : undefined
    );

    const response = NextResponse.json(
      districts.map((d) => d.name)
    );
    response.headers.set('Cache-Control', 'public, max-age=86400');

    return response;
  } catch (error) {
    console.error('[Geo API] Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch districts', data: [] },
      { status: 500 }
    );
  }
}

