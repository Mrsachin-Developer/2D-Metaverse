const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, '..', 'apps', 'frontend', 'public', 'assets', 'avatars');
const elementsDir = path.join(__dirname, '..', 'apps', 'frontend', 'public', 'assets', 'elements');

fs.mkdirSync(avatarsDir, { recursive: true });
fs.mkdirSync(elementsDir, { recursive: true });

// Helper to wrap SVG
function makeSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
${content}
</svg>`;
}

// ----------------------------------------------------
// AVATARS (64x64 pixel sprites - Gather style)
// ----------------------------------------------------

// 1. Phillip - Green Newsboy Cap, Green Adventurer Jacket
const avatarPhillip = makeSvg(64, 64, `
  <!-- Shadow -->
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Body / Coat -->
  <rect x="22" y="32" width="20" height="18" fill="#2E5A36" rx="2"/>
  <rect x="27" y="32" width="10" height="18" fill="#3D7347"/>
  <rect x="30" y="34" width="4" height="14" fill="#C29B38"/>
  <!-- Belt -->
  <rect x="22" y="44" width="20" height="3" fill="#1E3823"/>
  <rect x="29" y="43" width="6" height="5" fill="#E5C158"/>
  <!-- Legs / Trousers -->
  <rect x="24" y="50" width="6" height="8" fill="#242C3F"/>
  <rect x="34" y="50" width="6" height="8" fill="#242C3F"/>
  <!-- Boots -->
  <rect x="23" y="56" width="8" height="4" fill="#5A3825" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#5A3825" rx="1"/>
  <!-- Hands -->
  <rect x="18" y="38" width="4" height="6" fill="#FCD34D" rx="1"/>
  <rect x="42" y="38" width="4" height="6" fill="#FCD34D" rx="1"/>
  <!-- Head / Face -->
  <rect x="22" y="16" width="20" height="18" fill="#FCD34D" rx="3"/>
  <!-- Eyes -->
  <rect x="26" y="24" width="3" height="4" fill="#1E293B"/>
  <rect x="35" y="24" width="3" height="4" fill="#1E293B"/>
  <rect x="27" y="24" width="1" height="1" fill="#FFFFFF"/>
  <rect x="36" y="24" width="1" height="1" fill="#FFFFFF"/>
  <!-- Blush / Smile -->
  <rect x="24" y="28" width="3" height="2" fill="#F87171" opacity="0.6"/>
  <rect x="37" y="28" width="3" height="2" fill="#F87171" opacity="0.6"/>
  <rect x="29" y="29" width="6" height="2" fill="#B45309" rx="1"/>
  <!-- Green Newsboy Cap -->
  <path d="M18 18 C18 10, 46 10, 46 18 Z" fill="#2E5A36" shape-rendering="auto"/>
  <rect x="16" y="16" width="32" height="4" fill="#1F3F25" rx="2"/>
  <rect x="28" y="9" width="8" height="3" fill="#3D7347" rx="1"/>
`);

// 2. Alex - Navy Hoodie Coder with Headphones
const avatarAlex = makeSvg(64, 64, `
  <!-- Shadow -->
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Hoodie Body -->
  <rect x="21" y="32" width="22" height="18" fill="#1E293B" rx="2"/>
  <rect x="27" y="32" width="10" height="18" fill="#334155"/>
  <!-- White Drawstrings -->
  <rect x="29" y="33" width="1.5" height="11" fill="#F8FAFC"/>
  <rect x="33.5" y="33" width="1.5" height="11" fill="#F8FAFC"/>
  <!-- Jeans -->
  <rect x="24" y="50" width="6" height="8" fill="#2563EB"/>
  <rect x="34" y="50" width="6" height="8" fill="#2563EB"/>
  <!-- White Sneakers -->
  <rect x="23" y="56" width="8" height="4" fill="#FFFFFF" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#FFFFFF" rx="1"/>
  <rect x="23" y="58" width="8" height="2" fill="#E2E8F0"/>
  <rect x="33" y="58" width="8" height="2" fill="#E2E8F0"/>
  <!-- Hands -->
  <rect x="17" y="38" width="4" height="6" fill="#FDBA74" rx="1"/>
  <rect x="43" y="38" width="4" height="6" fill="#FDBA74" rx="1"/>
  <!-- Head -->
  <rect x="23" y="16" width="18" height="18" fill="#FDBA74" rx="3"/>
  <!-- Eyes -->
  <rect x="27" y="24" width="3" height="4" fill="#0F172A"/>
  <rect x="35" y="24" width="3" height="4" fill="#0F172A"/>
  <rect x="28" y="24" width="1" height="1" fill="#FFFFFF"/>
  <rect x="36" y="24" width="1" height="1" fill="#FFFFFF"/>
  <!-- Dark Hair -->
  <rect x="21" y="12" width="22" height="7" fill="#0F172A" rx="2"/>
  <rect x="21" y="16" width="3" height="7" fill="#0F172A"/>
  <rect x="40" y="16" width="3" height="7" fill="#0F172A"/>
  <!-- Headphones (Gather Style) -->
  <path d="M18 24 A14 14 0 0 1 46 24" fill="none" stroke="#38BDF8" stroke-width="3" shape-rendering="auto"/>
  <rect x="17" y="21" width="4" height="8" fill="#0284C7" rx="1"/>
  <rect x="43" y="21" width="4" height="8" fill="#0284C7" rx="1"/>
`);

// 3. Jessica - Purple Blazer Tech Lead
const avatarJessica = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Purple Blazer -->
  <rect x="22" y="32" width="20" height="18" fill="#6B21A8" rx="2"/>
  <!-- White Inner Shirt -->
  <polygon points="28,32 36,32 32,41" fill="#FFFFFF"/>
  <!-- Belt & Slacks -->
  <rect x="24" y="49" width="6" height="9" fill="#1E1B4B"/>
  <rect x="34" y="49" width="6" height="9" fill="#1E1B4B"/>
  <!-- Dark Heels/Flats -->
  <rect x="23" y="56" width="8" height="4" fill="#0F172A" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#0F172A" rx="1"/>
  <!-- Face -->
  <rect x="23" y="17" width="18" height="17" fill="#FED7AA" rx="3"/>
  <!-- Smart Glasses -->
  <rect x="25" y="23" width="5" height="4" fill="none" stroke="#C084FC" stroke-width="1.5"/>
  <rect x="34" y="23" width="5" height="4" fill="none" stroke="#C084FC" stroke-width="1.5"/>
  <line x1="30" y1="24" x2="34" y2="24" stroke="#C084FC" stroke-width="1.5"/>
  <rect x="27" y="24" width="2" height="2" fill="#1E293B"/>
  <rect x="36" y="24" width="2" height="2" fill="#1E293B"/>
  <!-- Hair - Dark Sleek Ponytail -->
  <rect x="21" y="12" width="22" height="7" fill="#1C1917" rx="2"/>
  <rect x="21" y="16" width="3" height="9" fill="#1C1917"/>
  <rect x="40" y="16" width="3" height="9" fill="#1C1917"/>
  <rect x="39" y="11" width="6" height="16" fill="#1C1917" rx="3"/>
  <rect x="39" y="13" width="6" height="2" fill="#F43F5E"/>
`);

// 4. Rasmus - Cyberpunk Gamer / Streamer (Blonde + Violet Neon)
const avatarRasmus = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Jacket -->
  <rect x="21" y="32" width="22" height="18" fill="#4C1D95" rx="2"/>
  <rect x="26" y="32" width="12" height="18" fill="#7C3AED"/>
  <line x1="32" y1="32" x2="32" y2="50" stroke="#06B6D4" stroke-width="1.5"/>
  <!-- Pants -->
  <rect x="24" y="50" width="6" height="8" fill="#111827"/>
  <rect x="34" y="50" width="6" height="8" fill="#111827"/>
  <!-- Cyber Shoes -->
  <rect x="23" y="56" width="8" height="4" fill="#06B6D4" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#06B6D4" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FCD34D" rx="3"/>
  <rect x="26" y="24" width="4" height="3" fill="#0F172A"/>
  <rect x="34" y="24" width="4" height="3" fill="#0F172A"/>
  <!-- Spiky Blonde Hair -->
  <polygon points="21,18 24,8 29,14 34,7 39,13 43,9 44,18" fill="#FBBF24"/>
  <!-- Mic Headset -->
  <rect x="18" y="22" width="4" height="6" fill="#F43F5E" rx="1"/>
  <path d="M20 28 Q 23 33 28 32" fill="none" stroke="#F43F5E" stroke-width="1.5" shape-rendering="auto"/>
`);

// 5. Lauren - Mustard Knit Sweater Designer
const avatarLauren = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Mustard Sweater -->
  <rect x="21" y="32" width="22" height="18" fill="#D97706" rx="2"/>
  <rect x="25" y="32" width="14" height="18" fill="#F59E0B"/>
  <!-- Pleated Skirt / Dark Jeans -->
  <rect x="23" y="48" width="18" height="5" fill="#374151"/>
  <rect x="25" y="53" width="5" height="5" fill="#FDE68A"/>
  <rect x="34" y="53" width="5" height="5" fill="#FDE68A"/>
  <!-- Brown Ankle Boots -->
  <rect x="24" y="56" width="7" height="4" fill="#78350F" rx="1"/>
  <rect x="33" y="56" width="7" height="4" fill="#78350F" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FDE68A" rx="3"/>
  <!-- Round Glasses -->
  <circle cx="27" cy="24" r="3" fill="none" stroke="#B45309" stroke-width="1" shape-rendering="auto"/>
  <circle cx="37" cy="24" r="3" fill="none" stroke="#B45309" stroke-width="1" shape-rendering="auto"/>
  <line x1="30" y1="24" x2="34" y2="24" stroke="#B45309" stroke-width="1"/>
  <rect x="26.5" y="23.5" width="1.5" height="1.5" fill="#1F2937"/>
  <rect x="36.5" y="23.5" width="1.5" height="1.5" fill="#1F2937"/>
  <!-- Brown Curls -->
  <rect x="20" y="11" width="24" height="8" fill="#78350F" rx="3"/>
  <rect x="19" y="17" width="4" height="13" fill="#78350F" rx="2"/>
  <rect x="41" y="17" width="4" height="13" fill="#78350F" rx="2"/>
`);

// 6. Matt - Executive in Charcoal Suit
const avatarMatt = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Charcoal Suit Jacket -->
  <rect x="21" y="32" width="22" height="18" fill="#1F2937" rx="2"/>
  <!-- White Shirt & Red Silk Tie -->
  <polygon points="28,32 36,32 32,38" fill="#FFFFFF"/>
  <polygon points="31,34 33,34 34,44 32,47 30,44" fill="#DC2626"/>
  <!-- Trousers -->
  <rect x="24" y="50" width="6" height="8" fill="#1F2937"/>
  <rect x="34" y="50" width="6" height="8" fill="#1F2937"/>
  <!-- Oxford Shoes -->
  <rect x="23" y="56" width="8" height="4" fill="#000000" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#000000" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FED7AA" rx="3"/>
  <rect x="26" y="24" width="3" height="3" fill="#0F172A"/>
  <rect x="35" y="24" width="3" height="3" fill="#0F172A"/>
  <!-- Neatly Combed Dark Hair -->
  <path d="M21 17 C21 10, 43 9, 43 17 Z" fill="#332211" shape-rendering="auto"/>
  <rect x="21" y="15" width="22" height="4" fill="#332211" rx="1"/>
`);

// 7. Gaby - Coral Beanie & Mint Oversized Sweater
const avatarGaby = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Mint Green Sweater -->
  <rect x="20" y="32" width="24" height="18" fill="#2DD4BF" rx="3"/>
  <rect x="25" y="32" width="14" height="18" fill="#5EEAD4"/>
  <!-- Crossbody Bag Strap -->
  <line x1="22" y1="32" x2="42" y2="48" stroke="#78350F" stroke-width="2.5"/>
  <rect x="38" y="44" width="7" height="6" fill="#92400E" rx="1"/>
  <!-- Dark Leggings & Warm Boots -->
  <rect x="25" y="50" width="5" height="8" fill="#18181B"/>
  <rect x="34" y="50" width="5" height="8" fill="#18181B"/>
  <rect x="24" y="56" width="7" height="4" fill="#B45309" rx="1"/>
  <rect x="33" y="56" width="7" height="4" fill="#B45309" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FBCFE8" rx="3"/>
  <rect x="26" y="24" width="3" height="3" fill="#1E293B"/>
  <rect x="35" y="24" width="3" height="3" fill="#1E293B"/>
  <rect x="25" y="27" width="2" height="1" fill="#F43F5E"/>
  <rect x="37" y="27" width="2" height="1" fill="#F43F5E"/>
  <!-- Coral Knit Beanie -->
  <ellipse cx="32" cy="14" rx="12" ry="7" fill="#FB7185" shape-rendering="auto"/>
  <rect x="20" y="15" width="24" height="4" fill="#E11D48" rx="2"/>
  <circle cx="32" cy="7" r="2.5" fill="#FDA4AF"/>
`);

// 8. Zepto Runner - Neon Cyber Runner
const avatarZepto = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Zepto Runner Suit (Cyan & Yellow) -->
  <rect x="21" y="32" width="22" height="18" fill="#0F172A" rx="2"/>
  <rect x="25" y="32" width="14" height="18" fill="#0284C7"/>
  <rect x="30" y="34" width="4" height="14" fill="#FACC15"/>
  <!-- Jogger Pants -->
  <rect x="24" y="50" width="6" height="8" fill="#0F172A"/>
  <rect x="34" y="50" width="6" height="8" fill="#0F172A"/>
  <!-- Neon Yellow Speed Trainers -->
  <rect x="23" y="56" width="8" height="4" fill="#FACC15" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#FACC15" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FDBA74" rx="3"/>
  <!-- Neon Cyan Sport Visor -->
  <rect x="20" y="20" width="24" height="6" fill="#38BDF8" rx="2" opacity="0.95"/>
  <line x1="22" y1="23" x2="42" y2="23" stroke="#FFFFFF" stroke-width="1.5"/>
  <!-- Sport Headband & Hair -->
  <rect x="21" y="11" width="22" height="7" fill="#1E293B" rx="2"/>
  <rect x="20" y="16" width="24" height="3" fill="#FACC15"/>
`);

// 9. Corgi Explorer - Office Mascot
const avatarCorgi = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Corgi Body -->
  <ellipse cx="32" cy="44" rx="14" ry="12" fill="#D97706" shape-rendering="auto"/>
  <ellipse cx="32" cy="46" rx="8" ry="8" fill="#FEF3C7" shape-rendering="auto"/>
  <!-- Red Bandana -->
  <polygon points="26,38 38,38 32,45" fill="#EF4444"/>
  <!-- Paws -->
  <rect x="23" y="53" width="6" height="5" fill="#FEF3C7" rx="2"/>
  <rect x="35" y="53" width="6" height="5" fill="#FEF3C7" rx="2"/>
  <!-- Corgi Head -->
  <circle cx="32" cy="26" r="12" fill="#D97706" shape-rendering="auto"/>
  <ellipse cx="32" cy="28" rx="6" ry="6" fill="#FEF3C7" shape-rendering="auto"/>
  <!-- Big Pointy Ears -->
  <polygon points="22,20 17,9 26,14" fill="#D97706"/>
  <polygon points="21,18 18,11 24,15" fill="#FCA5A5"/>
  <polygon points="42,20 47,9 38,14" fill="#D97706"/>
  <polygon points="43,18 46,11 40,15" fill="#FCA5A5"/>
  <!-- Cute Eyes & Nose -->
  <circle cx="28" cy="24" r="2" fill="#000000" shape-rendering="auto"/>
  <circle cx="36" cy="24" r="2" fill="#000000" shape-rendering="auto"/>
  <ellipse cx="32" cy="28" rx="2" ry="1.5" fill="#000000" shape-rendering="auto"/>
  <path d="M30 30 Q 32 33 34 30" fill="none" stroke="#D97706" stroke-width="1.5" shape-rendering="auto"/>
`);

// 10. Aria - Bio-Engineer
const avatarAria = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="16" ry="5" fill="rgba(0,0,0,0.35)" shape-rendering="auto"/>
  <!-- Lab Coat -->
  <rect x="21" y="32" width="22" height="20" fill="#F8FAFC" rx="2"/>
  <line x1="32" y1="32" x2="32" y2="52" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="24" y="37" width="5" height="5" fill="#E2E8F0" rx="1"/>
  <rect x="25" y="38" width="1" height="3" fill="#06B6D4"/>
  <rect x="27" y="38" width="1" height="3" fill="#F43F5E"/>
  <!-- Slacks -->
  <rect x="24" y="52" width="6" height="6" fill="#334155"/>
  <rect x="34" y="52" width="6" height="6" fill="#334155"/>
  <rect x="23" y="56" width="8" height="4" fill="#0F172A" rx="1"/>
  <rect x="33" y="56" width="8" height="4" fill="#0F172A" rx="1"/>
  <!-- Face -->
  <rect x="23" y="16" width="18" height="18" fill="#FED7AA" rx="3"/>
  <rect x="26" y="24" width="3" height="3" fill="#0F172A"/>
  <rect x="35" y="24" width="3" height="3" fill="#0F172A"/>
  <!-- Cyan Holo Visor -->
  <rect x="22" y="21" width="20" height="4" fill="#22D3EE" opacity="0.85" rx="1"/>
  <!-- Teal Bob Hair -->
  <path d="M21 16 C21 8, 43 8, 43 16 Z" fill="#0D9488" shape-rendering="auto"/>
  <rect x="20" y="15" width="4" height="14" fill="#0D9488" rx="2"/>
  <rect x="40" y="15" width="4" height="14" fill="#0D9488" rx="2"/>
`);

// ----------------------------------------------------
// ELEMENTS (Gather.town style office furniture & decor)
// ----------------------------------------------------

// 1. Triple Monitor Workstation (2x1 or 2x2 - 128x64)
const elWorkstationTriple = makeSvg(128, 64, `
  <!-- Desk Base Shadow -->
  <rect x="8" y="52" width="112" height="8" fill="rgba(0,0,0,0.3)" rx="4"/>
  <!-- Main Desk Surface (Matte Carbon) -->
  <rect x="6" y="16" width="116" height="40" fill="#181B26" rx="4"/>
  <rect x="8" y="18" width="112" height="36" fill="#242B3D" rx="3"/>
  <line x1="8" y1="20" x2="120" y2="20" stroke="#374151" stroke-width="1"/>
  <!-- Left Monitor (Angled) -->
  <rect x="12" y="6" width="30" height="22" fill="#0F172A" rx="2"/>
  <rect x="14" y="8" width="26" height="18" fill="#0284C7" rx="1"/>
  <line x1="16" y1="12" x2="36" y2="12" stroke="#BAE6FD" stroke-width="1.5"/>
  <line x1="16" y1="16" x2="30" y2="16" stroke="#BAE6FD" stroke-width="1.5"/>
  <line x1="16" y1="20" x2="26" y2="20" stroke="#BAE6FD" stroke-width="1.5"/>
  <!-- Center Main 4K UltraWide Monitor -->
  <rect x="46" y="2" width="36" height="26" fill="#0F172A" rx="2"/>
  <rect x="48" y="4" width="32" height="22" fill="#1E1B4B" rx="1"/>
  <rect x="52" y="8" width="24" height="14" fill="#312E81"/>
  <text x="54" y="18" font-family="monospace" font-size="7" fill="#38BDF8">&gt;_npm run</text>
  <rect x="60" y="28" width="8" height="6" fill="#64748B"/>
  <rect x="54" y="33" width="20" height="2" fill="#475569"/>
  <!-- Right Monitor (Angled) -->
  <rect x="86" y="6" width="30" height="22" fill="#0F172A" rx="2"/>
  <rect x="88" y="8" width="26" height="18" fill="#065F46" rx="1"/>
  <line x1="90" y1="12" x2="110" y2="12" stroke="#6EE7B7" stroke-width="1.5"/>
  <line x1="90" y1="16" x2="104" y2="16" stroke="#6EE7B7" stroke-width="1.5"/>
  <!-- RGB Desk Mat -->
  <rect x="36" y="38" width="56" height="14" fill="#090D16" rx="2"/>
  <rect x="36" y="38" width="56" height="1" fill="#A855F7"/>
  <!-- Mechanical Keyboard -->
  <rect x="44" y="41" width="26" height="8" fill="#334155" rx="1"/>
  <rect x="45" y="42" width="24" height="6" fill="#1E293B"/>
  <rect x="46" y="43" width="2" height="2" fill="#F43F5E"/>
  <rect x="49" y="43" width="2" height="2" fill="#38BDF8"/>
  <rect x="52" y="43" width="2" height="2" fill="#FACC15"/>
  <rect x="55" y="43" width="2" height="2" fill="#4ADE80"/>
  <!-- Gaming Mouse -->
  <rect x="76" y="42" width="6" height="7" fill="#1E293B" rx="3"/>
  <line x1="79" y1="42" x2="79" y2="45" stroke="#38BDF8" stroke-width="1"/>
  <!-- Coffee Mug -->
  <circle cx="24" cy="42" r="4" fill="#F43F5E" shape-rendering="auto"/>
  <circle cx="24" cy="42" r="2.5" fill="#451A03" shape-rendering="auto"/>
  <!-- Desk Plant -->
  <circle cx="106" cy="42" r="5" fill="#15803D" shape-rendering="auto"/>
  <circle cx="106" cy="42" r="3" fill="#22C55E" shape-rendering="auto"/>
`);

// 2. Oak Desk with Laptop & Coffee (1x1 - 64x64)
const elDeskWoodLaptop = makeSvg(64, 64, `
  <!-- Shadow -->
  <rect x="4" y="52" width="56" height="6" fill="rgba(0,0,0,0.3)" rx="3"/>
  <!-- Desk Base Oak -->
  <rect x="4" y="16" width="56" height="38" fill="#78350F" rx="3"/>
  <rect x="6" y="18" width="52" height="34" fill="#B45309" rx="2"/>
  <!-- Wood grain subtle lines -->
  <line x1="6" y1="26" x2="58" y2="26" stroke="#92400E" stroke-width="1"/>
  <line x1="6" y1="38" x2="58" y2="38" stroke="#92400E" stroke-width="1"/>
  <!-- Open Silver Laptop -->
  <rect x="18" y="10" width="28" height="18" fill="#475569" rx="2"/>
  <rect x="20" y="12" width="24" height="14" fill="#0284C7" rx="1"/>
  <line x1="22" y1="16" x2="38" y2="16" stroke="#BAE6FD" stroke-width="1.5"/>
  <line x1="22" y1="20" x2="32" y2="20" stroke="#BAE6FD" stroke-width="1.5"/>
  <!-- Laptop Keyboard Base -->
  <polygon points="14,34 50,34 46,28 18,28" fill="#94A3B8"/>
  <rect x="22" y="29" width="20" height="4" fill="#334155" rx="1"/>
  <!-- Iced Drink with Straw (Gather Screenshot item!) -->
  <circle cx="50" cy="40" r="4" fill="#E0F2FE" shape-rendering="auto"/>
  <circle cx="50" cy="40" r="3" fill="#D97706" shape-rendering="auto"/>
  <line x1="50" y1="40" x2="52" y2="34" stroke="#10B981" stroke-width="1.5"/>
  <!-- Notebook & Pen -->
  <rect x="10" y="36" width="10" height="12" fill="#F8FAFC" rx="1"/>
  <line x1="12" y1="39" x2="18" y2="39" stroke="#94A3B8" stroke-width="1"/>
  <line x1="12" y1="42" x2="18" y2="42" stroke="#94A3B8" stroke-width="1"/>
`);

// 3. Brown Leather Sofa (Gather Style - 2x1 - 128x64)
const elCouchBrown = makeSvg(128, 64, `
  <rect x="8" y="52" width="112" height="8" fill="rgba(0,0,0,0.3)" rx="4"/>
  <!-- Backrest -->
  <rect x="8" y="10" width="112" height="24" fill="#78350F" rx="6"/>
  <rect x="12" y="12" width="104" height="20" fill="#92400E" rx="4"/>
  <!-- Button Tufting details -->
  <circle cx="26" cy="22" r="2" fill="#451A03" shape-rendering="auto"/>
  <circle cx="46" cy="22" r="2" fill="#451A03" shape-rendering="auto"/>
  <circle cx="64" cy="22" r="2" fill="#451A03" shape-rendering="auto"/>
  <circle cx="82" cy="22" r="2" fill="#451A03" shape-rendering="auto"/>
  <circle cx="102" cy="22" r="2" fill="#451A03" shape-rendering="auto"/>
  <!-- Seat Cushions -->
  <rect x="14" y="30" width="31" height="22" fill="#B45309" rx="3"/>
  <rect x="49" y="30" width="31" height="22" fill="#B45309" rx="3"/>
  <rect x="83" y="30" width="31" height="22" fill="#B45309" rx="3"/>
  <!-- Armrests -->
  <rect x="6" y="24" width="12" height="28" fill="#78350F" rx="4"/>
  <rect x="8" y="26" width="8" height="24" fill="#92400E" rx="3"/>
  <rect x="110" y="24" width="12" height="28" fill="#78350F" rx="4"/>
  <rect x="112" y="26" width="8" height="24" fill="#92400E" rx="3"/>
`);

// 4. Charcoal Modern Sectional Couch (128x64)
const elCouchModernCharcoal = makeSvg(128, 64, `
  <rect x="8" y="52" width="112" height="8" fill="rgba(0,0,0,0.3)" rx="4"/>
  <!-- Backrest -->
  <rect x="8" y="12" width="112" height="22" fill="#1E293B" rx="4"/>
  <rect x="12" y="14" width="104" height="18" fill="#334155" rx="3"/>
  <!-- Deep Cushions -->
  <rect x="12" y="28" width="50" height="24" fill="#475569" rx="2"/>
  <rect x="66" y="28" width="50" height="24" fill="#475569" rx="2"/>
  <!-- Throw Pillows (Yellow & Cyan accents) -->
  <rect x="14" y="22" width="14" height="14" fill="#FACC15" rx="3" transform="rotate(-10 21 29)"/>
  <rect x="100" y="22" width="14" height="14" fill="#06B6D4" rx="3" transform="rotate(10 107 29)"/>
  <!-- Armrests -->
  <rect x="6" y="22" width="10" height="30" fill="#1E293B" rx="3"/>
  <rect x="112" y="22" width="10" height="30" fill="#1E293B" rx="3"/>
`);

// 5. Boardroom Meeting Table (2x2 - 128x128)
const elMeetingTable = makeSvg(128, 128, `
  <!-- Meeting Rug -->
  <rect x="8" y="14" width="112" height="100" fill="#1E293B" rx="8"/>
  <rect x="10" y="16" width="108" height="96" fill="#293548" rx="7"/>
  <!-- Conference Table Base -->
  <rect x="24" y="32" width="80" height="64" fill="#451A03" rx="10"/>
  <rect x="26" y="34" width="76" height="60" fill="#92400E" rx="8"/>
  <rect x="30" y="38" width="68" height="52" fill="#B45309" rx="6"/>
  <!-- Glass Inset / Center Cable Hatch -->
  <rect x="52" y="56" width="24" height="16" fill="#1E293B" rx="2"/>
  <circle cx="60" cy="64" r="2" fill="#38BDF8" shape-rendering="auto"/>
  <circle cx="68" cy="64" r="2" fill="#38BDF8" shape-rendering="auto"/>
  <!-- Center Potted Plant -->
  <circle cx="64" cy="64" r="5" fill="#22C55E" shape-rendering="auto"/>
  <!-- Top Chairs -->
  <rect x="36" y="18" width="16" height="12" fill="#475569" rx="3"/>
  <rect x="56" y="18" width="16" height="12" fill="#475569" rx="3"/>
  <rect x="76" y="18" width="16" height="12" fill="#475569" rx="3"/>
  <!-- Bottom Chairs -->
  <rect x="36" y="98" width="16" height="12" fill="#475569" rx="3"/>
  <rect x="56" y="98" width="16" height="12" fill="#475569" rx="3"/>
  <rect x="76" y="98" width="16" height="12" fill="#475569" rx="3"/>
  <!-- Left Chair -->
  <rect x="12" y="58" width="12" height="16" fill="#475569" rx="3"/>
  <!-- Right Chair -->
  <rect x="104" y="58" width="12" height="16" fill="#475569" rx="3"/>
`);

// 6. Lush Potted Monstera Plant (1x1 - 64x64)
const elPlantMonstera = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="14" ry="4" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Terracotta Planter Pot -->
  <polygon points="20,40 44,40 40,56 24,56" fill="#C2410C"/>
  <rect x="18" y="37" width="28" height="5" fill="#EA580C" rx="2"/>
  <!-- Rich Soil -->
  <ellipse cx="32" cy="40" rx="10" ry="3" fill="#451A03" shape-rendering="auto"/>
  <!-- Monstera Leaves -->
  <circle cx="24" cy="26" r="10" fill="#15803D" shape-rendering="auto"/>
  <circle cx="40" cy="24" r="11" fill="#16A34A" shape-rendering="auto"/>
  <circle cx="32" cy="16" r="12" fill="#22C55E" shape-rendering="auto"/>
  <circle cx="22" cy="18" r="8" fill="#4ADE80" shape-rendering="auto"/>
  <circle cx="42" cy="16" r="9" fill="#15803D" shape-rendering="auto"/>
  <!-- Leaf notches -->
  <circle cx="28" cy="14" r="2.5" fill="#14532D" shape-rendering="auto"/>
  <circle cx="36" cy="18" r="2" fill="#14532D" shape-rendering="auto"/>
`);

// 7. Sakura Bonsai Tree in Ceramic Pot (Gather Screenshot Item! - 64x64)
const elPlantSakura = makeSvg(64, 64, `
  <ellipse cx="32" cy="58" rx="14" ry="4" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Ceramic Round Planter -->
  <rect x="20" y="44" width="24" height="12" fill="#E2E8F0" rx="4"/>
  <rect x="18" y="42" width="28" height="4" fill="#CBD5E1" rx="2"/>
  <!-- Bonsai Trunk -->
  <path d="M32 44 Q 30 32 34 26 Q 36 22 32 18" stroke="#78350F" stroke-width="5" fill="none" stroke-linecap="round" shape-rendering="auto"/>
  <path d="M33 28 Q 42 26 44 20" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round" shape-rendering="auto"/>
  <path d="M31 32 Q 22 30 20 24" stroke="#78350F" stroke-width="3" fill="none" stroke-linecap="round" shape-rendering="auto"/>
  <!-- Pink Sakura Blossom Clusters -->
  <circle cx="32" cy="14" r="10" fill="#F472B6" shape-rendering="auto"/>
  <circle cx="22" cy="20" r="8" fill="#FB7185" shape-rendering="auto"/>
  <circle cx="42" cy="18" r="9" fill="#F43F5E" shape-rendering="auto"/>
  <circle cx="34" cy="10" r="7" fill="#FBCFE8" shape-rendering="auto"/>
  <circle cx="28" cy="18" r="6" fill="#FFF1F2" shape-rendering="auto"/>
`);

// 8. Espresso Bar / Coffee Machine (1x1 - 64x64)
const elCoffeeEspresso = makeSvg(64, 64, `
  <rect x="8" y="54" width="48" height="6" fill="rgba(0,0,0,0.3)" rx="3"/>
  <!-- Wood Credenza -->
  <rect x="8" y="34" width="48" height="22" fill="#78350F" rx="2"/>
  <rect x="10" y="36" width="44" height="18" fill="#92400E" rx="1"/>
  <!-- Espresso Machine Stainless Steel -->
  <rect x="14" y="10" width="36" height="26" fill="#64748B" rx="3"/>
  <rect x="16" y="12" width="32" height="22" fill="#94A3B8" rx="2"/>
  <!-- Top Bean Hopper -->
  <rect x="24" y="4" width="16" height="8" fill="#334155" rx="2"/>
  <rect x="26" y="6" width="12" height="5" fill="#78350F"/>
  <!-- Pressure Gauges & Steam Nozzle -->
  <circle cx="22" cy="18" r="3" fill="#F8FAFC" shape-rendering="auto"/>
  <circle cx="22" cy="18" r="1" fill="#DC2626" shape-rendering="auto"/>
  <!-- Portafilter & Drip Tray -->
  <rect x="28" y="24" width="12" height="3" fill="#1E293B"/>
  <rect x="20" y="30" width="24" height="3" fill="#475569"/>
  <!-- Little Red Mug Catching Drip -->
  <rect x="28" y="26" width="8" height="6" fill="#EF4444" rx="1"/>
`);

// 9. Corgi on Round Rug (Gather Screenshot exact pet! - 64x64)
const elPetCorgi = makeSvg(64, 64, `
  <!-- Round Woven Mat -->
  <circle cx="32" cy="38" r="22" fill="#D1D5DB" shape-rendering="auto"/>
  <circle cx="32" cy="38" r="20" fill="#9CA3AF" shape-rendering="auto"/>
  <circle cx="32" cy="38" r="18" fill="#E5E7EB" shape-rendering="auto"/>
  <!-- Corgi Resting -->
  <ellipse cx="32" cy="36" rx="14" ry="11" fill="#D97706" shape-rendering="auto"/>
  <ellipse cx="32" cy="37" rx="8" ry="7" fill="#FEF3C7" shape-rendering="auto"/>
  <!-- Head -->
  <circle cx="32" cy="24" r="10" fill="#D97706" shape-rendering="auto"/>
  <ellipse cx="32" cy="26" rx="5" ry="5" fill="#FEF3C7" shape-rendering="auto"/>
  <!-- Ears -->
  <polygon points="24,18 20,8 28,13" fill="#D97706"/>
  <polygon points="23,16 21,10 26,13" fill="#FCA5A5"/>
  <polygon points="40,18 44,8 36,13" fill="#D97706"/>
  <polygon points="41,16 43,10 38,13" fill="#FCA5A5"/>
  <!-- Eyes & Cute Nose -->
  <circle cx="28" cy="22" r="1.5" fill="#000000" shape-rendering="auto"/>
  <circle cx="36" cy="22" r="1.5" fill="#000000" shape-rendering="auto"/>
  <ellipse cx="32" cy="25" rx="1.5" ry="1" fill="#000000" shape-rendering="auto"/>
  <path d="M30 27 Q 32 29 34 27" stroke="#D97706" stroke-width="1" fill="none" shape-rendering="auto"/>
  <!-- Red Bandana -->
  <polygon points="28,32 36,32 32,36" fill="#EF4444"/>
`);

// 10. Sleeping Black Cat (Gather Screenshot exact pet! - 64x64)
const elPetBlackCat = makeSvg(64, 64, `
  <ellipse cx="32" cy="46" rx="16" ry="6" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Curled Body -->
  <ellipse cx="32" cy="38" rx="14" ry="11" fill="#18181B" shape-rendering="auto"/>
  <ellipse cx="32" cy="38" rx="10" ry="7" fill="#27272A" shape-rendering="auto"/>
  <!-- Curled Tail -->
  <path d="M 44 38 C 48 30, 42 22, 38 24 C 36 26, 40 32, 42 36" stroke="#18181B" stroke-width="3" fill="none" stroke-linecap="round" shape-rendering="auto"/>
  <!-- Cat Head -->
  <circle cx="24" cy="34" r="8" fill="#18181B" shape-rendering="auto"/>
  <!-- Little Pointy Ears -->
  <polygon points="18,29 17,21 23,26" fill="#18181B"/>
  <polygon points="25,26 30,21 29,29" fill="#18181B"/>
  <!-- Sleeping Closed Eyes -->
  <path d="M 20 34 Q 22 36 24 34" stroke="#A1A1AA" stroke-width="1" fill="none" shape-rendering="auto"/>
  <path d="M 26 34 Q 28 36 30 34" stroke="#A1A1AA" stroke-width="1" fill="none" shape-rendering="auto"/>
  <!-- Tiny Pink Nose -->
  <polygon points="25,36 27,36 26,37" fill="#F472B6"/>
`);

// 11. Retro Arcade Machine (64x64)
const elArcadeMachine = makeSvg(64, 64, `
  <rect x="14" y="56" width="36" height="6" fill="rgba(0,0,0,0.4)" rx="2"/>
  <!-- Cabinet Body -->
  <polygon points="16,56 48,56 46,12 42,4 22,4 18,12" fill="#1E1B4B"/>
  <!-- Glowing Neon Marquee -->
  <rect x="22" y="6" width="20" height="8" fill="#7C3AED" rx="2"/>
  <text x="24" y="12" font-family="monospace" font-size="5" font-weight="bold" fill="#38BDF8">ARCADE</text>
  <!-- CRT Screen (Slanted) -->
  <polygon points="20,16 44,16 42,34 22,34" fill="#090D16"/>
  <polygon points="22,18 42,18 40,32 24,32" fill="#064E3B"/>
  <circle cx="32" cy="25" r="4" fill="#FACC15" shape-rendering="auto"/>
  <!-- Controls Deck -->
  <polygon points="18,34 46,34 48,42 16,42" fill="#312E81"/>
  <!-- Joystick (Red Ball) -->
  <line x1="26" y1="38" x2="26" y2="34" stroke="#CBD5E1" stroke-width="2"/>
  <circle cx="26" cy="33" r="2.5" fill="#EF4444" shape-rendering="auto"/>
  <!-- Action Buttons -->
  <circle cx="36" cy="37" r="1.5" fill="#38BDF8" shape-rendering="auto"/>
  <circle cx="40" cy="36" r="1.5" fill="#FACC15" shape-rendering="auto"/>
  <!-- Coin Door -->
  <rect x="24" y="44" width="16" height="10" fill="#0F172A" rx="1"/>
  <rect x="27" y="46" width="2" height="4" fill="#F59E0B"/>
  <rect x="35" y="46" width="2" height="4" fill="#F59E0B"/>
`);

// 12. Tech Server Rack (64x64)
const elServerRack = makeSvg(64, 64, `
  <rect x="14" y="56" width="36" height="6" fill="rgba(0,0,0,0.4)" rx="2"/>
  <!-- Black Steel Frame -->
  <rect x="14" y="8" width="36" height="48" fill="#0F172A" rx="3"/>
  <rect x="16" y="10" width="32" height="44" fill="#1E293B" rx="2"/>
  <!-- Server Blades (U1 to U6) -->
  ${[12, 19, 26, 33, 40, 47].map((y, i) => `
    <rect x="18" y="${y}" width="28" height="5" fill="#334155" rx="1"/>
    <circle cx="21" cy="${y + 2.5}" r="1" fill="${i % 2 === 0 ? '#4ADE80' : '#38BDF8'}" shape-rendering="auto"/>
    <circle cx="24" cy="${y + 2.5}" r="1" fill="${i === 3 ? '#F43F5E' : '#4ADE80'}" shape-rendering="auto"/>
    <line x1="28" y1="${y + 2.5}" x2="42" y2="${y + 2.5}" stroke="#1E293B" stroke-width="1"/>
  `).join('')}
`);

// 13. Office Water Cooler (Gather staple! - 64x64)
const elWaterCooler = makeSvg(64, 64, `
  <ellipse cx="32" cy="56" rx="10" ry="4" fill="rgba(0,0,0,0.3)" shape-rendering="auto"/>
  <!-- Stand -->
  <rect x="24" y="28" width="16" height="28" fill="#E2E8F0" rx="3"/>
  <rect x="26" y="30" width="12" height="24" fill="#F8FAFC" rx="2"/>
  <!-- Taps (Hot Red & Cold Blue) -->
  <rect x="26" y="36" width="3" height="4" fill="#3B82F6"/>
  <rect x="35" y="36" width="3" height="4" fill="#EF4444"/>
  <!-- Drip Tray -->
  <rect x="26" y="44" width="12" height="3" fill="#64748B" rx="1"/>
  <!-- Inverted Blue Water Bottle -->
  <ellipse cx="32" cy="26" rx="9" ry="3" fill="#0284C7" shape-rendering="auto"/>
  <rect x="23" y="10" width="18" height="16" fill="#38BDF8" opacity="0.85" rx="4"/>
  <ellipse cx="32" cy="10" rx="9" ry="3" fill="#BAE6FD" shape-rendering="auto"/>
  <!-- Water Waves -->
  <path d="M25 18 Q 32 15 39 18" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.6" shape-rendering="auto"/>
`);

// 14. Library Bookshelf (64x64)
const elBookshelf = makeSvg(64, 64, `
  <rect x="10" y="54" width="44" height="6" fill="rgba(0,0,0,0.3)" rx="2"/>
  <!-- Mahogany Shelf Unit -->
  <rect x="10" y="10" width="44" height="46" fill="#451A03" rx="2"/>
  <rect x="12" y="12" width="40" height="42" fill="#78350F" rx="1"/>
  <!-- Shelves -->
  <rect x="12" y="24" width="40" height="2" fill="#451A03"/>
  <rect x="12" y="38" width="40" height="2" fill="#451A03"/>
  <!-- Top Shelf Books -->
  <rect x="15" y="14" width="4" height="10" fill="#EF4444" rx="1"/>
  <rect x="20" y="15" width="5" height="9" fill="#3B82F6" rx="1"/>
  <rect x="26" y="13" width="4" height="11" fill="#10B981" rx="1"/>
  <rect x="31" y="16" width="6" height="8" fill="#F59E0B" rx="1"/>
  <rect x="38" y="14" width="4" height="10" fill="#8B5CF6" rx="1"/>
  <rect x="43" y="15" width="5" height="9" fill="#EC4899" rx="1"/>
  <!-- Middle Shelf Books & Plant -->
  <rect x="15" y="28" width="5" height="10" fill="#06B6D4" rx="1"/>
  <rect x="21" y="27" width="4" height="11" fill="#F97316" rx="1"/>
  <rect x="26" y="29" width="6" height="9" fill="#6366F1" rx="1"/>
  <circle cx="42" cy="32" r="3.5" fill="#22C55E" shape-rendering="auto"/>
  <!-- Bottom Shelf Stacked Books -->
  <rect x="15" y="44" width="16" height="3" fill="#EF4444"/>
  <rect x="14" y="41" width="18" height="3" fill="#3B82F6"/>
  <rect x="16" y="38" width="14" height="3" fill="#10B981"/>
  <rect x="36" y="40" width="5" height="10" fill="#EAB308" rx="1"/>
  <rect x="42" y="41" width="4" height="9" fill="#A855F7" rx="1"/>
`);

// 15. Geometric Nordic Rug (2x2 - 128x128)
const elRugNordic = makeSvg(128, 128, `
  <rect x="6" y="6" width="116" height="116" fill="#1E293B" rx="6"/>
  <rect x="10" y="10" width="108" height="108" fill="#243048" rx="4"/>
  <!-- Fringes -->
  ${[14, 26, 38, 50, 62, 74, 86, 98, 110].map(x => `
    <line x1="${x}" y1="6" x2="${x}" y2="9" stroke="#E2E8F0" stroke-width="1.5"/>
    <line x1="${x}" y1="119" x2="${x}" y2="122" stroke="#E2E8F0" stroke-width="1.5"/>
  `).join('')}
  <!-- Inner Nordic Diamond Pattern -->
  <polygon points="64,24 96,64 64,104 32,64" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
  <polygon points="64,36 84,64 64,92 44,64" fill="none" stroke="#818CF8" stroke-width="2"/>
  <circle cx="64" cy="64" r="8" fill="#4F46E5" shape-rendering="auto"/>
  <circle cx="64" cy="64" r="4" fill="#38BDF8" shape-rendering="auto"/>
`);

// Write files
const avatars = [
  { name: 'Phillip (Adventurer)', filename: 'avatar_phillip.svg', svg: avatarPhillip },
  { name: 'Alex (Coder)', filename: 'avatar_alex.svg', svg: avatarAlex },
  { name: 'Jessica (Tech Lead)', filename: 'avatar_jessica.svg', svg: avatarJessica },
  { name: 'Rasmus (Cyber Gamer)', filename: 'avatar_rasmus.svg', svg: avatarRasmus },
  { name: 'Lauren (Designer)', filename: 'avatar_lauren.svg', svg: avatarLauren },
  { name: 'Matt (Executive)', filename: 'avatar_matt.svg', svg: avatarMatt },
  { name: 'Gaby (Artist)', filename: 'avatar_gaby.svg', svg: avatarGaby },
  { name: 'Zepto (Speed Runner)', filename: 'avatar_zepto.svg', svg: avatarZepto },
  { name: 'Corgi Explorer', filename: 'avatar_corgi.svg', svg: avatarCorgi },
  { name: 'Aria (Bio-Engineer)', filename: 'avatar_aria.svg', svg: avatarAria },
];

const elements = [
  { name: 'Triple Monitor Workstation', filename: 'workstation_triple.svg', svg: elWorkstationTriple, width: 2, height: 1, static: true },
  { name: 'Oak Desk with Laptop', filename: 'desk_wood_laptop.svg', svg: elDeskWoodLaptop, width: 1, height: 1, static: true },
  { name: 'Brown Leather Sofa', filename: 'couch_leather_brown.svg', svg: elCouchBrown, width: 2, height: 1, static: true },
  { name: 'Modern Charcoal Couch', filename: 'couch_modern_charcoal.svg', svg: elCouchModernCharcoal, width: 2, height: 1, static: true },
  { name: 'Boardroom Meeting Table', filename: 'meeting_table.svg', svg: elMeetingTable, width: 2, height: 2, static: true },
  { name: 'Lush Potted Monstera', filename: 'plant_monstera.svg', svg: elPlantMonstera, width: 1, height: 1, static: true },
  { name: 'Sakura Bonsai Tree', filename: 'plant_sakura_bonsai.svg', svg: elPlantSakura, width: 1, height: 1, static: true },
  { name: 'Espresso Coffee Bar', filename: 'coffee_espresso_bar.svg', svg: elCoffeeEspresso, width: 1, height: 1, static: true },
  { name: 'Office Mascot Corgi', filename: 'pet_corgi.svg', svg: elPetCorgi, width: 1, height: 1, static: true },
  { name: 'Sleeping Black Cat', filename: 'pet_black_cat.svg', svg: elPetBlackCat, width: 1, height: 1, static: true },
  { name: 'Retro Arcade Cabinet', filename: 'arcade_machine.svg', svg: elArcadeMachine, width: 1, height: 1, static: true },
  { name: 'Tech Server Rack', filename: 'server_rack.svg', svg: elServerRack, width: 1, height: 1, static: true },
  { name: 'Office Water Dispenser', filename: 'water_cooler.svg', svg: elWaterCooler, width: 1, height: 1, static: true },
  { name: 'Library Bookshelf', filename: 'bookshelf_library.svg', svg: elBookshelf, width: 1, height: 1, static: true },
  { name: 'Nordic Geometric Rug', filename: 'cozy_rug_nordic.svg', svg: elRugNordic, width: 2, height: 2, static: false },
];

avatars.forEach(a => {
  const filePath = path.join(avatarsDir, a.filename);
  fs.writeFileSync(filePath, a.svg.trim());
  console.log('Saved avatar:', a.filename);
});

elements.forEach(e => {
  const filePath = path.join(elementsDir, e.filename);
  fs.writeFileSync(filePath, e.svg.trim());
  console.log('Saved element:', e.filename);
});

console.log('Successfully generated', avatars.length, 'avatars and', elements.length, 'elements!');

