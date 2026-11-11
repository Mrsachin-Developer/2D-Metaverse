const path = require('path');
const dbClient = require(path.join(__dirname, '..', 'packages', 'db', 'dist', 'index.js')).default;

async function seedAdditionalMaps() {
  console.log('--- Step 1: Loading Element IDs from Database ---');
  const allElements = await dbClient.element.findMany();
  const elementMap = {};
  allElements.forEach(e => {
    elementMap[e.imageUrl] = e.id;
  });
  console.log(`Loaded ${allElements.length} elements from DB`);

  // Helper function to safely add elements
  const createMapElementList = (specs) => {
    const list = [];
    specs.forEach(([img, x, y]) => {
      const elId = elementMap[img];
      if (elId) {
        list.push({ elementId: elId, x, y });
      } else {
        console.warn('Missing element for imageUrl:', img);
      }
    });
    return list;
  };

  // ----------------------------------------------------
  // MAP 1: ☕ Cozy Coffee Lounge & Chill Speakeasy (20x15)
  // ----------------------------------------------------
  console.log('--- Step 2: Creating Map 1: Cozy Coffee Lounge ---');
  const coffeeSpecs = [
    // Espresso & Snack Bar
    ['/assets/elements/cafe_counter_snack.svg', 2, 2],
    ['/assets/elements/cafe_counter_snack.svg', 4, 2],
    ['/assets/elements/coffee_espresso_bar.svg', 6, 2],
    ['/assets/elements/cafe_vending_machine.svg', 1, 2],
    ['/assets/elements/cafe_trash_recycling.svg', 1, 4],
    ['/assets/elements/water_cooler.svg', 1, 5],

    // Glass Divider Wall
    ['/assets/elements/wall_glass_partition.svg', 8, 1],
    ['/assets/elements/wall_glass_partition.svg', 8, 2],
    ['/assets/elements/wall_glass_partition.svg', 8, 3],
    ['/assets/elements/wall_glass_partition.svg', 8, 4],

    // Living Room & Library Lounge (Top-Right)
    ['/assets/elements/bookshelf_library.svg', 17, 1],
    ['/assets/elements/bookshelf_library.svg', 18, 1],
    ['/assets/elements/cozy_rug_nordic.svg', 11, 2],
    ['/assets/elements/cozy_rug_nordic.svg', 14, 2],
    ['/assets/elements/couch_leather_brown.svg', 11, 4],
    ['/assets/elements/couch_modern_charcoal.svg', 14, 4],
    ['/assets/elements/table_wood_dining.svg', 12, 2],
    ['/assets/elements/table_wood_dining.svg', 15, 2],
    ['/assets/elements/plant_sakura_bonsai.svg', 18, 4],
    ['/assets/elements/pet_corgi.svg', 13, 3],

    // Booth Dining Alcove (Bottom-Left)
    ['/assets/elements/cafe_booth_dining.svg', 2, 9],
    ['/assets/elements/cafe_booth_dining.svg', 5, 9],
    ['/assets/elements/table_cafe_long.svg', 2, 11],
    ['/assets/elements/table_cafe_long.svg', 5, 11],
    ['/assets/elements/chair_cafe_wood.svg', 2, 12],
    ['/assets/elements/chair_cafe_wood.svg', 3, 12],
    ['/assets/elements/chair_cafe_wood.svg', 5, 12],
    ['/assets/elements/chair_cafe_wood.svg', 6, 12],
    ['/assets/elements/plant_monstera.svg', 1, 10],
    ['/assets/elements/plant_monstera.svg', 8, 10],

    // Casual High-Top Chat & Games (Bottom-Right)
    ['/assets/elements/table_wood_dining.svg', 12, 10],
    ['/assets/elements/table_wood_dining.svg', 16, 10],
    ['/assets/elements/chair_cafe_wood.svg', 12, 9],
    ['/assets/elements/chair_cafe_wood.svg', 12, 11],
    ['/assets/elements/chair_cafe_wood.svg', 16, 9],
    ['/assets/elements/chair_cafe_wood.svg', 16, 11],
    ['/assets/elements/arcade_machine.svg', 18, 12],
    ['/assets/elements/pet_black_cat.svg', 14, 11],
    ['/assets/elements/plant_monstera.svg', 11, 13],
  ];

  const coffeeElements = createMapElementList(coffeeSpecs);
  console.log(`Coffee Lounge elements count: ${coffeeElements.length}`);

  const coffeeMap = await dbClient.map.create({
    data: {
      name: 'Cozy Rooftop Coffee Lounge & Social Mixer',
      width: 20,
      height: 15,
      thumbnail: '/assets/elements/coffee_espresso_bar.svg',
      mapElements: {
        create: coffeeElements
      }
    }
  });
  console.log('Created Map 1 -> ID:', coffeeMap.id);

  // ----------------------------------------------------
  // MAP 2: 🎤 Keynote Auditorium & All-Hands Hall (22x16)
  // ----------------------------------------------------
  console.log('--- Step 3: Creating Map 2: Keynote Auditorium ---');
  const auditoriumSpecs = [
    // Stage Backdrop Walls
    ['/assets/elements/wall_wood_h.svg', 6, 1],
    ['/assets/elements/wall_wood_h.svg', 7, 1],
    ['/assets/elements/wall_wood_h.svg', 8, 1],
    ['/assets/elements/wall_wood_h.svg', 9, 1],
    ['/assets/elements/wall_wood_h.svg', 10, 1],
    ['/assets/elements/wall_wood_h.svg', 11, 1],
    ['/assets/elements/wall_wood_h.svg', 12, 1],
    ['/assets/elements/wall_wood_h.svg', 13, 1],
    ['/assets/elements/wall_wood_h.svg', 14, 1],
    ['/assets/elements/wall_wood_h.svg', 15, 1],

    // Stage Presentation Screens & Podium
    ['/assets/elements/meeting_whiteboard.svg', 8, 2],
    ['/assets/elements/meeting_whiteboard.svg', 12, 2],
    ['/assets/elements/desktop_table_pc.svg', 10, 3],
    ['/assets/elements/plant_sakura_bonsai.svg', 7, 3],
    ['/assets/elements/plant_monstera.svg', 14, 3],

    // Audience Theater Seating Row 1
    ['/assets/elements/table_cafe_long.svg', 6, 6],
    ['/assets/elements/table_cafe_long.svg', 9, 6],
    ['/assets/elements/table_cafe_long.svg', 12, 6],
    ['/assets/elements/chair_office_swivel.svg', 6, 7],
    ['/assets/elements/chair_office_swivel.svg', 7, 7],
    ['/assets/elements/chair_office_swivel.svg', 9, 7],
    ['/assets/elements/chair_office_swivel.svg', 10, 7],
    ['/assets/elements/chair_office_swivel.svg', 12, 7],
    ['/assets/elements/chair_office_swivel.svg', 13, 7],

    // Audience Theater Seating Row 2
    ['/assets/elements/table_cafe_long.svg', 6, 9],
    ['/assets/elements/table_cafe_long.svg', 9, 9],
    ['/assets/elements/table_cafe_long.svg', 12, 9],
    ['/assets/elements/chair_office_swivel.svg', 6, 10],
    ['/assets/elements/chair_office_swivel.svg', 7, 10],
    ['/assets/elements/chair_office_swivel.svg', 9, 10],
    ['/assets/elements/chair_office_swivel.svg', 10, 10],
    ['/assets/elements/chair_office_swivel.svg', 12, 10],
    ['/assets/elements/chair_office_swivel.svg', 13, 10],

    // Audience Theater Seating Row 3
    ['/assets/elements/table_cafe_long.svg', 6, 12],
    ['/assets/elements/table_cafe_long.svg', 9, 12],
    ['/assets/elements/table_cafe_long.svg', 12, 12],
    ['/assets/elements/chair_office_swivel.svg', 6, 13],
    ['/assets/elements/chair_office_swivel.svg', 7, 13],
    ['/assets/elements/chair_office_swivel.svg', 9, 13],
    ['/assets/elements/chair_office_swivel.svg', 10, 13],
    ['/assets/elements/chair_office_swivel.svg', 12, 13],
    ['/assets/elements/chair_office_swivel.svg', 13, 13],

    // Left Wing VIP Speaker Lounge Divider
    ['/assets/elements/wall_glass_partition.svg', 4, 1],
    ['/assets/elements/wall_glass_partition.svg', 4, 2],
    ['/assets/elements/wall_glass_partition.svg', 4, 3],
    ['/assets/elements/wall_glass_partition.svg', 4, 5],
    ['/assets/elements/wall_glass_partition.svg', 4, 6],
    ['/assets/elements/wall_glass_partition.svg', 4, 7],
    ['/assets/elements/wall_glass_partition.svg', 4, 8],

    // VIP Speaker Furniture
    ['/assets/elements/couch_leather_brown.svg', 1, 3],
    ['/assets/elements/table_wood_dining.svg', 1, 5],
    ['/assets/elements/cozy_rug_nordic.svg', 1, 6],
    ['/assets/elements/coffee_espresso_bar.svg', 1, 9],
    ['/assets/elements/water_cooler.svg', 1, 11],

    // Right Wing AV Tech Booth Divider
    ['/assets/elements/wall_brick_divider.svg', 17, 1],
    ['/assets/elements/wall_brick_divider.svg', 17, 2],
    ['/assets/elements/wall_brick_divider.svg', 17, 3],
    ['/assets/elements/wall_brick_divider.svg', 17, 5],
    ['/assets/elements/wall_brick_divider.svg', 17, 6],
    ['/assets/elements/wall_brick_divider.svg', 17, 7],
    ['/assets/elements/wall_brick_divider.svg', 17, 8],

    // Tech Booth Furniture
    ['/assets/elements/server_rack.svg', 19, 2],
    ['/assets/elements/server_rack.svg', 20, 2],
    ['/assets/elements/desktop_table_dual.svg', 18, 5],
    ['/assets/elements/chair_gaming_bucket.svg', 18, 6],
    ['/assets/elements/chair_gaming_bucket.svg', 19, 6],
    ['/assets/elements/arcade_machine.svg', 20, 10],
    ['/assets/elements/pet_corgi.svg', 18, 9],
  ];

  const auditoriumElements = createMapElementList(auditoriumSpecs);
  console.log(`Auditorium elements count: ${auditoriumElements.length}`);

  const auditoriumMap = await dbClient.map.create({
    data: {
      name: 'Keynote Auditorium & All-Hands Hall',
      width: 22,
      height: 16,
      thumbnail: '/assets/elements/meeting_whiteboard.svg',
      mapElements: {
        create: auditoriumElements
      }
    }
  });
  console.log('Created Map 2 -> ID:', auditoriumMap.id);

  // ----------------------------------------------------
  // Step 4: Create Public Space Instances for Immediate Exploration
  // ----------------------------------------------------
  const adminUser = await dbClient.user.findFirst({
    where: { role: 'Admin' }
  });

  if (adminUser) {
    console.log('--- Step 4: Creating Public Spaces for Admin User ---', adminUser.id);

    // Space 1: Coffee Lounge
    const coffeeSpace = await dbClient.space.create({
      data: {
        name: '☕ Cozy Rooftop Coffee Lounge',
        width: 20,
        height: 15,
        creatorId: adminUser.id,
        elements: {
          create: coffeeElements.map(e => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          }))
        }
      }
    });
    console.log('Created Public Space 1 -> ID:', coffeeSpace.id);

    // Space 2: Keynote Auditorium
    const auditoriumSpace = await dbClient.space.create({
      data: {
        name: '🎤 Keynote Auditorium & All-Hands',
        width: 22,
        height: 16,
        creatorId: adminUser.id,
        elements: {
          create: auditoriumElements.map(e => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          }))
        }
      }
    });
    console.log('Created Public Space 2 -> ID:', auditoriumSpace.id);

    console.log('\n=== SUMMARY OF NEW ASSETS ===');
    console.log('Map 1 ID:', coffeeMap.id, '(20x15, 39 elements)');
    console.log('Space 1 ID:', coffeeSpace.id);
    console.log('Map 2 ID:', auditoriumMap.id, '(22x16, 54 elements)');
    console.log('Space 2 ID:', auditoriumSpace.id);
  }
}

seedAdditionalMaps()
  .then(() => {
    console.log('Done seeding additional maps!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });

