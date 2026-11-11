const path = require('path');
const dbClient = require(path.join(__dirname, '..', 'packages', 'db', 'dist', 'index.js')).default;

const newElements = [
  { imageUrl: '/assets/elements/table_wood_dining.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/table_cafe_long.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/desktop_table_dual.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/desktop_table_pc.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/chair_office_swivel.svg', width: 1, height: 1, static: false },
  { imageUrl: '/assets/elements/chair_cafe_wood.svg', width: 1, height: 1, static: false },
  { imageUrl: '/assets/elements/chair_gaming_bucket.svg', width: 1, height: 1, static: false },
  { imageUrl: '/assets/elements/wall_wood_h.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/wall_wood_v.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/wall_glass_partition.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/wall_brick_divider.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/cafe_vending_machine.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/cafe_counter_snack.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/cafe_booth_dining.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/cafe_trash_recycling.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/gaming_rgb_station.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/gaming_beanbag_chair.svg', width: 1, height: 1, static: false },
  { imageUrl: '/assets/elements/gaming_retro_shooter.svg', width: 1, height: 1, static: true },
  { imageUrl: '/assets/elements/meeting_whiteboard.svg', width: 2, height: 1, static: true },
  { imageUrl: '/assets/elements/meeting_conference_table.svg', width: 2, height: 2, static: true },
];

async function seed() {
  console.log('--- Step 1: Registering 20 New Room Elements ---');
  const elementMap = {};

  // Fetch all existing elements first
  const existingAll = await dbClient.element.findMany();
  existingAll.forEach(e => { elementMap[e.imageUrl] = e.id; });

  for (const el of newElements) {
    if (!elementMap[el.imageUrl]) {
      const created = await dbClient.element.create({
        data: {
          imageUrl: el.imageUrl,
          width: el.width,
          height: el.height,
          static: el.static,
        }
      });
      elementMap[el.imageUrl] = created.id;
      console.log('Registered element:', el.imageUrl, '-> ID:', created.id);
    } else {
      console.log('Element already exists:', el.imageUrl);
    }
  }

  console.log('--- Step 2: Assembling Gather & Zepto Multi-Room Map Layout ---');
  // Dimensions 30 x 22
  const mapWidth = 30;
  const mapHeight = 22;
  const mapElements = [];

  const add = (imgUrl, x, y) => {
    const elId = elementMap[imgUrl];
    if (elId) {
      mapElements.push({ elementId: elId, x, y });
    }
  };

  // 1. Dividing Walls (Separating Cafeteria, Gaming Room, Boardroom, Bullpen)
  // Horizontal dividing wall at y=10 (with corridor opening at x=13..16)
  for (let x = 1; x < 13; x++) {
    add('/assets/elements/wall_brick_divider.svg', x, 10);
  }
  for (let x = 17; x < 29; x++) {
    add('/assets/elements/wall_glass_partition.svg', x, 10);
  }

  // Vertical dividing wall at x=14 (with doorways into rooms)
  for (let y = 1; y < 9; y++) {
    if (y !== 4 && y !== 5) { // doorway to cafeteria / boardroom
      add('/assets/elements/wall_wood_v.svg', 14, y);
    }
  }
  for (let y = 12; y < 21; y++) {
    if (y !== 15 && y !== 16) { // doorway to gaming / tech bullpen
      add('/assets/elements/wall_wood_v.svg', 14, y);
    }
  }

  // 2. ROOM 1: ☕ THE CAFETERIA & SNACK LOUNGE (Top Left: x 1..13, y 1..9)
  add('/assets/elements/cafe_counter_snack.svg', 2, 2);
  add('/assets/elements/coffee_espresso_bar.svg', 5, 2);
  add('/assets/elements/cafe_vending_machine.svg', 7, 2);
  add('/assets/elements/cafe_trash_recycling.svg', 9, 2);
  add('/assets/elements/plant_monstera.svg', 12, 2);

  add('/assets/elements/cafe_booth_dining.svg', 2, 5);
  add('/assets/elements/table_cafe_long.svg', 6, 5);
  add('/assets/elements/table_wood_dining.svg', 10, 5);
  add('/assets/elements/chair_cafe_wood.svg', 10, 4);
  add('/assets/elements/chair_cafe_wood.svg', 10, 7);
  add('/assets/elements/pet_corgi.svg', 2, 8);

  // 3. ROOM 2: 🎮 NEON GAMING & ESPORTS ARENA (Bottom Left: x 1..13, y 11..21)
  add('/assets/elements/gaming_retro_shooter.svg', 2, 12);
  add('/assets/elements/arcade_machine.svg', 4, 12);
  add('/assets/elements/gaming_rgb_station.svg', 7, 12);
  add('/assets/elements/chair_gaming_bucket.svg', 8, 14);
  add('/assets/elements/gaming_rgb_station.svg', 10, 12);
  add('/assets/elements/chair_gaming_bucket.svg', 11, 14);

  add('/assets/elements/gaming_beanbag_chair.svg', 2, 16);
  add('/assets/elements/gaming_beanbag_chair.svg', 4, 16);
  add('/assets/elements/cozy_rug_nordic.svg', 7, 16);
  add('/assets/elements/pet_black_cat.svg', 3, 19);
  add('/assets/elements/plant_monstera.svg', 12, 19);

  // 4. ROOM 3: 💼 EXECUTIVE BOARDROOM & PRESENTATION SUITE (Top Right: x 15..29, y 1..9)
  add('/assets/elements/meeting_whiteboard.svg', 18, 2);
  add('/assets/elements/meeting_conference_table.svg', 20, 4);
  add('/assets/elements/couch_leather_brown.svg', 25, 4);
  add('/assets/elements/plant_sakura_bonsai.svg', 27, 2);
  add('/assets/elements/bookshelf_library.svg', 27, 7);

  // 5. ROOM 4: 💻 OPEN TECH BULLPEN & WORKSTATIONS (Bottom Right: x 15..29, y 11..21)
  // Workstation row 1
  add('/assets/elements/desktop_table_dual.svg', 16, 12);
  add('/assets/elements/chair_office_swivel.svg', 17, 14);
  add('/assets/elements/desktop_table_dual.svg', 19, 12);
  add('/assets/elements/chair_office_swivel.svg', 20, 14);
  add('/assets/elements/desktop_table_dual.svg', 22, 12);
  add('/assets/elements/chair_office_swivel.svg', 23, 14);

  // Workstation row 2
  add('/assets/elements/workstation_triple.svg', 16, 16);
  add('/assets/elements/chair_office_swivel.svg', 17, 18);
  add('/assets/elements/workstation_triple.svg', 20, 16);
  add('/assets/elements/chair_office_swivel.svg', 21, 18);

  // Tech infrastructure
  add('/assets/elements/server_rack.svg', 26, 12);
  add('/assets/elements/server_rack.svg', 26, 14);
  add('/assets/elements/water_cooler.svg', 26, 17);
  add('/assets/elements/plant_monstera.svg', 27, 19);

  console.log('Total map elements to place:', mapElements.length);

  // 6. Create or Update Pre-defined Map in DB
  const mapName = 'Gather & Zepto Multi-Room Campus (Cafeteria + Gaming + Boardroom)';
  let map = await dbClient.map.findFirst({
    where: { name: mapName }
  });

  if (!map) {
    map = await dbClient.map.create({
      data: {
        name: mapName,
        width: mapWidth,
        height: mapHeight,
        thumbnail: '/assets/elements/workstation_triple.svg',
        mapElements: {
          create: mapElements.map(e => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          }))
        }
      }
    });
    console.log('Created Predefined Map:', map.name, '-> ID:', map.id);
  } else {
    console.log('Predefined Map already exists with ID:', map.id);
  }

  // 7. Auto-create a Shared Featured Public Space from this map so EVERY user sees it!
  const publicSpaceName = '🏛️ Gather Town & Zepto Multi-Room Campus';
  // Use admin user as creator
  const adminUser = await dbClient.user.findFirst({
    where: { role: 'Admin' }
  });

  if (adminUser) {
    let publicSpace = await dbClient.space.findFirst({
      where: { name: publicSpaceName }
    });

    if (!publicSpace) {
      publicSpace = await dbClient.$transaction(async (tx) => {
        const space = await tx.space.create({
          data: {
            name: publicSpaceName,
            width: mapWidth,
            height: mapHeight,
            creatorId: adminUser.id,
          }
        });

        await tx.spaceElements.createMany({
          data: mapElements.map(e => ({
            spaceId: space.id,
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          }))
        });

        return space;
      });
      console.log('Created Featured Public Space:', publicSpace.name, '-> ID:', publicSpace.id);
    } else {
      console.log('Featured Public Space already exists with ID:', publicSpace.id);
    }
  }

  console.log('--- Seeding Multi-Room Campus Complete! ---');
  process.exit(0);
}

seed().catch(err => {
  console.error('Failed to seed multi-room map:', err);
  process.exit(1);
});

