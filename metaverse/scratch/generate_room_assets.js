const fs = require('fs');
const path = require('path');

const elementsDir = path.join(__dirname, '..', 'apps', 'frontend', 'public', 'assets', 'elements');
fs.mkdirSync(elementsDir, { recursive: true });

function makeSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
${content}
</svg>`;
}

// ---------------------------------------------------------------------
// 1. TABLES & DESKTOPS
// ---------------------------------------------------------------------

// Table: Oak Cafe/Dining Table (1x1 - 64x64)
const tableWoodDining = makeSvg(64, 64, `
  <!-- Shadow -->
  <ellipse cx="32" cy="54" rx="22" ry="6" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- 4 Wood Legs -->
  <rect x="14" y="34" width="4" height="20" fill="#451A03"/>
  <rect x="46" y="34" width="4" height="20" fill="#451A03"/>
  <rect x="18" y="30" width="3" height="18" fill="#78350F"/>
  <rect x="43" y="30" width="3" height="18" fill="#78350F"/>
  <!-- Oak Table Top Surface -->
  <rect x="10" y="16" width="44" height="20" fill="#78350F" rx="3"/>
  <rect x="12" y="18" width="40" height="16" fill="#B45309" rx="2"/>
  <line x1="12" y1="24" x2="52" y2="24" stroke="#92400E" stroke-width="1"/>
  <!-- Center Salt/Pepper & Coffee Cup -->
  <circle cx="28" cy="24" r="2.5" fill="#EF4444" shape-rendering="auto"/>
  <circle cx="36" cy="24" r="2" fill="#E2E8F0" shape-rendering="auto"/>
`);

// Table: Cafeteria Long Bench Table (2x1 - 128x64)
const tableCafeLong = makeSvg(128, 64, `
  <rect x="12" y="52" width="104" height="8" fill="rgba(0,0,0,0.3)" rx="3"/>
  <!-- Metal Underframe -->
  <rect x="20" y="36" width="6" height="20" fill="#334155"/>
  <rect x="102" y="36" width="6" height="20" fill="#334155"/>
  <rect x="20" y="48" width="88" height="4" fill="#475569"/>
  <!-- Formica / Pine Wood Top Surface -->
  <rect x="10" y="16" width="108" height="24" fill="#855F37" rx="3"/>
  <rect x="12" y="18" width="104" height="20" fill="#A07040" rx="2"/>
  <line x1="12" y1="26" x2="116" y2="26" stroke="#6D4A27" stroke-width="1"/>
  <!-- Cafeteria Meal Trays & Soda Cans -->
  <rect x="26" y="22" width="18" height="12" fill="#E2E8F0" rx="1"/>
  <rect x="28" y="24" width="8" height="4" fill="#EF4444"/>
  <rect x="28" y="29" width="6" height="3" fill="#22C55E"/>
  <circle cx="48" cy="28" r="2" fill="#38BDF8" shape-rendering="auto"/>
  <!-- Second Tray -->
  <rect x="74" y="22" width="18" height="12" fill="#E2E8F0" rx="1"/>
  <rect x="76" y="24" width="9" height="4" fill="#F59E0B"/>
  <circle cx="96" cy="28" r="2" fill="#F43F5E" shape-rendering="auto"/>
`);

// Desktop Table: Dual Monitor Developer Workstation (2x1 - 128x64)
const desktopTableDual = makeSvg(128, 64, `
  <rect x="10" y="52" width="108" height="8" fill="rgba(0,0,0,0.3)" rx="4"/>
  <!-- Sturdy Desk Frame -->
  <rect x="14" y="18" width="100" height="36" fill="#1E293B" rx="3"/>
  <rect x="16" y="20" width="96" height="32" fill="#334155" rx="2"/>
  <!-- Left Screen (Code / Terminal) -->
  <rect x="24" y="6" width="34" height="22" fill="#0F172A" rx="2"/>
  <rect x="26" y="8" width="30" height="18" fill="#0369A1" rx="1"/>
  <line x1="28" y1="12" x2="52" y2="12" stroke="#BAE6FD" stroke-width="1.5"/>
  <line x1="28" y1="16" x2="44" y2="16" stroke="#BAE6FD" stroke-width="1.5"/>
  <line x1="28" y1="20" x2="48" y2="20" stroke="#BAE6FD" stroke-width="1.5"/>
  <rect x="38" y="28" width="6" height="5" fill="#64748B"/>
  <!-- Right Screen (Design / Dashboard) -->
  <rect x="66" y="6" width="34" height="22" fill="#0F172A" rx="2"/>
  <rect x="68" y="8" width="30" height="18" fill="#4C1D95" rx="1"/>
  <circle cx="83" cy="17" r="5" fill="#A855F7" shape-rendering="auto"/>
  <rect x="80" y="28" width="6" height="5" fill="#64748B"/>
  <!-- Desk Mat, Keyboard, Mouse -->
  <rect x="42" y="38" width="44" height="12" fill="#0F172A" rx="1"/>
  <rect x="46" y="40" width="22" height="7" fill="#475569" rx="1"/>
  <rect x="74" y="41" width="5" height="6" fill="#64748B" rx="2"/>
  <!-- Coffee Mug -->
  <circle cx="100" cy="40" r="3.5" fill="#EF4444" shape-rendering="auto"/>
`);

// Desktop Table: Single PC Desk (1x1 - 64x64)
const desktopTablePc = makeSvg(64, 64, `
  <rect x="6" y="52" width="52" height="6" fill="rgba(0,0,0,0.3)" rx="3"/>
  <rect x="8" y="18" width="48" height="36" fill="#1E293B" rx="3"/>
  <rect x="10" y="20" width="44" height="32" fill="#242B3D" rx="2"/>
  <!-- Monitor -->
  <rect x="18" y="8" width="28" height="18" fill="#0F172A" rx="2"/>
  <rect x="20" y="10" width="24" height="14" fill="#059669" rx="1"/>
  <line x1="22" y1="14" x2="40" y2="14" stroke="#6EE7B7" stroke-width="1.5"/>
  <line x1="22" y1="18" x2="34" y2="18" stroke="#6EE7B7" stroke-width="1.5"/>
  <rect x="30" y="26" width="4" height="4" fill="#64748B"/>
  <!-- Keyboard & Mouse -->
  <rect x="20" y="36" width="18" height="6" fill="#475569" rx="1"/>
  <rect x="42" y="37" width="4" height="5" fill="#64748B" rx="2"/>
`);

// ---------------------------------------------------------------------
// 2. CHAIRS
// ---------------------------------------------------------------------

// Chair: Office Ergonomic Swivel Chair (1x1 - 64x64)
const chairOfficeSwivel = makeSvg(64, 64, `
  <!-- Castor Wheels Shadow -->
  <ellipse cx="32" cy="54" rx="14" ry="5" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Star Base -->
  <line x1="22" y1="53" x2="42" y2="53" stroke="#1E293B" stroke-width="3"/>
  <line x1="32" y1="46" x2="32" y2="55" stroke="#1E293B" stroke-width="3"/>
  <!-- Cushion Seat -->
  <ellipse cx="32" cy="38" rx="14" ry="8" fill="#1E1B4B" shape-rendering="auto"/>
  <ellipse cx="32" cy="37" rx="12" ry="6" fill="#312E81" shape-rendering="auto"/>
  <!-- Mesh Backrest -->
  <rect x="22" y="16" width="20" height="16" fill="#1E293B" rx="4"/>
  <rect x="24" y="18" width="16" height="12" fill="#4338CA" rx="2"/>
  <!-- Armrests -->
  <rect x="16" y="28" width="4" height="12" fill="#334155" rx="1"/>
  <rect x="44" y="28" width="4" height="12" fill="#334155" rx="1"/>
`);

// Chair: Wooden Cafe Chair (1x1 - 64x64)
const chairCafeWood = makeSvg(64, 64, `
  <ellipse cx="32" cy="54" rx="12" ry="4" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Legs -->
  <line x1="24" y1="42" x2="22" y2="54" stroke="#451A03" stroke-width="2.5"/>
  <line x1="40" y1="42" x2="42" y2="54" stroke="#451A03" stroke-width="2.5"/>
  <!-- Seat Pad -->
  <rect x="22" y="34" width="20" height="8" fill="#B45309" rx="2"/>
  <rect x="24" y="35" width="16" height="6" fill="#D97706" rx="1"/>
  <!-- Curved Backrest Spindles -->
  <rect x="22" y="18" width="20" height="4" fill="#78350F" rx="2"/>
  <line x1="25" y1="22" x2="25" y2="34" stroke="#78350F" stroke-width="2"/>
  <line x1="32" y1="22" x2="32" y2="34" stroke="#78350F" stroke-width="2"/>
  <line x1="39" y1="22" x2="39" y2="34" stroke="#78350F" stroke-width="2"/>
`);

// Chair: Gaming Bucket Racing Chair (1x1 - 64x64)
const chairGamingBucket = makeSvg(64, 64, `
  <ellipse cx="32" cy="54" rx="16" ry="5" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Star Base -->
  <circle cx="32" cy="52" r="3" fill="#0284C7" shape-rendering="auto"/>
  <line x1="20" y1="52" x2="44" y2="52" stroke="#0F172A" stroke-width="3"/>
  <!-- Thick Seat Bucket -->
  <rect x="18" y="36" width="28" height="12" fill="#0F172A" rx="3"/>
  <rect x="22" y="38" width="20" height="8" fill="#0284C7" rx="2"/>
  <!-- High Racing Backrest with Wings -->
  <polygon points="20,36 18,16 26,10 38,10 46,16 44,36" fill="#0F172A"/>
  <polygon points="23,34 21,18 27,13 37,13 43,18 41,34" fill="#38BDF8"/>
  <polygon points="26,34 25,20 30,16 34,16 39,20 38,34" fill="#0284C7"/>
  <!-- Harness Holes & Head Pillow -->
  <rect x="28" y="18" width="8" height="3" fill="#0F172A" rx="1"/>
  <rect x="26" y="24" width="12" height="4" fill="#F43F5E" rx="2"/>
`);

// ---------------------------------------------------------------------
// 3. WALLS & PARTITIONS
// ---------------------------------------------------------------------

// Wall: Horizontal Oak Wood / Panel Wall (1x1 - 64x64)
const wallWoodH = makeSvg(64, 64, `
  <!-- Dark Foundation Wall Shadow -->
  <rect x="0" y="44" width="64" height="20" fill="#141824"/>
  <!-- Main Wall Structure -->
  <rect x="0" y="0" width="64" height="48" fill="#451A03"/>
  <!-- Oak Planks with Bevel Trim -->
  <rect x="0" y="2" width="64" height="14" fill="#78350F"/>
  <rect x="0" y="18" width="64" height="14" fill="#855F37"/>
  <rect x="0" y="34" width="64" height="12" fill="#5C3A1E"/>
  <line x1="0" y1="16" x2="64" y2="16" stroke="#2E1202" stroke-width="2"/>
  <line x1="0" y1="32" x2="64" y2="32" stroke="#2E1202" stroke-width="2"/>
  <!-- Baseboard trim -->
  <rect x="0" y="46" width="64" height="4" fill="#2E1202"/>
`);

// Wall: Vertical Wood Wall Segment (1x1 - 64x64)
const wallWoodV = makeSvg(64, 64, `
  <rect x="18" y="0" width="28" height="64" fill="#451A03"/>
  <rect x="20" y="0" width="24" height="64" fill="#78350F"/>
  <line x1="20" y1="0" x2="20" y2="64" stroke="#855F37" stroke-width="2"/>
  <line x1="44" y1="0" x2="44" y2="64" stroke="#2E1202" stroke-width="2"/>
  <!-- Vertical Wood Joists -->
  <rect x="22" y="10" width="20" height="2" fill="#2E1202"/>
  <rect x="22" y="30" width="20" height="2" fill="#2E1202"/>
  <rect x="22" y="50" width="20" height="2" fill="#2E1202"/>
`);

// Wall: Modern Office Glass Partition with Dark Aluminum Frame (1x1 - 64x64)
const wallGlassPartition = makeSvg(64, 64, `
  <rect x="4" y="0" width="56" height="64" fill="none"/>
  <!-- Metal Frame Base & Posts -->
  <rect x="4" y="56" width="56" height="8" fill="#0F172A"/>
  <rect x="4" y="0" width="56" height="6" fill="#1E293B"/>
  <rect x="4" y="0" width="6" height="64" fill="#334155"/>
  <rect x="54" y="0" width="6" height="64" fill="#334155"/>
  <!-- Tinted Translucent Glass Pane -->
  <rect x="10" y="6" width="44" height="50" fill="#38BDF8" opacity="0.35"/>
  <!-- Glass Glare / Reflections -->
  <line x1="16" y1="10" x2="36" y2="48" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
  <line x1="22" y1="10" x2="42" y2="48" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
  <!-- Center Frosted Privacy Decal Band -->
  <rect x="10" y="26" width="44" height="12" fill="#E0F2FE" opacity="0.45"/>
`);

// Wall: Red Stone/Brick Accent Divider (1x1 - 64x64)
const wallBrickDivider = makeSvg(64, 64, `
  <rect x="0" y="0" width="64" height="56" fill="#450A0A"/>
  <!-- Brick Courses -->
  <rect x="2" y="2" width="28" height="10" fill="#991B1B"/>
  <rect x="32" y="2" width="30" height="10" fill="#B91C1C"/>
  <rect x="2" y="14" width="14" height="10" fill="#B91C1C"/>
  <rect x="18" y="14" width="28" height="10" fill="#7F1D1D"/>
  <rect x="48" y="14" width="14" height="10" fill="#991B1B"/>
  <rect x="2" y="26" width="28" height="10" fill="#7F1D1D"/>
  <rect x="32" y="26" width="30" height="10" fill="#991B1B"/>
  <rect x="2" y="38" width="14" height="10" fill="#991B1B"/>
  <rect x="18" y="38" width="28" height="10" fill="#B91C1C"/>
  <rect x="48" y="38" width="14" height="10" fill="#7F1D1D"/>
  <!-- Mortar lines -->
  <line x1="0" y1="13" x2="64" y2="13" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="0" y1="25" x2="64" y2="25" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="0" y1="37" x2="64" y2="37" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="0" y1="49" x2="64" y2="49" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Concrete cap -->
  <rect x="0" y="0" width="64" height="3" fill="#E2E8F0"/>
`);

// ---------------------------------------------------------------------
// 4. CAFETERIA & BREAKROOM
// ---------------------------------------------------------------------

// Cafeteria: Soda & Snack Vending Machine (1x1 - 64x64)
const cafeVendingMachine = makeSvg(64, 64, `
  <rect x="10" y="56" width="44" height="6" fill="rgba(0,0,0,0.4)" rx="2"/>
  <!-- Cabinet Body -->
  <rect x="10" y="6" width="44" height="52" fill="#1E293B" rx="3"/>
  <rect x="12" y="8" width="40" height="48" fill="#0F172A" rx="2"/>
  <!-- Glowing Glass Display Window -->
  <rect x="14" y="12" width="26" height="28" fill="#1E3A8A" rx="1"/>
  <rect x="16" y="14" width="22" height="24" fill="#38BDF8" opacity="0.3"/>
  <!-- Shelved Snacks & Soda Cans -->
  <rect x="16" y="16" width="4" height="5" fill="#EF4444"/>
  <rect x="22" y="16" width="4" height="5" fill="#10B981"/>
  <rect x="28" y="16" width="4" height="5" fill="#F59E0B"/>
  <rect x="16" y="24" width="4" height="5" fill="#3B82F6"/>
  <rect x="22" y="24" width="4" height="5" fill="#EC4899"/>
  <rect x="28" y="24" width="4" height="5" fill="#8B5CF6"/>
  <rect x="16" y="32" width="6" height="4" fill="#EAB308"/>
  <rect x="24" y="32" width="6" height="4" fill="#06B6D4"/>
  <!-- Payment Keypad & Coin Return -->
  <rect x="42" y="16" width="8" height="12" fill="#334155" rx="1"/>
  <rect x="44" y="18" width="4" height="3" fill="#22C55E"/>
  <rect x="43" y="23" width="6" height="1" fill="#94A3B8"/>
  <!-- Bottom Dispenser Flap -->
  <rect x="14" y="44" width="28" height="8" fill="#1E293B" rx="1"/>
  <rect x="16" y="46" width="24" height="4" fill="#090D16"/>
`);

// Cafeteria: Snack & Coffee Service Counter (2x1 - 128x64)
const cafeCounterSnack = makeSvg(128, 64, `
  <rect x="8" y="52" width="112" height="8" fill="rgba(0,0,0,0.3)" rx="3"/>
  <!-- Counter Cabinet Wooden Front -->
  <rect x="8" y="26" width="112" height="30" fill="#78350F" rx="3"/>
  <rect x="10" y="28" width="108" height="26" fill="#92400E" rx="2"/>
  <!-- Granite / Quartz Countertop -->
  <rect x="6" y="20" width="116" height="10" fill="#E2E8F0" rx="3"/>
  <rect x="8" y="21" width="112" height="6" fill="#F8FAFC" rx="2"/>
  <!-- Glass Pastry Display Case -->
  <rect x="16" y="4" width="42" height="18" fill="#38BDF8" opacity="0.3" rx="2"/>
  <rect x="16" y="4" width="42" height="18" fill="none" stroke="#64748B" stroke-width="1.5" rx="2"/>
  <!-- Croissants / Donuts inside -->
  <ellipse cx="26" cy="14" rx="4" ry="2.5" fill="#D97706" shape-rendering="auto"/>
  <ellipse cx="38" cy="14" rx="4" ry="2.5" fill="#F59E0B" shape-rendering="auto"/>
  <ellipse cx="48" cy="14" rx="4" ry="2.5" fill="#EC4899" shape-rendering="auto"/>
  <!-- Coffee Dispenser & Cups -->
  <rect x="68" y="6" width="16" height="16" fill="#475569" rx="2"/>
  <rect x="70" y="8" width="12" height="12" fill="#1E293B" rx="1"/>
  <circle cx="76" cy="14" r="2.5" fill="#EF4444" shape-rendering="auto"/>
  <!-- Stack of Paper Cups -->
  <rect x="88" y="10" width="6" height="12" fill="#E2E8F0" rx="1"/>
  <rect x="96" y="12" width="6" height="10" fill="#E2E8F0" rx="1"/>
  <!-- Register Tablet -->
  <rect x="106" y="10" width="12" height="10" fill="#0F172A" rx="1"/>
  <rect x="107" y="11" width="10" height="7" fill="#38BDF8"/>
`);

// Cafeteria: Cozy Diner Booth (2x1 - 128x64)
const cafeBoothDining = makeSvg(128, 64, `
  <rect x="8" y="52" width="112" height="8" fill="rgba(0,0,0,0.3)" rx="3"/>
  <!-- Left Red Leather Bench -->
  <rect x="8" y="14" width="24" height="40" fill="#991B1B" rx="4"/>
  <rect x="10" y="16" width="20" height="36" fill="#DC2626" rx="3"/>
  <!-- Right Red Leather Bench -->
  <rect x="96" y="14" width="24" height="40" fill="#991B1B" rx="4"/>
  <rect x="98" y="16" width="20" height="36" fill="#DC2626" rx="3"/>
  <!-- Center White Formica Table -->
  <rect x="36" y="24" width="56" height="26" fill="#CBD5E1" rx="2"/>
  <rect x="38" y="25" width="52" height="22" fill="#F8FAFC" rx="1"/>
  <!-- Tableware -->
  <circle cx="50" cy="36" r="4" fill="#E2E8F0" shape-rendering="auto"/>
  <circle cx="78" cy="36" r="4" fill="#E2E8F0" shape-rendering="auto"/>
  <!-- Condiment Caddy -->
  <rect x="62" y="32" width="4" height="6" fill="#EF4444"/>
  <rect x="67" y="32" width="4" height="6" fill="#FACC15"/>
`);

// Cafeteria: Waste & Recycling Station (1x1 - 64x64)
const cafeTrashRecycling = makeSvg(64, 64, `
  <rect x="12" y="54" width="40" height="6" fill="rgba(0,0,0,0.3)" rx="2"/>
  <!-- Cabinet -->
  <rect x="12" y="16" width="40" height="40" fill="#334155" rx="3"/>
  <rect x="14" y="18" width="36" height="36" fill="#475569" rx="2"/>
  <!-- Green Compost / Recycle Flap -->
  <rect x="17" y="24" width="14" height="12" fill="#16A34A" rx="2"/>
  <circle cx="24" cy="30" r="3" fill="#4ADE80" shape-rendering="auto"/>
  <!-- Blue Trash Flap -->
  <rect x="33" y="24" width="14" height="12" fill="#2563EB" rx="2"/>
  <circle cx="40" cy="30" r="3" fill="#60A5FA" shape-rendering="auto"/>
  <!-- Tray Return Shelf on Top -->
  <rect x="10" y="12" width="44" height="5" fill="#1E293B" rx="1"/>
`);

// ---------------------------------------------------------------------
// 5. GAMING ROOM & ESPORTS
// ---------------------------------------------------------------------

// Gaming: RGB Battlestation with Curved Displays (2x1 - 128x64)
const gamingRgbStation = makeSvg(128, 64, `
  <rect x="10" y="52" width="108" height="8" fill="rgba(0,0,0,0.4)" rx="4"/>
  <!-- Carbon Fiber Desk Base with Neon LED Underglow -->
  <rect x="12" y="20" width="104" height="34" fill="#090D16" rx="3"/>
  <rect x="14" y="22" width="100" height="30" fill="#181B26" rx="2"/>
  <line x1="12" y1="54" x2="116" y2="54" stroke="#06B6D4" stroke-width="2"/>
  <!-- Left Screen (Twitch / Chat) -->
  <rect x="18" y="4" width="30" height="24" fill="#0F172A" rx="2"/>
  <rect x="20" y="6" width="26" height="20" fill="#581C87" rx="1"/>
  <line x1="22" y1="10" x2="42" y2="10" stroke="#C084FC" stroke-width="1.5"/>
  <line x1="22" y1="14" x2="38" y2="14" stroke="#C084FC" stroke-width="1.5"/>
  <line x1="22" y1="18" x2="44" y2="18" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Center Main 240Hz Curved Gaming Screen -->
  <rect x="52" y="2" width="38" height="26" fill="#0F172A" rx="2"/>
  <rect x="54" y="4" width="34" height="22" fill="#042F2E" rx="1"/>
  <circle cx="71" cy="15" r="6" fill="#14B8A6" shape-rendering="auto"/>
  <rect x="67" y="28" width="8" height="5" fill="#64748B"/>
  <!-- Right Screen (Game Stream) -->
  <rect x="92" y="6" width="24" height="22" fill="#0F172A" rx="2"/>
  <rect x="94" y="8" width="20" height="18" fill="#1E1B4B" rx="1"/>
  <polygon points="98,20 104,13 110,20" fill="#EC4899"/>
  <!-- RGB Long Desk Mat -->
  <rect x="36" y="38" width="56" height="12" fill="#000000" rx="1"/>
  <rect x="36" y="38" width="56" height="1" fill="#F43F5E"/>
  <rect x="42" y="40" width="26" height="7" fill="#334155" rx="1"/>
  <rect x="74" y="41" width="5" height="6" fill="#06B6D4" rx="2"/>
`);

// Gaming: Red Plump Beanbag Chair (1x1 - 64x64)
const gamingBeanbag = makeSvg(64, 64, `
  <ellipse cx="32" cy="52" rx="20" ry="7" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Plump Slumped Beanbag -->
  <ellipse cx="32" cy="38" rx="20" ry="16" fill="#991B1B" shape-rendering="auto"/>
  <ellipse cx="32" cy="36" rx="17" ry="13" fill="#DC2626" shape-rendering="auto"/>
  <ellipse cx="32" cy="34" rx="12" ry="8" fill="#EF4444" shape-rendering="auto"/>
  <!-- Top Pull Handle & Stitches -->
  <rect x="30" y="18" width="4" height="6" fill="#7F1D1D" rx="2"/>
  <path d="M 24 32 Q 32 38 40 32" stroke="#7F1D1D" stroke-width="1.5" fill="none" shape-rendering="auto"/>
`);

// Gaming: Arcade Shooter Cabinet with Dual Lightguns (1x1 - 64x64)
const gamingRetroShooter = makeSvg(64, 64, `
  <rect x="12" y="56" width="40" height="6" fill="rgba(0,0,0,0.4)" rx="2"/>
  <polygon points="14,56 50,56 46,12 42,4 22,4 18,12" fill="#0F172A"/>
  <!-- Glowing Marquee -->
  <rect x="22" y="6" width="20" height="8" fill="#BE123C" rx="2"/>
  <text x="24" y="12" font-family="monospace" font-size="5" font-weight="bold" fill="#FDE047">ZAPPER</text>
  <!-- Screen -->
  <polygon points="18,16 46,16 44,34 20,34" fill="#000000"/>
  <circle cx="32" cy="25" r="5" fill="#EF4444" shape-rendering="auto"/>
  <circle cx="32" cy="25" r="2" fill="#FACC15" shape-rendering="auto"/>
  <!-- Holstered Blue & Red Lightguns -->
  <rect x="22" y="38" width="4" height="8" fill="#3B82F6" rx="1" transform="rotate(-15 24 42)"/>
  <rect x="38" y="38" width="4" height="8" fill="#EF4444" rx="1" transform="rotate(15 40 42)"/>
  <!-- Coin Door -->
  <rect x="24" y="46" width="16" height="8" fill="#1E293B"/>
  <rect x="27" y="48" width="2" height="4" fill="#F59E0B"/>
  <rect x="35" y="48" width="2" height="4" fill="#F59E0B"/>
`);

// ---------------------------------------------------------------------
// 6. MEETING ROOM
// ---------------------------------------------------------------------

// Meeting Room: Presentation Whiteboard on Stand (2x1 - 128x64)
const meetingWhiteboard = makeSvg(128, 64, `
  <ellipse cx="64" cy="56" rx="46" ry="6" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Aluminum Frame Stand & Legs -->
  <rect x="24" y="38" width="4" height="20" fill="#64748B"/>
  <rect x="100" y="38" width="4" height="20" fill="#64748B"/>
  <line x1="18" y1="56" x2="34" y2="56" stroke="#475569" stroke-width="3"/>
  <line x1="94" y1="56" x2="110" y2="56" stroke="#475569" stroke-width="3"/>
  <!-- Whiteboard Surface -->
  <rect x="20" y="6" width="88" height="36" fill="#334155" rx="3"/>
  <rect x="22" y="8" width="84" height="32" fill="#F8FAFC" rx="2"/>
  <!-- Diagram & Chart Drawn in Marker -->
  <line x1="28" y1="32" x2="56" y2="32" stroke="#94A3B8" stroke-width="1.5"/>
  <polyline points="30,28 36,22 42,25 48,16 54,18" fill="none" stroke="#2563EB" stroke-width="2"/>
  <!-- Flowchart Sticky Notes -->
  <rect x="64" y="14" width="8" height="8" fill="#FDE047" rx="1"/>
  <rect x="76" y="14" width="8" height="8" fill="#F472B6" rx="1"/>
  <rect x="88" y="14" width="8" height="8" fill="#67E8F9" rx="1"/>
  <line x1="72" y1="18" x2="76" y2="18" stroke="#334155" stroke-width="1"/>
  <line x1="84" y1="18" x2="88" y2="18" stroke="#334155" stroke-width="1"/>
  <!-- Marker Tray -->
  <rect x="28" y="40" width="72" height="3" fill="#94A3B8" rx="1"/>
  <rect x="34" y="39" width="6" height="2" fill="#EF4444"/>
  <rect x="42" y="39" width="6" height="2" fill="#2563EB"/>
  <rect x="50" y="39" width="6" height="2" fill="#10B981"/>
`);

// Meeting Room: Conference Table (2x2 - 128x128)
const meetingConferenceTable = makeSvg(128, 128, `
  <rect x="12" y="16" width="104" height="96" fill="#1E293B" rx="8"/>
  <!-- Conference Table Base -->
  <rect x="28" y="36" width="72" height="56" fill="#451A03" rx="8"/>
  <rect x="30" y="38" width="68" height="52" fill="#78350F" rx="6"/>
  <!-- Glass Top Inset -->
  <rect x="34" y="42" width="60" height="44" fill="#38BDF8" opacity="0.3" rx="4"/>
  <!-- Center Power Hatch & Plant -->
  <rect x="56" y="60" width="16" height="8" fill="#1E293B" rx="1"/>
  <circle cx="64" cy="64" r="4" fill="#22C55E" shape-rendering="auto"/>
  <!-- Chairs Around Table -->
  <rect x="38" y="24" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="57" y="24" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="76" y="24" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="38" y="94" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="57" y="94" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="76" y="94" width="14" height="10" fill="#475569" rx="2"/>
  <rect x="18" y="59" width="10" height="14" fill="#475569" rx="2"/>
  <rect x="100" y="59" width="10" height="14" fill="#475569" rx="2"/>
`);

// Write files
const roomElements = [
  { name: 'Oak Dining Table', filename: 'table_wood_dining.svg', svg: tableWoodDining, width: 1, height: 1, static: true },
  { name: 'Cafeteria Bench Table', filename: 'table_cafe_long.svg', svg: tableCafeLong, width: 2, height: 1, static: true },
  { name: 'Dual Monitor Workstation', filename: 'desktop_table_dual.svg', svg: desktopTableDual, width: 2, height: 1, static: true },
  { name: 'Single PC Desk', filename: 'desktop_table_pc.svg', svg: desktopTablePc, width: 1, height: 1, static: true },
  { name: 'Ergonomic Swivel Chair', filename: 'chair_office_swivel.svg', svg: chairOfficeSwivel, width: 1, height: 1, static: false },
  { name: 'Wooden Cafe Chair', filename: 'chair_cafe_wood.svg', svg: chairCafeWood, width: 1, height: 1, static: false },
  { name: 'Gaming Bucket Chair', filename: 'chair_gaming_bucket.svg', svg: chairGamingBucket, width: 1, height: 1, static: false },
  { name: 'Oak Wood Wall (H)', filename: 'wall_wood_h.svg', svg: wallWoodH, width: 1, height: 1, static: true },
  { name: 'Oak Wood Wall (V)', filename: 'wall_wood_v.svg', svg: wallWoodV, width: 1, height: 1, static: true },
  { name: 'Glass Partition Divider', filename: 'wall_glass_partition.svg', svg: wallGlassPartition, width: 1, height: 1, static: true },
  { name: 'Brick Divider Wall', filename: 'wall_brick_divider.svg', svg: wallBrickDivider, width: 1, height: 1, static: true },
  { name: 'Snack & Soda Vending Machine', filename: 'cafe_vending_machine.svg', svg: cafeVendingMachine, width: 1, height: 1, static: true },
  { name: 'Cafeteria Service Counter', filename: 'cafe_counter_snack.svg', svg: cafeCounterSnack, width: 2, height: 1, static: true },
  { name: 'Cozy Diner Booth', filename: 'cafe_booth_dining.svg', svg: cafeBoothDining, width: 2, height: 1, static: true },
  { name: 'Waste & Recycling Station', filename: 'cafe_trash_recycling.svg', svg: cafeTrashRecycling, width: 1, height: 1, static: true },
  { name: 'Neon RGB Battlestation', filename: 'gaming_rgb_station.svg', svg: gamingRgbStation, width: 2, height: 1, static: true },
  { name: 'Red Gaming Beanbag', filename: 'gaming_beanbag_chair.svg', svg: gamingBeanbag, width: 1, height: 1, static: false },
  { name: 'Arcade Lightgun Shooter', filename: 'gaming_retro_shooter.svg', svg: gamingRetroShooter, width: 1, height: 1, static: true },
  { name: 'Presentation Whiteboard', filename: 'meeting_whiteboard.svg', svg: meetingWhiteboard, width: 2, height: 1, static: true },
  { name: 'Conference Boardroom Table', filename: 'meeting_conference_table.svg', svg: meetingConferenceTable, width: 2, height: 2, static: true },
];

roomElements.forEach(e => {
  const filePath = path.join(elementsDir, e.filename);
  fs.writeFileSync(filePath, e.svg.trim());
  console.log('Saved room element:', e.filename);
});

console.log('Successfully created', roomElements.length, 'room elements!');

