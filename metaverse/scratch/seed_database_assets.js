const path = require('path');
const dbClient = require(path.join(__dirname, '..', 'packages', 'db', 'dist', 'index.js')).default;

const avatarsToSeed = [
  { name: 'Phillip (Adventurer)', imageUrl: '/assets/avatars/avatar_phillip.svg' },
  { name: 'Alex (Coder)', imageUrl: '/assets/avatars/avatar_alex.svg' },
  { name: 'Jessica (Tech Lead)', imageUrl: '/assets/avatars/avatar_jessica.svg' },
  { name: 'Rasmus (Cyber Gamer)', imageUrl: '/assets/avatars/avatar_rasmus.svg' },
  { name: 'Lauren (Designer)', imageUrl: '/assets/avatars/avatar_lauren.svg' },
  { name: 'Matt (Executive)', imageUrl: '/assets/avatars/avatar_matt.svg' },
  { name: 'Gaby (Artist)', imageUrl: '/assets/avatars/avatar_gaby.svg' },
  { name: 'Zepto (Speed Runner)', imageUrl: '/assets/avatars/avatar_zepto.svg' },
  { name: 'Corgi Explorer', imageUrl: '/assets/avatars/avatar_corgi.svg' },
  { name: 'Aria (Bio-Engineer)', imageUrl: '/assets/avatars/avatar_aria.svg' },
];

const elementsToSeed = [
  { imageUrl: '/assets/elements/workstation_triple.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/desk_wood_laptop.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/couch_leather_brown.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/couch_modern_charcoal.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/meeting_table.svg', width: 2, height: 2, static: true },
  { imageUrl: '/assets/elements/plant_monstera.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/plant_sakura_bonsai.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/coffee_espresso_bar.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/pet_corgi.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/pet_black_cat.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/arcade_machine.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/server_rack.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/water_cooler.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/bookshelf_library.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/cozy_rug_nordic.svg', width: 2, height: 2, static: false },
];

async function seed() {
  console.log('--- Seeding Pixel Avatars into Database ---');
  for (const a of avatarsToSeed) {
    const existing = await dbClient.avatar.findFirst({
      where: { imageUrl: a.imageUrl }
    });
    if (!existing) {
      const created = await dbClient.avatar.create({
        data: { name: a.name, imageUrl: a.imageUrl }
      });
      console.log('Created avatar:', a.name, '-> ID:', created.id);
    } else {
      console.log('Avatar already exists:', a.name);
    }
  }

  console.log('--- Seeding Pixel Elements into Database ---');
  for (const e of elementsToSeed) {
    const existing = await dbClient.element.findFirst({
      where: { imageUrl: e.imageUrl }
    });
    if (!existing) {
      const created = await dbClient.element.create({
        data: {
          imageUrl: e.imageUrl,
          width: e.width,
          height: e.height,
          static: e.static
        }
      });
      console.log('Created element:', e.imageUrl, '-> ID:', created.id);
    } else {
      console.log('Element already exists:', e.imageUrl);
    }
  }

  console.log('--- Seeding complete! ---');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

