import { NextRequest, NextResponse } from 'next/server';
import { getCountries } from '@/app/lib/geo-api';

/**
 * GET /api/geo/countries
 * Return list of all countries (Level 1)
 * Caching: 24 hours
 */
export async function GET(req: NextRequest) {
  try {
    const countries = await getCountries();

    // Set cache headers (24 hours)
    const response = NextResponse.json(countries);
    response.headers.set('Cache-Control', 'public, max-age=86400');

    return response;
  } catch (error) {
    console.error('[Geo API] Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries', data: [] },
      { status: 500 }
    );
  }
}
