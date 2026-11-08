/**
 * Global Hierarchical Address Management — PlaceDB API
 * Data source: PlaceDB REST API (https://placedb.org/)
 * Spec: Phase 4.11.2
 *
 * Data Hierarchy:
 * - Level 1: Country (255+ countries)
 * - Level 2: Administrative Division / Region / State / Province
 * - Level 3: Settlement / City / Town / Populated Place
 *
 * API: https://api.placedb.org/v1/
 * License: CC0 (Public Domain) — Gratis, tanpa API key
 */

import { prisma } from '@/app/lib/prisma';

const PLACEDB_API = 'https://api.placedb.org/v1';
const CACHE_TTL = 86400; // 24 hours

export interface Country {
  code: string;
  name: string;
  dial?: string;
}

export interface State {
  code: string;
  name: string;
}

export interface City {
  name: string;
}

export interface District {
  name: string;
}

/**
 * Fetch countries from PlaceDB API
 * Stored in PostgreSQL for caching
 */
export async function getCountries(): Promise<Country[]> {
  try {
    // Check cache in database
    const cachedCountries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
      select: {
        code: true,
        name: true,
        dial: true,
      },
    });

    if (cachedCountries.length > 0) {
      console.log(`[PlaceDB] Serving ${cachedCountries.length} countries from cache`);
      return cachedCountries as Country[];
    }

    // Fetch from PlaceDB API
    console.log('[PlaceDB] Fetching countries from API...');
    const res = await fetch(`${PLACEDB_API}/countries.json`, {
      headers: { 'User-Agent': 'CMMM-App/1.0' },
    });

    if (!res.ok) throw new Error(`PlaceDB API error: ${res.status}`);

    const data = await res.json();
    const countries: Country[] = data.map((c: any) => ({
      code: c.code,
      name: c.name,
      dial: c.dial_code || undefined,
    }));

    // Store in database for caching
    for (const country of countries) {
      await prisma.country.upsert({
        where: { code: country.code },
        update: { name: country.name, dial: country.dial },
        create: {
          code: country.code,
          name: country.name,
          dial: country.dial,
        },
      });
    }

    console.log(`[PlaceDB] Cached ${countries.length} countries`);
    return countries;
  } catch (err) {
    console.error('[PlaceDB] Error fetching countries:', err);
    // Return cached data even if API fails
    try {
      const cached = await prisma.country.findMany({
        orderBy: { name: 'asc' },
      });
      return cached as Country[];
    } catch {
      return [];
    }
  }
}

/**
 * Fetch regions/states for a country
 */
export async function getStates(countryCode: string): Promise<State[]> {
  try {
    // Check cache first
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
    });

    if (!country) {
      console.warn(`[PlaceDB] Country not found: ${countryCode}`);
      return [];
    }

    const cachedStates = await prisma.state.findMany({
      where: { countryId: country.id },
      orderBy: { name: 'asc' },
      select: { code: true, name: true },
    });

    if (cachedStates.length > 0) {
      return cachedStates as State[];
    }

    // Fetch from API
    console.log(`[PlaceDB] Fetching regions for ${countryCode}...`);
    const res = await fetch(
      `${PLACEDB_API}/regions/${countryCode}.json`,
      {
        headers: { 'User-Agent': 'CMMM-App/1.0' },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[PlaceDB] No regions found for ${countryCode}`);
        return [];
      }
      throw new Error(`PlaceDB API error: ${res.status}`);
    }

    const data = await res.json();
    const states: State[] = data.map((r: any) => ({
      code: r.code || r.id,
      name: r.name,
    }));

    // Cache in database
    for (const state of states) {
      await prisma.state.upsert({
        where: {
          countryId_code: {
            countryId: country.id,
            code: state.code,
          },
        },
        update: { name: state.name },
        create: {
          code: state.code,
          name: state.name,
          countryId: country.id,
        },
      });
    }

    return states;
  } catch (err) {
    console.error(`[PlaceDB] Error fetching states for ${countryCode}:`, err);
    return [];
  }
}

/**
 * Fetch cities for a country/region
 */
export async function getCities(
  countryCode: string,
  stateCode?: string
): Promise<City[]> {
  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
    });

    if (!country) {
      console.warn(`[PlaceDB] Country not found: ${countryCode}`);
      return [];
    }

    // If state provided, filter by state
    if (stateCode) {
      const state = await prisma.state.findFirst({
        where: { code: stateCode, countryId: country.id },
      });

      if (!state) {
        console.warn(`[PlaceDB] State not found: ${countryCode}/${stateCode}`);
        return [];
      }

      // Check cache
      const cachedCities = await prisma.city.findMany({
        where: { countryId: country.id, stateId: state.id },
        orderBy: { name: 'asc' },
        select: { name: true },
      });

      if (cachedCities.length > 0) {
        return cachedCities as City[];
      }

      // Fetch from API using admin1_id
      console.log(`[PlaceDB] Fetching cities for ${countryCode}/${stateCode}...`);
      const res = await fetch(
        `${PLACEDB_API}/cities/${countryCode}/${state.code}.json`,
        {
          headers: { 'User-Agent': 'CMMM-App/1.0' },
        }
      );

      if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`PlaceDB API error: ${res.status}`);
      }

      const data = await res.json();
      const cities: City[] = data.map((c: any) => ({
        name: c.name,
      }));

      // Cache in database
      for (const city of cities) {
        await prisma.city.upsert({
          where: {
            countryId_stateId_name: {
              countryId: country.id,
              stateId: state.id,
              name: city.name,
            },
          },
          update: {},
          create: {
            name: city.name,
            countryId: country.id,
            stateId: state.id,
          },
        });
      }

      return cities;
    }

    // No state provided — get all cities for country
    const cachedCities = await prisma.city.findMany({
      where: { countryId: country.id, stateId: null },
      orderBy: { name: 'asc' },
      select: { name: true },
    });

    return cachedCities as City[];
  } catch (err) {
    console.error(
      `[PlaceDB] Error fetching cities for ${countryCode}/${stateCode}:`,
      err
    );
    return [];
  }
}

/**
 * Get districts/subdistricts for a city
 * Limited support — only detailed for specific countries
 */
export async function getDistricts(
  countryCode: string,
  cityName: string,
  stateCode?: string
): Promise<District[]> {
  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
    });

    if (!country) return [];

    // Find city
    let city;
    if (stateCode) {
      const state = await prisma.state.findFirst({
        where: { code: stateCode, countryId: country.id },
      });

      if (!state) return [];

      city = await prisma.city.findFirst({
        where: { name: cityName, countryId: country.id, stateId: state.id },
      });
    } else {
      city = await prisma.city.findFirst({
        where: { name: cityName, countryId: country.id },
      });
    }

    if (!city) return [];

    // Check cache
    const cachedDistricts = await prisma.district.findMany({
      where: { cityId: city.id },
      orderBy: { name: 'asc' },
      select: { name: true },
    });

    return cachedDistricts as District[];
  } catch (err) {
    console.error(
      `[PlaceDB] Error fetching districts for ${countryCode}/${cityName}:`,
      err
    );
    return [];
  }
}

/**
 * Get postal codes for a city
 */
export async function getPostalCodes(
  countryCode: string,
  cityName: string
): Promise<string[]> {
  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode },
    });

    if (!country) return [];

    const city = await prisma.city.findFirst({
      where: { name: cityName, countryId: country.id },
    });

    if (!city) return [];

    const postalCodes = await prisma.postalCode.findMany({
      where: { cityId: city.id },
      select: { code: true },
    });

    return postalCodes.map((pc) => pc.code);
  } catch (err) {
    console.error(
      `[PlaceDB] Error fetching postal codes for ${countryCode}/${cityName}:`,
      err
    );
    return [];
  }
}
