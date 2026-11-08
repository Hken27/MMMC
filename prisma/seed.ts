import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PlaceDB geographic data...');

  // ===== INDONESIA =====
  const idCountry = await prisma.country.upsert({
    where: { code: 'ID' },
    update: {},
    create: {
      code: 'ID',
      name: 'Indonesia',
      dial: '+62',
    },
  });

  console.log('Created/Updated Indonesia');

  // Indonesia States
  const idStates = [
    { code: 'AC', name: 'Aceh' },
    { code: 'SU', name: 'Sumatera Utara' },
    { code: 'SB', name: 'Sumatera Barat' },
    { code: 'RO', name: 'Riau' },
    { code: 'JA', name: 'Jambi' },
    { code: 'SL', name: 'Sumatera Selatan' },
    { code: 'KB', name: 'Kepulauan Bangka Belitung' },
    { code: 'LA', name: 'Lampung' },
    { code: 'JK', name: 'Jakarta' },
    { code: 'JB', name: 'Jawa Barat' },
    { code: 'JT', name: 'Jawa Tengah' },
    { code: 'YO', name: 'Yogyakarta' },
    { code: 'JI', name: 'Jawa Timur' },
    { code: 'BT', name: 'Banten' },
    { code: 'BA', name: 'Bali' },
    { code: 'NB', name: 'Nusa Tenggara Barat' },
    { code: 'NT', name: 'Nusa Tenggara Timur' },
    { code: 'KB2', name: 'Kalimantan Barat' },
    { code: 'KT', name: 'Kalimantan Tengah' },
    { code: 'KS', name: 'Kalimantan Selatan' },
    { code: 'KI', name: 'Kalimantan Timur' },
    { code: 'KU', name: 'Kalimantan Utara' },
    { code: 'SA', name: 'Sulawesi Utara' },
    { code: 'ST', name: 'Sulawesi Tengah' },
    { code: 'SG', name: 'Sulawesi Selatan' },
    { code: 'SB2', name: 'Sulawesi Barat' },
    { code: 'SR', name: 'Sulawesi Tenggara' },
    { code: 'MA', name: 'Maluku' },
    { code: 'MU', name: 'Maluku Utara' },
    { code: 'PA', name: 'Papua' },
    { code: 'PB', name: 'Papua Barat' },
  ];

  const stateMap: { [key: string]: string } = {};

  for (const state of idStates) {
    const createdState = await prisma.state.upsert({
      where: {
        countryId_code: {
          countryId: idCountry.id,
          code: state.code,
        },
      },
      update: {},
      create: {
        code: state.code,
        name: state.name,
        countryId: idCountry.id,
      },
    });
    stateMap[state.code] = createdState.id;
  }

  console.log('Created/Updated Indonesia states');

  // Jakarta cities & districts
  const jakartaState = stateMap['JK'];
  const jakartaCity = await prisma.city.upsert({
    where: {
      countryId_stateId_name: {
        countryId: idCountry.id,
        stateId: jakartaState,
        name: 'Jakarta',
      },
    },
    update: {},
    create: {
      name: 'Jakarta',
      countryId: idCountry.id,
      stateId: jakartaState,
    },
  });

  const jakartaDistricts = [
    'Central Jakarta',
    'North Jakarta',
    'East Jakarta',
    'South Jakarta',
    'West Jakarta',
  ];

  for (const district of jakartaDistricts) {
    await prisma.district.upsert({
      where: {
        cityId_name: {
          cityId: jakartaCity.id,
          name: district,
        },
      },
      update: {},
      create: {
        name: district,
        countryId: idCountry.id,
        stateId: jakartaState,
        cityId: jakartaCity.id,
      },
    });
  }

  console.log('Created/Updated Jakarta cities & districts');

  // ===== UNITED STATES =====
  const usCountry = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      code: 'US',
      name: 'United States',
      dial: '+1',
    },
  });

  const usStates = [
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' },
    { code: 'NY', name: 'New York' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ];

  const usStateMap: { [key: string]: string } = {};

  for (const state of usStates) {
    const createdState = await prisma.state.upsert({
      where: {
        countryId_code: {
          countryId: usCountry.id,
          code: state.code,
        },
      },
      update: {},
      create: {
        code: state.code,
        name: state.name,
        countryId: usCountry.id,
      },
    });
    usStateMap[state.code] = createdState.id;
  }

  // California cities
  const caCities = ['Los Angeles', 'San Francisco', 'San Diego'];
  for (const city of caCities) {
    await prisma.city.upsert({
      where: {
        countryId_stateId_name: {
          countryId: usCountry.id,
          stateId: usStateMap['CA'],
          name: city,
        },
      },
      update: {},
      create: {
        name: city,
        countryId: usCountry.id,
        stateId: usStateMap['CA'],
      },
    });
  }

  console.log('Created/Updated USA states & cities');

  // ===== SINGAPORE (no states) =====
  const sgCountry = await prisma.country.upsert({
    where: { code: 'SG' },
    update: {},
    create: {
      code: 'SG',
      name: 'Singapore',
      dial: '+65',
    },
  });

  await prisma.city.upsert({
    where: {
      countryId_stateId_name: {
        countryId: sgCountry.id,
        stateId: null,
        name: 'Singapore',
      },
    },
    update: {},
    create: {
      name: 'Singapore',
      countryId: sgCountry.id,
      stateId: null,
    },
  });

  console.log('Created/Updated Singapore');

  console.log('✅ Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
