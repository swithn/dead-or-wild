/* Dead or Wild - original SVG symbol art. */
(() => {
  "use strict";
  const SERIF = "Georgia, 'Times New Roman', serif";
  const SLOT_ART = {};

  const royal = (label, suit, accent, size) => `
<svg viewBox="0 0 100 100" role="img" aria-label="${label}">
  <rect x="13" y="4" width="74" height="92" rx="9" fill="#f6e7c7" stroke="#2a1a0e" stroke-width="3"/>
  <rect x="18" y="9" width="64" height="82" rx="6" fill="none" stroke="${accent}" stroke-width="2" opacity="0.65"/>
  <text x="24" y="27" font-family="${SERIF}" font-size="15" font-weight="700" fill="${accent}">${label}</text>
  <text x="76" y="27" text-anchor="end" font-family="${SERIF}" font-size="14" fill="${accent}">${suit}</text>
  <text x="76" y="93" text-anchor="end" font-family="${SERIF}" font-size="15" font-weight="700" fill="${accent}">${label}</text>
  <text x="24" y="93" font-family="${SERIF}" font-size="14" fill="${accent}">${suit}</text>
  <text x="50" y="69" text-anchor="middle" font-family="${SERIF}" font-size="${size}" font-weight="900" fill="${accent}" stroke="#2a1a0e" stroke-width="0.6">${label}</text>
</svg>`;

  SLOT_ART.a = royal("A", "\u2660", "#8a2a1c", 40);
  SLOT_ART.k = royal("K", "\u2665", "#1f6b5c", 36);
  SLOT_ART.q = royal("Q", "\u2666", "#8a2a1c", 36);
  SLOT_ART.j = royal("J", "\u2663", "#1f6b5c", 36);
  SLOT_ART.t10 = royal("10", "\u2605", "#a9761a", 26);

  SLOT_ART.skull = `
<svg viewBox="0 0 100 100" role="img" aria-label="Cow skull">
  <path d="M29 34 C10 31 5 12 11 5 C19 13 24 20 30 26 Z" fill="#e9dcc0" stroke="#3a2a18" stroke-width="2.5"/>
  <path d="M71 34 C90 31 95 12 89 5 C81 13 76 20 70 26 Z" fill="#e9dcc0" stroke="#3a2a18" stroke-width="2.5"/>
  <path d="M50 12 C26 12 20 30 22 44 C23 54 30 58 30 66 L30 78 C30 86 40 90 50 90 C60 90 70 86 70 78 L70 66 C70 58 77 54 78 44 C80 30 74 12 50 12 Z" fill="#efe4cb" stroke="#2e2113" stroke-width="3"/>
  <ellipse cx="38" cy="42" rx="8" ry="9" fill="#2a2118"/>
  <ellipse cx="62" cy="42" rx="8" ry="9" fill="#2a2118"/>
  <path d="M50 50 L45 62 L55 62 Z" fill="#2a2118"/>
  <path d="M40 74 L60 74" stroke="#2a2118" stroke-width="2"/>
  <path d="M45 74 L45 83 M55 74 L55 83" stroke="#2a2118" stroke-width="2"/>
</svg>`;

  SLOT_ART.bandit = `
<svg viewBox="0 0 100 100" role="img" aria-label="Bandit">
  <ellipse cx="50" cy="37" rx="43" ry="11" fill="#4a2f1b" stroke="#241407" stroke-width="3"/>
  <path d="M24 35 C26 16 38 10 50 10 C62 10 74 16 76 35 Z" fill="#5a3a22" stroke="#241407" stroke-width="3"/>
  <path d="M25 30 h50" stroke="#c9962f" stroke-width="4"/>
  <path d="M30 40 C30 70 38 85 50 85 C62 85 70 70 70 40 Z" fill="#e0b083" stroke="#3a2416" stroke-width="2.5"/>
  <path d="M28 52 C38 46 62 46 72 52 L72 66 C62 74 38 74 28 66 Z" fill="#b8322a" stroke="#5a120c" stroke-width="2"/>
  <circle cx="41" cy="55" r="3" fill="#1b120a"/>
  <circle cx="59" cy="55" r="3" fill="#1b120a"/>
  <path d="M72 58 l10 6 l-4 8 l-8 -6 Z" fill="#b8322a" stroke="#5a120c" stroke-width="2"/>
</svg>`;

  SLOT_ART.money = `
<svg viewBox="0 0 100 100" role="img" aria-label="Cash">
  <g transform="rotate(-6 50 50)">
    <rect x="15" y="42" width="70" height="26" rx="3" fill="#d8cba6" stroke="#3a2a18" stroke-width="2"/>
    <rect x="13" y="34" width="74" height="30" rx="3" fill="#7fae5a" stroke="#23401c" stroke-width="2.5"/>
    <rect x="21" y="38" width="58" height="22" rx="2" fill="none" stroke="#3c6b2c" stroke-width="1.5"/>
    <circle cx="50" cy="49" r="9" fill="none" stroke="#3c6b2c" stroke-width="2"/>
    <text x="50" y="54" text-anchor="middle" font-family="${SERIF}" font-size="12" font-weight="700" fill="#23401c">$</text>
  </g>
</svg>`;

  SLOT_ART.whisky = `
<svg viewBox="0 0 100 100" role="img" aria-label="Whisky">
  <rect x="38" y="8" width="24" height="16" rx="3" fill="#3a2416"/>
  <path d="M40 22 L40 30 C34 34 30 40 30 48 L30 84 C30 89 34 92 40 92 L60 92 C66 92 70 89 70 84 L70 48 C70 40 66 34 60 30 L60 22 Z" fill="#c98a2a" stroke="#3a2416" stroke-width="3"/>
  <rect x="32" y="52" width="36" height="27" rx="3" fill="#f3e6c8" stroke="#7a4f1a" stroke-width="2"/>
  <text x="50" y="64" text-anchor="middle" font-family="${SERIF}" font-size="9" font-weight="700" fill="#5a3312">OLD</text>
  <text x="50" y="75" text-anchor="middle" font-family="${SERIF}" font-size="8" font-weight="700" fill="#5a3312">WHISKY</text>
  <path d="M35 40 L35 84" stroke="#f7c65a" stroke-width="3" opacity="0.5"/>
</svg>`;

  SLOT_ART.revolver = `
<svg viewBox="0 0 100 100" role="img" aria-label="Revolver">
  <g transform="rotate(-10 50 50)">
    <path d="M31 53 C27 63 21 77 17 90 L35 93 C40 79 45 67 47 59 Z" fill="#7a4a24" stroke="#2a1a0e" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M29 60 C26 70 22 81 20 89" fill="none" stroke="#5a3416" stroke-width="1.6" opacity="0.8"/>
    <path d="M35 63 C32 73 29 83 28 91" fill="none" stroke="#5a3416" stroke-width="1.4" opacity="0.6"/>
    <path d="M27 34 H57 V59 H47 C40 59 33 55 29 51 Z" fill="#6f7a83" stroke="#20262b" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M55 38 H91 C93 38 94 39 94 41 V47 C94 49 93 50 91 50 H55 Z" fill="#8d99a3" stroke="#20262b" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="57" y="40.5" width="33" height="3" rx="1.5" fill="#c7d0d6"/>
    <rect x="90" y="40" width="3" height="8" fill="#3c454c"/>
    <rect x="58" y="50" width="28" height="4.5" rx="2" fill="#5b666e" stroke="#20262b" stroke-width="1.8"/>
    <circle cx="45" cy="48" r="13" fill="#7d8891" stroke="#20262b" stroke-width="2.5"/>
    <circle cx="45" cy="48" r="9" fill="none" stroke="#5f6a72" stroke-width="1.5"/>
    <circle cx="45" cy="48" r="3" fill="#39424a" stroke="#20262b" stroke-width="1"/>
    <path d="M37.5 39 C35.5 45 35.5 51 37.5 57 M52.5 39 C54.5 45 54.5 51 52.5 57" fill="none" stroke="#3c454c" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M30 35 L25 29 L21 32 L25 38 Z" fill="#5b666e" stroke="#20262b" stroke-width="2" stroke-linejoin="round"/>
    <path d="M55 57 C60 63 60 71 54 76 C48 81 41 78 40 71 C39 66 41 61 44 59" fill="none" stroke="#20262b" stroke-width="3" stroke-linecap="round"/>
    <path d="M48 62 C50 66 48 70 44 71" fill="none" stroke="#20262b" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M83 38 L85 33 L88 33 L88 38 Z" fill="#5b666e" stroke="#20262b" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="54" y="34" width="3" height="5" fill="#5b666e" stroke="#20262b" stroke-width="1.2"/>
  </g>
</svg>`;

  SLOT_ART.star = `
<svg viewBox="0 0 100 100" role="img" aria-label="Sheriff badge">
  <path d="M50 8 L58 32 L84 30 L63 47 L72 72 L50 57 L28 72 L37 47 L16 30 L42 32 Z" fill="#f2b632" stroke="#7a4f10" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="50" cy="45" r="18" fill="#f7d778" stroke="#7a4f10" stroke-width="2"/>
  <circle cx="50" cy="45" r="13.5" fill="none" stroke="#7a4f10" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="50" cy="45" r="4.5" fill="#8a5a12"/>
</svg>`;

  SLOT_ART.wild = `
<svg viewBox="0 0 100 100" role="img" aria-label="Wild poster">
  <rect x="18" y="7" width="64" height="86" rx="3" fill="#e8d3a6" stroke="#3a2412" stroke-width="3"/>
  <rect x="23" y="12" width="54" height="76" fill="none" stroke="#8a5a2c" stroke-width="1.5" stroke-dasharray="3 2"/>
  <text x="50" y="27" text-anchor="middle" font-family="${SERIF}" font-size="12" font-weight="900" fill="#6b2a18" letter-spacing="1">WANTED</text>
  <path d="M32 60 C32 50 40 46 50 46 C60 46 68 50 68 60 L68 71 L32 71 Z" fill="#4a3320"/>
  <circle cx="50" cy="51" r="7" fill="#4a3320"/>
  <path d="M35 44 h30 l-3 -6 h-24 z" fill="#2e1f12"/>
  <rect x="33" y="44" width="34" height="3" fill="#2e1f12"/>
  <rect x="26" y="74" width="48" height="12" rx="2" fill="#8a2a1c"/>
  <text x="50" y="83" text-anchor="middle" font-family="${SERIF}" font-size="9" font-weight="700" fill="#f7e2b5">WILD</text>
</svg>`;

  SLOT_ART.vs = `
<svg viewBox="0 0 100 100" role="img" aria-label="VS duel reel">
  <circle cx="50" cy="50" r="40" fill="#231a12" stroke="#c9962f" stroke-width="4"/>
  <path d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" fill="#8a2a1c"/>
  <path d="M50 90 A40 40 0 0 1 10 50 L50 50 Z" fill="#1f4a6b"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke="#f2b632" stroke-width="2"/>
  <text x="50" y="58" text-anchor="middle" font-family="${SERIF}" font-size="25" font-weight="900" fill="#f7e2b5" stroke="#2a1a0f" stroke-width="1">VS</text>
  <circle cx="30" cy="38" r="6" fill="#f7e2b5" opacity="0.9"/>
  <circle cx="70" cy="62" r="6" fill="#f7e2b5" opacity="0.9"/>
</svg>`;

  SLOT_ART.duel = `
<svg viewBox="0 0 100 100" role="img" aria-label="Duel at Dawn scatter">
  <defs>
    <radialGradient id="duelSun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffe9a8"/>
      <stop offset="100%" stop-color="#e8621e"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="41" r="30" fill="url(#duelSun)"/>
  <g stroke="#f2b632" stroke-width="3" stroke-linecap="round">
    <line x1="50" y1="2" x2="50" y2="12"/>
    <line x1="14" y1="24" x2="22" y2="31"/>
    <line x1="86" y1="24" x2="78" y2="31"/>
    <line x1="6" y1="52" x2="17" y2="52"/>
    <line x1="94" y1="52" x2="83" y2="52"/>
  </g>
  <g fill="#2e2118" stroke="#0f0a06" stroke-width="2">
    <rect x="20" y="58" width="44" height="7" rx="2" transform="rotate(33 50 61)"/>
    <rect x="36" y="58" width="44" height="7" rx="2" transform="rotate(-33 50 61)"/>
  </g>
  <rect x="22" y="78" width="56" height="14" rx="3" fill="#8a2a1c" stroke="#3a120c" stroke-width="2"/>
  <text x="50" y="88" text-anchor="middle" font-family="${SERIF}" font-size="10" font-weight="800" fill="#f7e2b5">DUEL</text>
</svg>`;

  SLOT_ART.dead = `
<svg viewBox="0 0 100 100" role="img" aria-label="Dead Man's Hand scatter">
  <path d="M26 92 L26 40 C26 22 38 11 50 11 C62 11 74 22 74 40 L74 92 Z" fill="#9a958a" stroke="#3a352c" stroke-width="3"/>
  <path d="M32 92 L32 44 C32 28 40 19 50 19 C60 19 68 28 68 44 L68 92 Z" fill="#b9b3a4"/>
  <path d="M50 28 v26 M39 38 h22" stroke="#5a5448" stroke-width="4" stroke-linecap="round"/>
  <text x="50" y="75" text-anchor="middle" font-family="${SERIF}" font-size="11" font-weight="800" fill="#4a443a" letter-spacing="1">DEAD</text>
  <path d="M12 92 h76" stroke="#3a352c" stroke-width="4"/>
  <path d="M18 92 l-4 -10 M25 92 l-2 -8 M82 92 l4 -10 M75 92 l2 -8" stroke="#4a443a" stroke-width="2"/>
</svg>`;

  SLOT_ART.train = `
<svg viewBox="0 0 100 100" role="img" aria-label="Great Train Robbery scatter">
  <circle cx="70" cy="15" r="7" fill="#d9d2c4" opacity="0.85"/>
  <circle cx="79" cy="9" r="5" fill="#d9d2c4" opacity="0.6"/>
  <circle cx="63" cy="8" r="4" fill="#d9d2c4" opacity="0.5"/>
  <rect x="14" y="40" width="58" height="30" rx="4" fill="#7a2a1c" stroke="#2a0e08" stroke-width="3"/>
  <rect x="14" y="34" width="26" height="10" rx="3" fill="#5a1c10" stroke="#2a0e08" stroke-width="2"/>
  <rect x="52" y="24" width="24" height="22" rx="3" fill="#8a3423" stroke="#2a0e08" stroke-width="2.5"/>
  <rect x="24" y="20" width="10" height="16" rx="2" fill="#2e2118"/>
  <rect x="21" y="16" width="16" height="6" rx="2" fill="#2e2118"/>
  <circle cx="74" cy="44" r="7" fill="#f7d24a" stroke="#2a0e08" stroke-width="2"/>
  <circle cx="34" cy="76" r="10" fill="#3a352c" stroke="#1a1712" stroke-width="3"/>
  <circle cx="64" cy="76" r="12" fill="#3a352c" stroke="#1a1712" stroke-width="3"/>
  <circle cx="64" cy="76" r="4" fill="#c9962f"/>
  <path d="M8 88 h84" stroke="#2e2118" stroke-width="5"/>
  <text x="50" y="99" text-anchor="middle" font-family="${SERIF}" font-size="8" font-weight="800" fill="#f7e2b5" letter-spacing="1">TRAIN</text>
</svg>`;

  SLOT_ART.wildc = `
<svg viewBox="0 0 100 100" role="img" aria-label="Collect wild">
  <rect x="15" y="5" width="70" height="90" rx="7" fill="#f4d67a" stroke="#7a4f10" stroke-width="4"/>
  <rect x="22" y="12" width="56" height="76" rx="3" fill="#7a2a1c" stroke="#3a120c" stroke-width="2"/>
  <text x="50" y="30" text-anchor="middle" font-family="${SERIF}" font-size="10" font-weight="900" fill="#f7e2b5" letter-spacing="1">WANTED</text>
  <path d="M50 37 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 z" fill="#f7d24a" stroke="#8a5a12" stroke-width="1.5"/>
  <rect x="29" y="70" width="42" height="13" rx="2" fill="#f2b632"/>
  <text x="50" y="80" text-anchor="middle" font-family="${SERIF}" font-size="9" font-weight="800" fill="#5a3108">WILD</text>
</svg>`;

  SLOT_ART.mult = (value) => `
<svg viewBox="0 0 100 100" role="img" aria-label="Multiplier ${value}">
  <circle cx="50" cy="50" r="40" fill="#f2b632" stroke="#7a4f10" stroke-width="4"/>
  <circle cx="50" cy="50" r="31" fill="#f7d778" stroke="#a06a12" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="50" y="61" text-anchor="middle" font-family="${SERIF}" font-size="${value >= 10 ? 23 : 28}" font-weight="900" fill="#5a3108">\u00D7${value}</text>
</svg>`;

  SLOT_ART.outlaw = `
<svg viewBox="0 0 100 100" role="img" aria-label="Outlaw">
  <rect width="100" height="100" fill="#2a0f0b"/>
  <circle cx="50" cy="48" r="30" fill="#d99f72"/>
  <ellipse cx="50" cy="30" rx="43" ry="10" fill="#241407"/>
  <path d="M26 30 C28 12 38 6 50 6 C62 6 72 12 74 30 Z" fill="#3a2416"/>
  <path d="M26 26 h48" stroke="#c9962f" stroke-width="3"/>
  <path d="M26 54 C36 48 64 48 74 54 L74 68 C64 76 36 76 26 68 Z" fill="#b8322a" stroke="#5a120c" stroke-width="2"/>
  <circle cx="41" cy="58" r="3.5" fill="#120a06"/>
  <circle cx="59" cy="58" r="3.5" fill="#120a06"/>
</svg>`;

  SLOT_ART.sheriff = `
<svg viewBox="0 0 100 100" role="img" aria-label="Sheriff">
  <rect width="100" height="100" fill="#123047"/>
  <circle cx="50" cy="49" r="30" fill="#e6b083"/>
  <ellipse cx="50" cy="33" rx="40" ry="9" fill="#6b4a24"/>
  <path d="M30 33 C32 16 40 10 50 10 C60 10 68 16 70 33 Z" fill="#7a5730"/>
  <path d="M30 30 h40" stroke="#3a2416" stroke-width="3"/>
  <circle cx="41" cy="51" r="3.5" fill="#241407"/>
  <circle cx="59" cy="51" r="3.5" fill="#241407"/>
  <path d="M38 63 C44 59 56 59 62 63 C58 67 42 67 38 63 Z" fill="#3a2416"/>
  <path d="M50 79 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z" fill="#f2b632" stroke="#7a4f10" stroke-width="1"/>
</svg>`;

  window.SLOT_LANDSCAPE = `
<svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <linearGradient id="westernSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a1d20"/>
      <stop offset="42%" stop-color="#8a3a24"/>
      <stop offset="72%" stop-color="#d97a34"/>
      <stop offset="100%" stop-color="#f2b96a"/>
    </linearGradient>
    <radialGradient id="westernSun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff3c4"/>
      <stop offset="55%" stop-color="#ffd27a"/>
      <stop offset="100%" stop-color="#ff9a3c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#westernSky)"/>
  <circle cx="900" cy="205" r="150" fill="url(#westernSun)"/>
  <circle cx="900" cy="205" r="62" fill="#ffe9b0" opacity="0.95"/>
  <path d="M0 430 L110 340 L210 352 L300 300 L420 362 L520 322 L640 392 L760 330 L900 372 L1040 322 L1200 402 L1200 600 L0 600 Z" fill="#4a2a1a" opacity="0.92"/>
  <path d="M0 470 L160 420 L300 452 L460 410 L620 470 L800 430 L980 480 L1200 440 L1200 600 L0 600 Z" fill="#2a160c"/>
  <g fill="#1a0f07">
    <rect x="150" y="438" width="46" height="72"/>
    <path d="M144 438 h58 l-29 -20 z"/>
    <rect x="214" y="452" width="64" height="58"/>
    <path d="M208 452 h76 l-38 -22 z"/>
    <rect x="300" y="444" width="38" height="66"/>
    <path d="M294 444 h50 l-25 -18 z"/>
    <rect x="1010" y="446" width="52" height="64"/>
    <path d="M1004 446 h64 l-32 -20 z"/>
    <rect x="1078" y="456" width="70" height="54"/>
    <path d="M1072 456 h82 l-41 -24 z"/>
  </g>
  <g fill="#1a0f07">
    <rect x="120" y="500" width="10" height="46"/>
    <rect x="108" y="514" width="34" height="8" rx="4"/>
    <rect x="112" y="526" width="26" height="7" rx="3"/>
    <rect x="968" y="500" width="12" height="50"/>
    <rect x="952" y="516" width="24" height="10" rx="5"/>
    <rect x="972" y="530" width="24" height="10" rx="5"/>
  </g>
  <rect y="510" width="1200" height="90" fill="#2a160c"/>
  <path d="M0 520 C200 510 380 530 600 520 C820 510 1000 532 1200 518 L1200 600 L0 600 Z" fill="#3a2010"/>
</svg>`;

  window.SLOT_ART = SLOT_ART;
})();
