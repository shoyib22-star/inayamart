/* ============================================================
   Hand-drawn SVG artwork for every product, plus the mascots.
   Each drawing lives in a 200 x 200 box and is transparent, so
   the pastel tint behind it can come from CSS.
   ============================================================ */

const INK = '#241F2E'
const k = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`
const ground = '<ellipse cx="100" cy="184" rx="52" ry="7" fill="#241F2E" opacity=".07"/>'

const drawings = {
  bag: `
    <path d="M58 64h84l8 96a12 12 0 0 1-12 13H62a12 12 0 0 1-12-13z" fill="#FFFDF7" ${k}/>
    <path d="M58 64h84l-6-15a8 8 0 0 0-8-6H72a8 8 0 0 0-8 6z" fill="#FFC53D" ${k}/>
    <rect x="74" y="98" width="52" height="46" rx="12" fill="#FF5E8A"/>
    <circle cx="100" cy="116" r="8.5" fill="#FFFDF7"/>
    <circle cx="85" cy="105" r="4.6" fill="#FFFDF7"/>
    <circle cx="100" cy="102" r="4.6" fill="#FFFDF7"/>
    <circle cx="115" cy="105" r="4.6" fill="#FFFDF7"/>
    <circle cx="76" cy="158" r="4" fill="#241F2E" opacity=".22"/>
    <circle cx="92" cy="158" r="4" fill="#241F2E" opacity=".22"/>
    <circle cx="108" cy="158" r="4" fill="#241F2E" opacity=".22"/>
    <circle cx="124" cy="158" r="4" fill="#241F2E" opacity=".22"/>`,
  can: `
    <path d="M60 68h80v86a14 14 0 0 1-14 14H74a14 14 0 0 1-14-14z" fill="#FFFDF7" ${k}/>
    <ellipse cx="100" cy="68" rx="40" ry="13" fill="#EFE9F5" ${k}/>
    <path d="M60 96h80v46H60z" fill="#45B6F2" ${k}/>
    <path d="M88 119c4-7 14-9 20-4l10-6v20l-10-6c-6 5-16 3-20-4z" fill="#FFFDF7"/>
    <path d="M95 64c5-1 8-5 8-10" fill="none" ${k} stroke-width="4"/>`,
  cookie: `
    <circle cx="100" cy="102" r="52" fill="#F0BE7C" ${k}/>
    <circle cx="100" cy="102" r="39" fill="none" stroke="#D79C55" stroke-width="3" opacity=".65"/>
    <circle cx="82" cy="84" r="7" fill="#6B4A2F"/>
    <circle cx="116" cy="92" r="5.5" fill="#6B4A2F"/>
    <circle cx="96" cy="118" r="6.5" fill="#6B4A2F"/>
    <circle cx="77" cy="112" r="5" fill="#6B4A2F"/>
    <circle cx="124" cy="118" r="4.5" fill="#6B4A2F"/>`,
  fish: `
    <path d="M130 104l32-21v42z" fill="#7EC8F2" ${k}/>
    <ellipse cx="92" cy="104" rx="46" ry="27" fill="#7EC8F2" ${k}/>
    <circle cx="66" cy="97" r="6" fill="#241F2E"/>
    <path d="M88 84c7 11 7 29 0 40" fill="none" stroke="${INK}" stroke-width="4" opacity=".45"/>
    <path d="M96 128c9-3 16-1 20 6" fill="none" ${k} stroke-width="4"/>`,
  stick: `
    <rect x="38" y="84" width="124" height="34" rx="17" fill="#8FD46B" ${k}/>
    <path d="M66 88v26M92 88v26M118 88v26M144 88v26" stroke="#4E9B36" stroke-width="6" stroke-linecap="round"/>
    <path d="M56 101h10" stroke="#4E9B36" stroke-width="4" stroke-linecap="round"/>`,
  ball: `
    <circle cx="100" cy="102" r="54" fill="#FF5E8A" ${k}/>
    <path d="M62 66c24 12 48 34 58 66" fill="none" stroke="#FFFDF7" stroke-width="9" stroke-linecap="round"/>
    <path d="M52 112c26-14 66-16 92 4" fill="none" stroke="#FFFDF7" stroke-width="9" stroke-linecap="round" opacity=".9"/>`,
  rope: `
    <rect x="40" y="88" width="120" height="28" rx="14" fill="#F2C078" ${k}/>
    <path d="M56 89l13 26M78 89l13 26M100 89l13 26M122 89l13 26" stroke="#C98B3E" stroke-width="5" stroke-linecap="round"/>
    <circle cx="42" cy="102" r="16" fill="#FF5E8A" ${k}/>
    <circle cx="158" cy="102" r="16" fill="#9A7BFF" ${k}/>`,
  wand: `
    <path d="M62 152 124 70" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
    <path d="M62 152 124 70" stroke="#D9A86C" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="148" cy="58" rx="21" ry="10" fill="#FF7FA9" ${k} stroke-width="4" transform="rotate(-30 148 58)"/>
    <ellipse cx="134" cy="40" rx="18" ry="8.5" fill="#9A7BFF" ${k} stroke-width="4" transform="rotate(16 134 40)"/>
    <circle cx="126" cy="68" r="7" fill="#FFC53D" ${k} stroke-width="4"/>
    <path d="M172 96l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#FFC53D"/>`,
  duck: `
    <path d="M48 112 22 98l2 28z" fill="#FFD447" ${k}/>
    <ellipse cx="98" cy="128" rx="52" ry="34" fill="#FFD447" ${k}/>
    <circle cx="124" cy="84" r="27" fill="#FFD447" ${k}/>
    <path d="M148 80l22 7-20 11z" fill="#FF8A3D" ${k}/>
    <circle cx="133" cy="74" r="4.5" fill="#241F2E"/>
    <path d="M76 124c10-8 23-5 29 4" fill="none" stroke="#E0A800" stroke-width="5" stroke-linecap="round"/>`,
  bear: `
    <circle cx="66" cy="68" r="19" fill="#C99A6E" ${k}/>
    <circle cx="134" cy="68" r="19" fill="#C99A6E" ${k}/>
    <circle cx="100" cy="104" r="54" fill="#DCA875" ${k}/>
    <ellipse cx="100" cy="120" rx="27" ry="19" fill="#FFF0DA" ${k} stroke-width="4"/>
    <circle cx="82" cy="96" r="5.5" fill="#241F2E"/>
    <circle cx="118" cy="96" r="5.5" fill="#241F2E"/>
    <ellipse cx="100" cy="112" rx="9" ry="7" fill="#241F2E"/>
    <path d="M100 119v5m0 0c-4 5-11 5-14 0m14 0c3 5 10 5 14 0" fill="none" ${k} stroke-width="3.5"/>`,
  pipette: `
    <rect x="84" y="52" width="32" height="72" rx="16" fill="#FFFDF7" ${k}/>
    <rect x="76" y="36" width="48" height="20" rx="10" fill="#2FBF9B" ${k}/>
    <rect x="90" y="88" width="20" height="22" rx="4" fill="#45B6F2" opacity=".7"/>
    <path d="M92 124h16l-8 46z" fill="#45B6F2" ${k}/>
    <path d="M152 110c9 12 12 18 12 23a12 12 0 0 1-24 0c0-5 3-11 12-23z" fill="#45B6F2" ${k}/>`,
  jar: `
    <rect x="58" y="76" width="84" height="84" rx="18" fill="#FFFDF7" ${k}/>
    <rect x="54" y="52" width="92" height="28" rx="11" fill="#9A7BFF" ${k}/>
    <rect x="74" y="98" width="52" height="46" rx="10" fill="#DCEBFF"/>
    <rect x="82" y="108" width="26" height="13" rx="6.5" fill="#FF5E8A" stroke="${INK}" stroke-width="3.5" transform="rotate(-20 95 114)"/>
    <rect x="90" y="128" width="26" height="13" rx="6.5" fill="#FFC53D" stroke="${INK}" stroke-width="3.5" transform="rotate(-20 103 134)"/>`,
  blister: `
    <rect x="50" y="60" width="100" height="86" rx="16" fill="#FFFDF7" ${k}/>
    <circle cx="76" cy="86" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>
    <circle cx="100" cy="86" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>
    <circle cx="124" cy="86" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>
    <circle cx="76" cy="120" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>
    <circle cx="100" cy="120" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>
    <circle cx="124" cy="120" r="12" fill="#FFDCE0" ${k} stroke-width="4"/>`,
  dropper: `
    <rect x="74" y="82" width="52" height="76" rx="16" fill="#FFC53D" ${k}/>
    <rect x="88" y="48" width="24" height="38" rx="10" fill="${INK}" ${k}/>
    <rect x="80" y="40" width="40" height="14" rx="7" fill="#2FBF9B" ${k}/>
    <rect x="82" y="100" width="36" height="34" rx="8" fill="#FFFDF7"/>
    <circle cx="100" cy="110" r="4" fill="#FF5E8A"/>
    <path d="M92 122c5-4 11-4 16 0" stroke="#FF5E8A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  collar: `
    <path d="M44 86a56 56 0 0 0 112 0" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/>
    <path d="M44 86a56 56 0 0 0 112 0" fill="none" stroke="#FF5E8A" stroke-width="22" stroke-linecap="round"/>
    <rect x="118" y="112" width="30" height="22" rx="7" fill="#FFC53D" ${k} stroke-width="4" transform="rotate(-18 133 123)"/>
    <circle cx="100" cy="150" r="6" fill="none" ${k} stroke-width="4"/>
    <circle cx="100" cy="166" r="17" fill="#FFC53D" ${k}/>`,
  leash: `
    <circle cx="64" cy="66" r="24" fill="none" stroke="${INK}" stroke-width="16"/>
    <circle cx="64" cy="66" r="24" fill="none" stroke="#45B6F2" stroke-width="7"/>
    <path d="M82 82c26 16 22 44 44 60" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
    <path d="M82 82c26 16 22 44 44 60" fill="none" stroke="#45B6F2" stroke-width="5" stroke-linecap="round"/>
    <rect x="122" y="140" width="34" height="22" rx="9" fill="#FFC53D" ${k} transform="rotate(28 139 151)"/>`,
  bed: `
    <ellipse cx="100" cy="112" rx="74" ry="48" fill="#FFC53D" ${k}/>
    <ellipse cx="100" cy="110" rx="43" ry="25" fill="#F59BB6" ${k}/>
    <path d="M58 94c9-11 23-16 42-16" fill="none" stroke="#FFE0B8" stroke-width="8" stroke-linecap="round"/>`,
  bowl: `
    <path d="M46 92h108l-11 48a22 22 0 0 1-21 16H78a22 22 0 0 1-21-16z" fill="#45B6F2" ${k}/>
    <ellipse cx="100" cy="92" rx="54" ry="15" fill="#FFFDF7" ${k}/>
    <circle cx="100" cy="128" r="8" fill="#FFFDF7"/>
    <circle cx="87" cy="119" r="4" fill="#FFFDF7"/>
    <circle cx="100" cy="116" r="4" fill="#FFFDF7"/>
    <circle cx="113" cy="119" r="4" fill="#FFFDF7"/>`,
  shampoo: `
    <rect x="64" y="74" width="72" height="104" rx="20" fill="#FFFDF7" ${k}/>
    <rect x="84" y="54" width="32" height="22" rx="6" fill="#2FBF9B" ${k}/>
    <rect x="108" y="44" width="28" height="10" rx="5" fill="#2FBF9B" ${k}/>
    <rect x="108" y="34" width="10" height="18" rx="5" fill="#2FBF9B" ${k}/>
    <rect x="76" y="100" width="48" height="52" rx="12" fill="#FFC53D"/>
    <circle cx="90" cy="116" r="6" fill="#FFFDF7"/>
    <circle cx="106" cy="127" r="8" fill="#FFFDF7"/>
    <circle cx="95" cy="139" r="5" fill="#FFFDF7"/>`,
  brush: `
    <rect x="70" y="106" width="60" height="68" rx="22" fill="#9A7BFF" ${k}/>
    <rect x="52" y="52" width="96" height="50" rx="16" fill="#FFFDF7" ${k}/>
    <path d="M68 100v16M80 100v16M92 100v16M104 100v16M116 100v16M128 100v16M138 100v16" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
}

function productArt(name, className = '') {
  return `<svg viewBox="0 0 200 200" class="${className}" aria-hidden="true" focusable="false">${ground}${drawings[name] || drawings.bag}</svg>`
}

function categoryArt(name, className = '') {
  return productArt(name, className)
}

/* --- Mascots ------------------------------------------------- */

function dogFace(className = '') {
  return `<svg viewBox="0 0 160 160" class="${className}" aria-hidden="true" focusable="false">
    <ellipse cx="30" cy="60" rx="17" ry="30" fill="#D08A4E" stroke="${INK}" stroke-width="5" transform="rotate(-14 30 60)"/>
    <ellipse cx="130" cy="60" rx="17" ry="30" fill="#D08A4E" stroke="${INK}" stroke-width="5" transform="rotate(14 130 60)"/>
    <circle cx="80" cy="82" r="50" fill="#F0AE6E" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="80" cy="100" rx="27" ry="20" fill="#FFEBCF"/>
    <circle cx="60" cy="72" r="6" fill="${INK}"/>
    <circle cx="100" cy="72" r="6" fill="${INK}"/>
    <circle cx="62" cy="70" r="2" fill="#FFFDF7"/>
    <circle cx="102" cy="70" r="2" fill="#FFFDF7"/>
    <ellipse cx="80" cy="93" rx="9" ry="7" fill="${INK}"/>
    <path d="M80 100v6m0 0c-4 5-10 5-13 0m13 0c3 5 9 5 13 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="80" cy="114" rx="9" ry="6" fill="#FF6B8A"/>
  </svg>`
}

function catFace(className = '') {
  return `<svg viewBox="0 0 160 160" class="${className}" aria-hidden="true" focusable="false">
    <path d="M34 78 28 30l40 26z" fill="#FFB27A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M126 78 132 30l-40 26z" fill="#FFB27A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M46 64 44 44l18 12z" fill="#FF9BB5"/>
    <path d="M114 64 116 44l-18 12z" fill="#FF9BB5"/>
    <circle cx="80" cy="88" r="48" fill="#FFC08A" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="62" cy="84" rx="6" ry="8" fill="${INK}"/>
    <ellipse cx="98" cy="84" rx="6" ry="8" fill="${INK}"/>
    <circle cx="64" cy="81" r="2" fill="#FFFDF7"/>
    <circle cx="100" cy="81" r="2" fill="#FFFDF7"/>
    <path d="M80 98l-7 5h14z" fill="#FF6B8A"/>
    <path d="M80 103v4m0 0c-3 5-9 5-12 1m12-1c3 5 9 5 12 1" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M34 96h14M34 108h14M126 96h-14M126 108h-14" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
  </svg>`
}

function pawMark(className = '') {
  return `<svg viewBox="0 0 32 32" class="${className}" aria-hidden="true" focusable="false">
    <ellipse cx="16" cy="21" rx="8" ry="7" fill="currentColor"/>
    <ellipse cx="6.5" cy="13" rx="4" ry="5" fill="currentColor" transform="rotate(-18 6.5 13)"/>
    <ellipse cx="12.5" cy="8.5" rx="3.6" ry="5" fill="currentColor" transform="rotate(-6 12.5 8.5)"/>
    <ellipse cx="19.5" cy="8.5" rx="3.6" ry="5" fill="currentColor" transform="rotate(6 19.5 8.5)"/>
    <ellipse cx="25.5" cy="13" rx="4" ry="5" fill="currentColor" transform="rotate(18 25.5 13)"/>
  </svg>`
}

function starBurst(className = '') {
  return `<svg viewBox="0 0 40 40" class="${className}" aria-hidden="true" focusable="false">
    <path d="M20 2l4.6 12.4L37 19l-12.4 4.6L20 36l-4.6-12.4L3 19l12.4-4.6z" fill="currentColor"/>
  </svg>`
}

function arrowRight(className = '') {
  return `<svg viewBox="0 0 24 24" class="${className}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 12h15M13 6l6 6-6 6"/>
  </svg>`
}
