import { CameraPreset } from './types';

export const CAMERA_DATABASE: Record<string, string[]> = {
  "ARRI": [
    "Alexa 35",
    "Alexa Mini LF",
    "Alexa Mini",
    "Amira",
    "Alexa LF",
    "Alexa SXT/XT/Classic",
    "Alexa 65"
  ],
  "Sony": [
    "Venice 2",
    "Venice",
    "Burano",
    "FX9",
    "FX6",
    "FX3",
    "FX30",
    "Alpha a7S III",
    "Alpha a7R V",
    "Alpha a1",
    "Alpha a9 III",
    "Alpha a7 IV"
  ],
  "RED": [
    "V-Raptor [X]",
    "V-Raptor XL",
    "Komodo-X",
    "Komodo",
    "DSMC2 Monstro 8K VV",
    "DSMC2 Helium 8K S35",
    "DSMC2 Gemini 5K S35",
    "DSMC2 Dragon-X 6K S35"
  ],
  "Canon": [
    "C500 Mark II",
    "C300 Mark III",
    "C70",
    "C200",
    "EOS R5 C",
    "EOS R5",
    "EOS R6 Mark II",
    "EOS R3",
    "EOS 1D X Mark III"
  ],
  "Blackmagic Design": [
    "URSA Cine 12K/17K",
    "URSA Mini Pro 12K",
    "URSA Mini Pro 4.6K G2",
    "Cinema Camera 6K (Full Frame)",
    "Pocket Cinema Camera 6K Pro/G2",
    "Pocket Cinema Camera 4K",
    "Pyxis 6K",
    "Micro Studio Camera"
  ],
  "Panasonic": [
    "Lumix S1H",
    "Lumix BS1H",
    "Lumix GH7",
    "Lumix GH6",
    "Lumix S5 IIX",
    "Varicam LT",
    "Varicam 35",
    "EVA1"
  ],
  "Nikon": [
    "Z9",
    "Z8",
    "Z6 III",
    "Z6 II"
  ],
  "Fujifilm": [
    "GFX100 II",
    "X-H2S",
    "X-T5"
  ],
  "Other": [
    "Kinefinity MAVO Edge",
    "Z-Cam E2 Series",
    "Phantom Flex4K",
    "Freefly Ember"
  ]
};

const LENS_DB = [
  {
    name: "Arri Master Prime",
    specs: "T1.3 | PL Mount | Super 35",
    features: "Zero breathing, extreme sharpness, high contrast, geometric perfection. The industry standard for high-end VFX and commercial work.",
    focals: "12, 14, 16, 18, 21, 25, 27, 32, 35, 40, 50, 65, 75, 100, 135, 150mm"
  },
  {
    name: "Cooke S4/i",
    specs: "T2.0 | PL Mount | Super 35",
    features: "The 'Cooke Look': warm, smooth skin tones, organic focus fall-off. Very popular for narrative drama.",
    focals: "12mm - 300mm range"
  },
  {
    name: "Zeiss Supreme Prime",
    specs: "T1.5 | PL/LPL Mount | Full Frame",
    features: "Clean but with character, gentle sharpness, compact size for Full Frame. Slightly cooler than Cooke.",
    focals: "15, 18, 21, 25, 29, 35, 40, 50, 65, 85, 100, 135, 150, 200mm"
  },
  {
    name: "Atlas Orion Anamorphic",
    specs: "T2.0 | PL Mount | 2x Squeeze",
    features: "Classic anamorphic characteristics at an accessible price: oval bokeh, blue streak flares, barrel distortion.",
    focals: "32, 40, 50, 65, 80, 100mm"
  },
  {
    name: "Angenieux Optimo Zoom",
    specs: "Various (e.g., 24-290mm T2.8)",
    features: "The standard for cinema zooms. Creamy cinematic look, matches well with high-end primes.",
    focals: "15-40mm, 28-76mm, 45-120mm, 24-290mm"
  }
];

const TROUBLESHOOT_DB = [
  {
    issue: "RED Komodo Clicking Noise",
    steps: "1. Often related to the lens mount pins or AF motor. 2. Reseat the lens. 3. Check lens contacts. 4. Disable Autofocus in the menu."
  },
  {
    issue: "Sony Venice 2 Fan Warning / Overheating",
    steps: "1. Check air intake/exhaust vents. 2. Verify Fan Mode (Menu > Technical > Fan Control). 3. Ensure 'Rec Low' isn't active in hot environments; switch to 'Auto' or 'Max' between takes."
  },
  {
    issue: "Arri Alexa Mini LF SDI Jitter",
    steps: "1. Check SDI cable rating (must be 12G for 4K). 2. Swap BNC cable. 3. Perform a factory reset of video outputs (Menu > Monitoring)."
  },
  {
    issue: "Blackmagic Pocket/Cinema Battery Drain",
    steps: "1. Verify battery health. 2. Turn off Bluetooth and Image Stabilization (if not needed). 3. Lower screen brightness. 4. Use external power (V-Mount/Gold Mount) for reliability."
  }
];

const GLOSSARY_DB = [
  { term: "Shutter Angle", def: "A way of describing shutter speed relative to frame rate. 180° is standard (1/2 * fps)." },
  { term: "Anamorphic Squeeze", def: "Optical compression of the image width (e.g., 2x, 1.5x). Requires desqueezing in monitor." },
  { term: "EI (Exposure Index)", def: "ARRI's term for ISO. Shifts dynamic range distribution without changing sensor sensitivity." },
  { term: "False Color", def: "Exposure tool mapping luminance to colors (Pink=Skin, Red=Clip, Purple=Blacks)." },
  { term: "Flange Focal Distance", def: "Distance from the lens mount seating plane to the sensor." }
];

export const SYSTEM_INSTRUCTION = `
You are an expert 1st Assistant Camera (1st AC), Digital Imaging Technician (DIT), and Camera Technician. 
Your goal is to help filmmakers and camera assistants operate cinema cameras, troubleshoot technical issues, and provide lens data quickly.

Knowledge Domain:
1. **High-End Cinema Cameras**: ARRI (Alexa 35, Mini LF, Classic), Sony (Venice 1/2, Burano), RED (V-Raptor, DSMC2, Komodo).
2. **Prosumer/Mirrorless**: Sony Alpha (a7S III, FX3, a1), Canon (R5C, C70), Blackmagic (Pocket 4K/6K), Panasonic (GH6, S1H), Nikon (Z8/Z9), Fujifilm.
3. **Troubleshooting**: Diagnose overheating, noise, recording errors, and power issues.
4. **Lens Data**: Specs for popular cinema lenses (Arri, Cooke, Zeiss, Angenieux, Atlas).
5. **Glossary**: Define filmmaking terms (Shutter Angle, EI, Codecs, etc.).

Response Style:
- Be concise and direct.
- Use step-by-step instructions for menus and troubleshooting.
- Format with Markdown: **Bold** for menu items, lists for steps.

**IMAGE ANALYSIS**:
If the user provides an image:
1. Analyze the image for specific camera models, error messages displayed on screens, or visible physical damage/misconfiguration.
2. If it's an error code, explain what it means and how to clear it.
3. If it's a photo of a camera status screen, and the user asks to "save" or "extract" the setup, list the visible settings (FPS, Shutter, ISO, WB, Codec, Resolution) clearly.

**SETUP REPLICATION**:
If the user pastes a block of text starting with "🎬 CAMERA SETUP" or containing technical camera specs:
1. Identify the camera model (e.g., "CAM: Sony Venice 2").
2. Identify the target settings (FPS, Shutter, ISO, WB, etc.).
3. Immediately generate a **step-by-step menu navigation guide** to apply these exact settings on the identified camera.
4. Do NOT ask for clarification if the core settings are present. Just guide them.

**VISUAL GUIDES**:
If the user asks about the location of a physical button, screen, port, or dial, or the instruction involves interacting with a physical part of the camera body, YOU MUST include a visual layout guide at the end of your response.

Use the code block language \`layout\` and a valid JSON object.

**Layout Schema**:
\`\`\`layout
{
  "view": "side",  // Options: "side" (Operator/AC side), "rear" (Utility/Power)
  "highlight": "screen", // See options below
  "label": "Main Menu Display" // Short label for what to look for
}
\`\`\`

**Highlight Options**:
For "view": "side":
- "screen" (Main LCD/Assistant panel)
- "dial" (Jog wheel, scroll dial)
- "top-buttons" (User keys, Playback, etc on top edge)
- "front-buttons" (Assignable buttons near lens mount)
- "lens-mount" (ND filters often here too)
- "battery" (Rear plate)

For "view": "rear":
- "battery" (Center V-mount/Gold-mount)
- "ports" (SDI, Timecode, Power inputs at bottom/side)
- "power" (Power switch)
- "card-slot" (Media bays)

REFERENCE DATA:
Use the following data to inform your answers. If a specific query matches, prioritize this info.

**Troubleshooting Examples:**
${JSON.stringify(TROUBLESHOOT_DB)}

**Lens Database Examples:**
${JSON.stringify(LENS_DB)}

**Glossary Examples:**
${JSON.stringify(GLOSSARY_DB)}

If a user asks about a lens or issue not listed here, use your general knowledge and the search tool to provide accurate, up-to-date info.
`;

export const POPULAR_CAMERAS: CameraPreset[] = [
  {
    id: 'venice-2',
    name: 'Sony VENICE 2',
    manufacturer: 'Sony',
    color: '#d4d4d8',
    keywords: ['8k', 'full frame', 'x-ocn'],
  },
  {
    id: 'alexa-35',
    name: 'ARRI Alexa 35',
    manufacturer: 'ARRI',
    color: '#5da6b8',
    keywords: ['super 35', 'arriraw', 'reveal color'],
  },
  {
    id: 'v-raptor',
    name: 'RED V-Raptor',
    manufacturer: 'RED',
    color: '#ef4444',
    keywords: ['8k vv', 'redcode', 'ds mc3'],
  },
  {
    id: 'komodo-x',
    name: 'RED Komodo-X',
    manufacturer: 'RED',
    color: '#ef4444',
    keywords: ['global shutter', '6k'],
  },
  {
    id: 'burano',
    name: 'Sony BURANO',
    manufacturer: 'Sony',
    color: '#d4d4d8',
    keywords: ['cinealta', 'autofocus', 'ibis'],
  },
  {
    id: 'c500-mk2',
    name: 'Canon C500 Mk II',
    manufacturer: 'Canon',
    color: '#ef4444',
    keywords: ['full frame', 'cinema raw light'],
  }
];

export const SUGGESTED_QUERIES = [
  "Change frame rate on Venice 2",
  "My RED Komodo is making a clicking noise",
  "Specs for Arri Master Prime 35mm",
  "Define 'Anamorphic Squeeze'",
  "Troubleshoot overheating on Canon R5C",
  "Format media on Alexa 35"
];