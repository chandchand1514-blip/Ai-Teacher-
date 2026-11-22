import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Palette,
  Eraser,
  RotateCcw,
  Download,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  Check,
  Info,
  Wand2,
  Play,
  PaintBucket,
  PenTool,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  Maximize2,
  Minimize2,
  ArrowDown,
  ArrowUp,
  ZoomIn,
  ZoomOut,
  Eye,
  LayoutGrid,
  Paintbrush,
  RefreshCw
} from 'lucide-react';
import {
  COLORING_SHEETS
} from '../data/coloringSheets';
import { PaintingMenuModal } from './PaintingMenuModal';
import { ColorPickerModal, COLOR_PALETTE } from './ColorPickerModal';

export interface ColoringPart {
  id: string;
  name: string;
  d: string; // SVG path data
  defaultFill?: string;
  recommendedColor: string;
  recommendedName: string;
  avoidColors: string;
  hint: string;
}

export interface ColoringSheet {
  id: string;
  name: string;
  emoji: string;
  category: string;
  parts: ColoringPart[];
}

const BRUSH_SIZES = [
  { label: 'Fine', size: 4 },
  { label: 'Medium', size: 9 },
  { label: 'Thick', size: 18 },
  { label: 'Jumbo', size: 30 }
];

const AI_DEMO_RECIPES: Record<string, { steps: { label: string; color: string; width: number; points: { x: number; y: number }[] }[] }> = {
  cat: {
    steps: [
      {
        label: 'Step 1: Head & Ears 🐱',
        color: '#fde047',
        width: 8,
        points: [
          { x: 160, y: 160 }, { x: 180, y: 120 }, { x: 200, y: 140 }, { x: 220, y: 120 }, { x: 240, y: 160 },
          { x: 260, y: 200 }, { x: 240, y: 240 }, { x: 160, y: 240 }, { x: 140, y: 200 }, { x: 160, y: 160 }
        ]
      },
      {
        label: 'Step 2: Body & Tail 🐾',
        color: '#fb923c',
        width: 8,
        points: [
          { x: 170, y: 240 }, { x: 150, y: 330 }, { x: 250, y: 330 }, { x: 230, y: 240 },
          { x: 250, y: 300 }, { x: 290, y: 310 }, { x: 310, y: 280 }
        ]
      }
    ]
  },
  flower: {
    steps: [
      {
        label: 'Step 1: Stem & Leaves 🌿',
        color: '#22c55e',
        width: 8,
        points: [
          { x: 200, y: 200 }, { x: 200, y: 350 },
          { x: 200, y: 270 }, { x: 140, y: 240 }, { x: 200, y: 270 }, { x: 260, y: 240 }
        ]
      },
      {
        label: 'Step 2: Petals & Center 🌸',
        color: '#f472b6',
        width: 8,
        points: [
          { x: 200, y: 150 }, { x: 150, y: 120 }, { x: 170, y: 80 }, { x: 200, y: 110 },
          { x: 230, y: 80 }, { x: 250, y: 120 }, { x: 200, y: 150 }, { x: 200, y: 130 }
        ]
      }
    ]
  },
  sun: {
    steps: [
      {
        label: 'Step 1: Sun Face ☀️',
        color: '#fde047',
        width: 10,
        points: [
          { x: 160, y: 200 }, { x: 170, y: 160 }, { x: 200, y: 150 }, { x: 230, y: 160 },
          { x: 240, y: 200 }, { x: 230, y: 240 }, { x: 200, y: 250 }, { x: 170, y: 240 }, { x: 160, y: 200 }
        ]
      },
      {
        label: 'Step 2: Rays ✨',
        color: '#fb923c',
        width: 6,
        points: [
          { x: 200, y: 120 }, { x: 200, y: 90 },
          { x: 260, y: 140 }, { x: 290, y: 120 },
          { x: 270, y: 200 }, { x: 310, y: 200 },
          { x: 130, y: 200 }, { x: 90, y: 200 }
        ]
      }
    ]
  },
  house: {
    steps: [
      {
        label: 'Step 1: Walls & Roof 🏠',
        color: '#ef4444',
        width: 8,
        points: [
          { x: 150, y: 220 }, { x: 200, y: 150 }, { x: 250, y: 220 },
          { x: 160, y: 220 }, { x: 160, y: 340 }, { x: 240, y: 340 }, { x: 240, y: 220 }
        ]
      },
      {
        label: 'Step 2: Door & Window 🚪',
        color: '#38bdf8',
        width: 6,
        points: [
          { x: 185, y: 340 }, { x: 185, y: 280 }, { x: 215, y: 280 }, { x: 215, y: 340 },
          { x: 180, y: 240 }, { x: 200, y: 240 }, { x: 200, y: 260 }, { x: 180, y: 260 }
        ]
      }
    ]
  },
  star: {
    steps: [
      {
        label: 'Step 1: Twinkling Star ⭐',
        color: '#fde047',
        width: 8,
        points: [
          { x: 200, y: 120 }, { x: 215, y: 175 }, { x: 270, y: 175 }, { x: 225, y: 205 },
          { x: 240, y: 260 }, { x: 200, y: 230 }, { x: 160, y: 260 }, { x: 175, y: 205 },
          { x: 130, y: 175 }, { x: 185, y: 175 }, { x: 200, y: 120 }
        ]
      }
    ]
  },
  ball: {
    steps: [
      {
        label: 'Step 1: Round Ball ⚽',
        color: '#38bdf8',
        width: 8,
        points: [
          { x: 200, y: 130 }, { x: 245, y: 145 }, { x: 275, y: 180 }, { x: 285, y: 225 },
          { x: 270, y: 270 }, { x: 235, y: 295 }, { x: 190, y: 300 }, { x: 145, y: 280 },
          { x: 120, y: 240 }, { x: 120, y: 190 }, { x: 145, y: 150 }, { x: 200, y: 130 }
        ]
      },
      {
        label: 'Step 2: Football Seams ⚽',
        color: '#facc15',
        width: 6,
        points: [
          { x: 200, y: 190 }, { x: 225, y: 210 }, { x: 215, y: 235 }, { x: 185, y: 235 },
          { x: 175, y: 210 }, { x: 200, y: 190 }, { x: 200, y: 130 }, { x: 200, y: 190 },
          { x: 275, y: 180 }, { x: 225, y: 210 }, { x: 270, y: 270 }, { x: 215, y: 235 },
          { x: 190, y: 300 }, { x: 185, y: 235 }, { x: 120, y: 240 }, { x: 175, y: 210 },
          { x: 145, y: 150 }
        ]
      }
    ]
  },
  car: {
    steps: [
      {
        label: 'Step 1: Car Body & Roof 🚗',
        color: '#ef4444',
        width: 8,
        points: [
          { x: 120, y: 240 }, { x: 150, y: 200 }, { x: 230, y: 200 }, { x: 270, y: 240 },
          { x: 300, y: 240 }, { x: 300, y: 270 }, { x: 275, y: 270 }, { x: 250, y: 270 },
          { x: 220, y: 270 }, { x: 170, y: 270 }, { x: 140, y: 270 }, { x: 110, y: 270 },
          { x: 110, y: 240 }, { x: 120, y: 240 }
        ]
      },
      {
        label: 'Step 2: Wheels & Windows 🚙',
        color: '#38bdf8',
        width: 7,
        points: [
          { x: 145, y: 270 }, { x: 160, y: 290 }, { x: 145, y: 305 }, { x: 130, y: 290 }, { x: 145, y: 270 },
          { x: 245, y: 270 }, { x: 260, y: 290 }, { x: 245, y: 305 }, { x: 230, y: 290 }, { x: 245, y: 270 },
          { x: 160, y: 210 }, { x: 200, y: 210 }, { x: 200, y: 235 }, { x: 155, y: 235 }, { x: 160, y: 210 }
        ]
      }
    ]
  },
  fish: {
    steps: [
      {
        label: 'Step 1: Fish Body & Tail 🐟',
        color: '#f97316',
        width: 8,
        points: [
          { x: 130, y: 220 }, { x: 180, y: 160 }, { x: 250, y: 190 }, { x: 290, y: 160 },
          { x: 280, y: 220 }, { x: 290, y: 280 }, { x: 250, y: 250 }, { x: 180, y: 280 },
          { x: 130, y: 220 }
        ]
      },
      {
        label: 'Step 2: Eye & Fins ✨',
        color: '#38bdf8',
        width: 6,
        points: [
          { x: 160, y: 210 }, { x: 165, y: 210 },
          { x: 190, y: 170 }, { x: 215, y: 145 }, { x: 230, y: 180 }
        ]
      }
    ]
  },
  apple: {
    steps: [
      {
        label: 'Step 1: Sweet Apple 🍎',
        color: '#ef4444',
        width: 8,
        points: [
          { x: 200, y: 160 }, { x: 235, y: 145 }, { x: 265, y: 175 }, { x: 265, y: 235 },
          { x: 235, y: 285 }, { x: 200, y: 275 }, { x: 165, y: 285 }, { x: 135, y: 235 },
          { x: 135, y: 175 }, { x: 165, y: 145 }, { x: 200, y: 160 }
        ]
      },
      {
        label: 'Step 2: Stem & Leaf 🌿',
        color: '#22c55e',
        width: 6,
        points: [
          { x: 200, y: 160 }, { x: 200, y: 125 },
          { x: 200, y: 140 }, { x: 225, y: 125 }, { x: 235, y: 140 }, { x: 200, y: 140 }
        ]
      }
    ]
  },
  tree: {
    steps: [
      {
        label: 'Step 1: Tree Trunk 🌳',
        color: '#a16207',
        width: 8,
        points: [
          { x: 185, y: 220 }, { x: 185, y: 320 }, { x: 215, y: 320 }, { x: 215, y: 220 }
        ]
      },
      {
        label: 'Step 2: Green Leaves 🍃',
        color: '#22c55e',
        width: 8,
        points: [
          { x: 170, y: 230 }, { x: 130, y: 200 }, { x: 130, y: 155 }, { x: 165, y: 125 },
          { x: 200, y: 110 }, { x: 235, y: 125 }, { x: 270, y: 155 }, { x: 270, y: 200 },
          { x: 230, y: 230 }, { x: 170, y: 230 }
        ]
      }
    ]
  },
  butterfly: {
    steps: [
      {
        label: 'Step 1: Butterfly Body & Antennae 🦋',
        color: '#38bdf8',
        width: 7,
        points: [
          { x: 200, y: 170 }, { x: 200, y: 270 },
          { x: 200, y: 170 }, { x: 185, y: 145 },
          { x: 200, y: 170 }, { x: 215, y: 145 }
        ]
      },
      {
        label: 'Step 2: Colorful Wings ✨',
        color: '#f472b6',
        width: 8,
        points: [
          { x: 200, y: 190 }, { x: 140, y: 150 }, { x: 130, y: 200 }, { x: 200, y: 220 },
          { x: 200, y: 190 }, { x: 260, y: 150 }, { x: 270, y: 200 }, { x: 200, y: 220 },
          { x: 200, y: 230 }, { x: 150, y: 260 }, { x: 170, y: 280 }, { x: 200, y: 250 },
          { x: 200, y: 230 }, { x: 250, y: 260 }, { x: 230, y: 280 }, { x: 200, y: 250 }
        ]
      }
    ]
  },
  mango: {
    steps: [
      {
        label: 'Step 1: Sweet Golden Mango 🥭',
        color: '#facc15',
        width: 8,
        points: [
          { x: 200, y: 150 }, { x: 240, y: 165 }, { x: 260, y: 215 }, { x: 245, y: 270 },
          { x: 210, y: 295 }, { x: 175, y: 290 }, { x: 150, y: 250 }, { x: 155, y: 195 },
          { x: 180, y: 155 }, { x: 200, y: 150 }
        ]
      },
      {
        label: 'Step 2: Stem & Green Leaf 🍃',
        color: '#22c55e',
        width: 6,
        points: [
          { x: 200, y: 150 }, { x: 200, y: 120 },
          { x: 200, y: 135 }, { x: 230, y: 125 }, { x: 240, y: 140 }, { x: 200, y: 135 }
        ]
      }
    ]
  },
  icecream: {
    steps: [
      {
        label: 'Step 1: Crispy Waffle Cone 🍦',
        color: '#d97706',
        width: 8,
        points: [
          { x: 160, y: 200 }, { x: 240, y: 200 }, { x: 200, y: 310 }, { x: 160, y: 200 }
        ]
      },
      {
        label: 'Step 2: Yummy Ice Cream Scoop 🍒',
        color: '#f43f5e',
        width: 8,
        points: [
          { x: 160, y: 200 }, { x: 150, y: 165 }, { x: 175, y: 130 }, { x: 200, y: 125 },
          { x: 225, y: 130 }, { x: 250, y: 165 }, { x: 240, y: 200 },
          { x: 200, y: 125 }, { x: 200, y: 100 }
        ]
      }
    ]
  },
  dog: {
    steps: [
      {
        label: 'Step 1: Puppy Face & Floppy Ears 🐶',
        color: '#fde047',
        width: 8,
        points: [
          { x: 170, y: 170 }, { x: 150, y: 140 }, { x: 135, y: 175 }, { x: 155, y: 210 },
          { x: 170, y: 240 }, { x: 230, y: 240 }, { x: 245, y: 210 }, { x: 265, y: 175 },
          { x: 250, y: 140 }, { x: 230, y: 170 }, { x: 200, y: 165 }, { x: 170, y: 170 }
        ]
      },
      {
        label: 'Step 2: Eyes, Nose & Cute Smile 🐾',
        color: '#38bdf8',
        width: 6,
        points: [
          { x: 180, y: 195 }, { x: 185, y: 195 },
          { x: 215, y: 195 }, { x: 220, y: 195 },
          { x: 200, y: 215 }, { x: 190, y: 230 }, { x: 200, y: 225 }, { x: 210, y: 230 }
        ]
      }
    ]
  },
  duck: {
    steps: [
      {
        label: 'Step 1: Duck Body & Swimming Water 🦆',
        color: '#facc15',
        width: 8,
        points: [
          { x: 180, y: 200 }, { x: 160, y: 220 }, { x: 140, y: 240 }, { x: 150, y: 270 },
          { x: 240, y: 270 }, { x: 260, y: 240 }, { x: 240, y: 220 }, { x: 200, y: 220 },
          { x: 130, y: 285 }, { x: 270, y: 285 }
        ]
      },
      {
        label: 'Step 2: Round Head & Orange Beak 🌊',
        color: '#fb923c',
        width: 7,
        points: [
          { x: 190, y: 200 }, { x: 180, y: 165 }, { x: 200, y: 150 }, { x: 215, y: 165 },
          { x: 210, y: 200 },
          { x: 180, y: 165 }, { x: 155, y: 170 }, { x: 180, y: 175 }
        ]
      }
    ]
  },
  rabbit: {
    steps: [
      {
        label: 'Step 1: Long Bunny Ears 🐰',
        color: '#f472b6',
        width: 8,
        points: [
          { x: 180, y: 180 }, { x: 165, y: 110 }, { x: 180, y: 95 }, { x: 190, y: 175 },
          { x: 210, y: 175 }, { x: 220, y: 95 }, { x: 235, y: 110 }, { x: 220, y: 180 }
        ]
      },
      {
        label: 'Step 2: Round Face & Whiskers 🥕',
        color: '#f8fafc',
        width: 7,
        points: [
          { x: 170, y: 180 }, { x: 150, y: 210 }, { x: 170, y: 250 }, { x: 230, y: 250 },
          { x: 250, y: 210 }, { x: 230, y: 180 }, { x: 170, y: 180 },
          { x: 140, y: 215 }, { x: 170, y: 215 },
          { x: 230, y: 215 }, { x: 260, y: 215 }
        ]
      }
    ]
  },
  boat: {
    steps: [
      {
        label: 'Step 1: Boat Hull & Sea Waves ⛵',
        color: '#a16207',
        width: 8,
        points: [
          { x: 130, y: 250 }, { x: 270, y: 250 }, { x: 240, y: 290 }, { x: 160, y: 290 }, { x: 130, y: 250 },
          { x: 110, y: 310 }, { x: 290, y: 310 }
        ]
      },
      {
        label: 'Step 2: Tall Mast & Triangle Sail 🌊',
        color: '#ef4444',
        width: 7,
        points: [
          { x: 200, y: 250 }, { x: 200, y: 130 },
          { x: 200, y: 135 }, { x: 255, y: 210 }, { x: 200, y: 210 }
        ]
      }
    ]
  },
  rocket: {
    steps: [
      {
        label: 'Step 1: Rocket Body & Sharp Nose 🚀',
        color: '#38bdf8',
        width: 8,
        points: [
          { x: 200, y: 110 }, { x: 230, y: 160 }, { x: 230, y: 260 },
          { x: 170, y: 260 }, { x: 170, y: 160 }, { x: 200, y: 110 },
          { x: 190, y: 180 }, { x: 210, y: 180 }, { x: 210, y: 200 }, { x: 190, y: 200 }, { x: 190, y: 180 }
        ]
      },
      {
        label: 'Step 2: Fins & Blazing Flame 🔥',
        color: '#f97316',
        width: 8,
        points: [
          { x: 170, y: 240 }, { x: 140, y: 280 }, { x: 170, y: 260 },
          { x: 230, y: 240 }, { x: 260, y: 280 }, { x: 230, y: 260 },
          { x: 185, y: 265 }, { x: 200, y: 315 }, { x: 215, y: 265 }
        ]
      }
    ]
  },
  rainbow: {
    steps: [
      {
        label: 'Step 1: Colorful Rainbow Arches 🌈',
        color: '#ef4444',
        width: 8,
        points: [
          { x: 130, y: 260 }, { x: 160, y: 160 }, { x: 240, y: 160 }, { x: 270, y: 260 },
          { x: 140, y: 260 }, { x: 170, y: 180 }, { x: 230, y: 180 }, { x: 260, y: 260 },
          { x: 150, y: 260 }, { x: 180, y: 200 }, { x: 220, y: 200 }, { x: 250, y: 260 }
        ]
      },
      {
        label: 'Step 2: Fluffy Soft Clouds ☁️',
        color: '#38bdf8',
        width: 7,
        points: [
          { x: 120, y: 260 }, { x: 130, y: 240 }, { x: 150, y: 240 }, { x: 160, y: 260 }, { x: 120, y: 260 },
          { x: 240, y: 260 }, { x: 250, y: 240 }, { x: 270, y: 240 }, { x: 280, y: 260 }, { x: 240, y: 260 }
        ]
      }
    ]
  },
  cake: {
    steps: [
      {
        label: 'Step 1: Sweet Cake Tiers 🎂',
        color: '#f472b6',
        width: 8,
        points: [
          { x: 140, y: 280 }, { x: 260, y: 280 }, { x: 260, y: 230 }, { x: 140, y: 230 }, { x: 140, y: 280 },
          { x: 160, y: 230 }, { x: 240, y: 230 }, { x: 240, y: 180 }, { x: 160, y: 180 }, { x: 160, y: 230 }
        ]
      },
      {
        label: 'Step 2: Birthday Candles & Flame 🕯️',
        color: '#facc15',
        width: 6,
        points: [
          { x: 180, y: 180 }, { x: 180, y: 140 }, { x: 180, y: 130 },
          { x: 200, y: 180 }, { x: 200, y: 135 }, { x: 200, y: 125 },
          { x: 220, y: 180 }, { x: 220, y: 140 }, { x: 220, y: 130 }
        ]
      }
    ]
  }
};

// Flood fill algorithm for freehand canvas coloring (Paint Bucket)
function floodFillCanvas(
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillHex: string
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const targetX = Math.floor(startX * dpr);
  const targetY = Math.floor(startY * dpr);
  if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) return;

  const startIndex = (targetY * width + targetX) * 4;
  const startR = data[startIndex];
  const startG = data[startIndex + 1];
  const startB = data[startIndex + 2];
  const startA = data[startIndex + 3];

  let fillR = 255, fillG = 255, fillB = 255, fillA = 255;
  if (fillHex.startsWith('#')) {
    const hex = fillHex.slice(1);
    if (hex.length === 6) {
      fillR = parseInt(hex.slice(0, 2), 16);
      fillG = parseInt(hex.slice(2, 4), 16);
      fillB = parseInt(hex.slice(4, 6), 16);
    }
  }

  // Already same color
  if (
    Math.abs(startR - fillR) < 10 &&
    Math.abs(startG - fillG) < 10 &&
    Math.abs(startB - fillB) < 10 &&
    Math.abs(startA - fillA) < 10
  ) {
    return;
  }

  const colorMatch = (idx: number) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    return (
      Math.abs(r - startR) <= 32 &&
      Math.abs(g - startG) <= 32 &&
      Math.abs(b - startB) <= 32 &&
      Math.abs(a - startA) <= 32
    );
  };

  const queue: number[] = [targetX, targetY];
  const visited = new Uint8Array(width * height);
  visited[targetY * width + targetX] = 1;

  let head = 0;
  const maxPixels = width * height;
  let filledPixels = 0;

  while (head < queue.length && filledPixels < maxPixels) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = (y * width + x) * 4;

    data[idx] = fillR;
    data[idx + 1] = fillG;
    data[idx + 2] = fillB;
    data[idx + 3] = fillA;
    filledPixels++;

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (!visited[vIdx]) {
          visited[vIdx] = 1;
          const nDataIdx = vIdx * 4;
          if (colorMatch(nDataIdx)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

export function matchColoringSheet(topicQuery?: string, currentSheetId?: string): ColoringSheet {
  const q = (topicQuery || '').toLowerCase().trim();
  if (
    !q ||
    q.includes('kuch') ||
    q.includes('doosra') ||
    q.includes('dusra') ||
    q.includes('achha') ||
    q.includes('aur') ||
    q.includes('random') ||
    q.includes('surprise') ||
    q.includes('free drawing')
  ) {
    const others = COLORING_SHEETS.filter((s) => s.id !== currentSheetId);
    return others[Math.floor(Math.random() * others.length)] || COLORING_SHEETS[0];
  }

  // 1. Direct ID or Name search
  const direct = COLORING_SHEETS.find(
    (s) => s.id.toLowerCase() === q || s.name.toLowerCase().includes(q)
  );
  if (direct) return direct;

  // 2. Comprehensive synonyms for kids & Hindi / English speech
  const dict: [RegExp, string][] = [
    [/ball|gend|gaint|football|cricket|khelna|boll/, 'ball'],
    [/phool|flower|rose|gulab|kamal|pankhudi/, 'flower'],
    [/suraj|sun|dhoop|sunny/, 'sun'],
    [/billi|cat|kitten|mausi|billa/, 'cat'],
    [/ghar|house|home|jhopdi|hut|makan/, 'house'],
    [/car|gaadi|gadi|motor|vehicle/, 'car'],
    [/machli|fish|jalpari|mina/, 'fish'],
    [/ped|tree|vriksh|paudha|plant/, 'tree'],
    [/seb|apple/, 'apple'],
    [/titli|butterfly/, 'butterfly'],
    [/aam|mango|kairi/, 'mango'],
    [/ice\s*cream|kulfi|icecream/, 'icecream'],
    [/tara|star|sitara|taara/, 'star'],
    [/kutta|dog|puppy|doggy/, 'dog'],
    [/battakh|duck|batakh/, 'duck'],
    [/khargosh|rabbit|bunny/, 'rabbit'],
    [/haathi|elephant|hathi/, 'elephant'],
    [/sher|lion|king|singh/, 'lion'],
    [/tota|parrot|mitthu/, 'parrot'],
    [/kela|banana/, 'banana'],
    [/strawberry/, 'strawberry'],
    [/angoor|grapes/, 'grapes'],
    [/tarbooz|watermelon|tarbuj/, 'watermelon'],
    [/gajar|carrot/, 'carrot'],
    [/rocket|space|missile/, 'rocket'],
    [/naav|boat|sail|jahaj/, 'boat'],
    [/jahaz|airplane|aeroplane|viman|plane/, 'airplane'],
    [/train|railgadi|chook|chug/, 'train'],
    [/indradhanush|rainbow|badal|cloud/, 'rainbow'],
    [/chhatri|mushroom/, 'mushroom'],
    [/cake|birthday|cupcake/, 'cake'],
  ];

  for (const [re, targetId] of dict) {
    if (re.test(q)) {
      const found = COLORING_SHEETS.find((s) => s.id === targetId);
      if (found) return found;
    }
  }

  return COLORING_SHEETS.find((s) => s.id === currentSheetId) || COLORING_SHEETS[0];
}

interface DrawingStudioProps {
  topic: string;
  instructions?: string;
  onClose: () => void;
  onSendDrawingToJarvis: (
    base64Image: string,
    metadata?: { source?: string; mode?: string; topic?: string; sheetName?: string; progress?: string }
  ) => void;
  isLiveActive: boolean;
  status: 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'disconnected' | 'error';
  audioLevel: number;
  aiDemonstration?: { topic: string; color?: string; message?: string; timestamp: number } | null;
  onRequestJarvisDraw?: (topic: string) => void;
  initialMode?: 'colorFill' | 'freehand';
  initialSheetId?: string;
  aiColorGuideStep?: { partName: string; recommendedColor: string; colorsToAvoid?: string; interactiveQuestion?: string } | null;
  onRequestColorAdvice?: (sheetId: string, partName?: string) => void;
  onSheetCompleted?: (sheetId: string) => void;
  onSendTextMessage?: (text: string) => void;
  autoFillTrigger?: number;
  onRequestAutoFill?: () => void;
  isVoiceMuted?: boolean;
  onToggleVoiceMute?: (muted: boolean) => void;
}

export function DrawingStudio({
  topic,
  instructions,
  onClose,
  onSendDrawingToJarvis,
  isLiveActive,
  status,
  audioLevel,
  aiDemonstration,
  onRequestJarvisDraw,
  initialMode = 'freehand',
  initialSheetId = 'flower',
  aiColorGuideStep,
  onRequestColorAdvice,
  onSheetCompleted,
  onSendTextMessage,
  autoFillTrigger,
  onRequestAutoFill,
  isVoiceMuted,
  onToggleVoiceMute,
}: DrawingStudioProps) {
  // Mode switcher: 'colorFill' (Rang Bharne Ki Kitab) or 'freehand' (Khud Sketch Banao)
  const [studioMode, setStudioMode] = useState<'colorFill' | 'freehand'>(initialMode);
  const [isPaintingMenuOpen, setIsPaintingMenuOpen] = useState<boolean>(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    const lower = topic.toLowerCase();
    const found = COLORING_SHEETS.find(s => lower.includes(s.id) || lower.includes(s.name.toLowerCase()));
    return found ? found.id : (initialSheetId || 'flower');
  });

  // View and Scrolling preferences ("Pura dikhega, upar niche scroll hoga")
  const [viewSize, setViewSize] = useState<'large' | 'fit'>('large');
  const [isFullCanvas, setIsFullCanvas] = useState<boolean>(false);

  // Voice mute state for Drawing Studio
  const [isVoiceMutedLocal, setIsVoiceMutedLocal] = useState<boolean>(isVoiceMuted ?? false);

  useEffect(() => {
    if (isVoiceMuted !== undefined) {
      setIsVoiceMutedLocal(isVoiceMuted);
    }
  }, [isVoiceMuted]);

  // Keep ref for unmount cleanup so it NEVER runs during normal re-renders or state changes
  const onToggleVoiceMuteRef = useRef(onToggleVoiceMute);
  useEffect(() => {
    onToggleVoiceMuteRef.current = onToggleVoiceMute;
  }, [onToggleVoiceMute]);

  // When leaving the drawing page (unmount), ensure voice is unmuted automatically!
  useEffect(() => {
    return () => {
      onToggleVoiceMuteRef.current?.(false);
    };
  }, []);

  const isMuted = isVoiceMuted !== undefined ? isVoiceMuted : isVoiceMutedLocal;

  const toggleVoiceMute = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = !isMuted;
    setIsVoiceMutedLocal(next);
    onToggleVoiceMute?.(next);
  };

  // Sync mode and sheet when changed externally from Jarvis via voice tools
  useEffect(() => {
    if (initialMode) {
      setStudioMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialSheetId) {
      setActiveSheetId(initialSheetId);
    }
  }, [initialSheetId]);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [sheetFills, setSheetFills] = useState<Record<string, Record<string, string>>>({});
  const [color, setColor] = useState<string>('#fde047');
  const [brushSize, setBrushSize] = useState<number>(9);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [currentFreehandTopic, setCurrentFreehandTopic] = useState<string>(() => {
    const lower = topic.toLowerCase();
    const found = COLORING_SHEETS.find(s => lower.includes(s.id) || lower.includes(s.name.toLowerCase()));
    return found ? found.id : (initialSheetId || 'flower');
  });
  const [freehandTool, setFreehandTool] = useState<'pen' | 'bucket'>('pen');
  const [sheetCompletedCelebration, setSheetCompletedCelebration] = useState<boolean>(false);
  const [justFilledPartId, setJustFilledPartId] = useState<string | null>(null);

  // AI Demonstration Animation state
  const [isDemonstrating, setIsDemonstrating] = useState<boolean>(false);
  const [demoStepLabel, setDemoStepLabel] = useState<string>('');
  const [demoCursorPos, setDemoCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Automatic Drawing & Color Prompt states
  const [isDrawingAnimated, setIsDrawingAnimated] = useState<boolean>(false);
  const [showColorPrompt, setShowColorPrompt] = useState<boolean>(false);
  const [isAutoFilling, setIsAutoFilling] = useState<boolean>(false);
  const autoFillIntervalRef = useRef<any>(null);
  const isAutoFillingRef = useRef<boolean>(false);
  const lastHandledAutoFillTriggerRef = useRef<number>(0);

  // References
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const [hasDrawnFreehand, setHasDrawnFreehand] = useState<boolean>(false);

  // Active Coloring Sheet
  const currentSheet = COLORING_SHEETS.find(s => s.id === activeSheetId) || COLORING_SHEETS[0];
  const currentFills = sheetFills[currentSheet.id] || {};
  const currentStepPart = currentSheet.parts[activeStepIndex] || currentSheet.parts[0];
  const currentColorObj = COLOR_PALETTE.find(c => c.hex.toLowerCase() === color.toLowerCase());



  // Sync incoming AI guidance
  useEffect(() => {
    if (aiColorGuideStep) {
      const matchIndex = currentSheet.parts.findIndex(p =>
        p.id.toLowerCase().includes(aiColorGuideStep.partName.toLowerCase()) ||
        p.name.toLowerCase().includes(aiColorGuideStep.partName.toLowerCase())
      );
      if (matchIndex >= 0) {
        setActiveStepIndex(matchIndex);
      }
    }
  }, [aiColorGuideStep, currentSheet]);

  // When sheet changes, reset step to 0 and reset auto-fill state
  useEffect(() => {
    setActiveStepIndex(0);
    setSheetCompletedCelebration(false);
    if (autoFillIntervalRef.current) {
      clearInterval(autoFillIntervalRef.current);
      autoFillIntervalRef.current = null;
    }
    setIsAutoFilling(false);
  }, [activeSheetId]);

  useEffect(() => {
    return () => {
      if (autoFillIntervalRef.current) {
        clearInterval(autoFillIntervalRef.current);
        autoFillIntervalRef.current = null;
      }
    };
  }, []);

  // Count how many parts are filled
  const filledCount = currentSheet.parts.filter(p => Boolean(currentFills[p.id])).length;
  const isSheetFullyColored = filledCount === currentSheet.parts.length;

  // Auto-vision snapshot scheduler (sends debounced drawing frame so Jarvis can see and praise in real-time)
  const autoVisionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // User Requirement: AI Teacher CANNOT see inside the drawing page!
  const captureAndSendToJarvis = useCallback(() => {
    // Disabled: AI Teacher cannot see inside the drawing studio page canvas
  }, []);

  // Seamlessly transfer whatever is drawn/chosen in Khud Banao to Rang Bharo to color it
  const transferDrawingToColorFill = useCallback((overrideTopic?: string) => {
    const targetTopic = overrideTopic || currentFreehandTopic || activeSheetId || topic || 'flower';
    const matched = matchColoringSheet(targetTopic, activeSheetId);
    setActiveSheetId(matched.id);
    setCurrentFreehandTopic(matched.id);
    setStudioMode('colorFill');
    setIsFullCanvas(false);
    onSendTextMessage?.(`[STUDENT_ACTION]: Student opened Rang Bharo 🎨 to color "${matched.name}".`);
    setTimeout(() => {
      captureAndSendToJarvis();
    }, 500);
  }, [currentFreehandTopic, activeSheetId, topic, onSendTextMessage, captureAndSendToJarvis]);

  const triggerAutoVisionSend = useCallback(() => {
    if (autoVisionTimeoutRef.current) {
      clearTimeout(autoVisionTimeoutRef.current);
    }
    autoVisionTimeoutRef.current = setTimeout(() => {
      captureAndSendToJarvis();
    }, 5000);
  }, [captureAndSendToJarvis]);

  useEffect(() => {
    return () => {
      if (autoVisionTimeoutRef.current) {
        clearTimeout(autoVisionTimeoutRef.current);
        autoVisionTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle filling a section with selected color
  const handleFillPart = (partId: string, customFillColor?: string) => {
    const fillColorToApply = customFillColor || (isEraser ? '#ffffff' : color);

    setSheetFills(prev => {
      const existing = prev[currentSheet.id] || {};
      const updated = {
        ...existing,
        [partId]: fillColorToApply
      };

      // Check if all parts completed with this fill (only trigger celebration/snapshot if user manual fill, not during auto-fill routine)
      const allPartsFilled = currentSheet.parts.every(p => Boolean(updated[p.id] && updated[p.id] !== '#ffffff'));
      if (allPartsFilled && !isSheetFullyColored && !isAutoFillingRef.current) {
        setSheetCompletedCelebration(true);
        setTimeout(() => setSheetCompletedCelebration(false), 4500);
        if (onSheetCompleted) {
          onSheetCompleted(currentSheet.name);
        }
        // Send snapshot to Jarvis vision
        setTimeout(() => {
          captureAndSendToJarvis();
        }, 1200);
      }

      return {
        ...prev,
        [currentSheet.id]: updated
      };
    });

    setJustFilledPartId(partId);
    setTimeout(() => setJustFilledPartId(null), 600);

    // Schedule debounced snapshot so Jarvis can see the newly filled color in real-time
    triggerAutoVisionSend();

    // Auto-advance to next step if matching current step
    if (partId === currentStepPart.id && activeStepIndex < currentSheet.parts.length - 1) {
      setTimeout(() => {
        setActiveStepIndex(prev => Math.min(prev + 1, currentSheet.parts.length - 1));
      }, 350);
    }
  };

  // Auto-fill all parts with recommended colors automatically without looping or glitches
  const triggerAutoFillColors = useCallback(() => {
    if (isAutoFillingRef.current) return;
    const parts = currentSheet.parts;
    if (!parts || parts.length === 0) return;

    if (autoFillIntervalRef.current) {
      clearInterval(autoFillIntervalRef.current);
      autoFillIntervalRef.current = null;
    }

    isAutoFillingRef.current = true;
    setIsAutoFilling(true);
    setShowColorPrompt(false);

    let index = 0;
    autoFillIntervalRef.current = setInterval(() => {
      if (index < parts.length) {
        const part = parts[index];
        const recColor = part.recommendedColor || '#f59e0b';
        
        setSheetFills(prev => {
          const existing = prev[currentSheet.id] || {};
          return {
            ...prev,
            [currentSheet.id]: {
              ...existing,
              [part.id]: recColor
            }
          };
        });
        setJustFilledPartId(part.id);
        setActiveStepIndex(index);
        index++;
      } else {
        if (autoFillIntervalRef.current) {
          clearInterval(autoFillIntervalRef.current);
          autoFillIntervalRef.current = null;
        }
        isAutoFillingRef.current = false;
        setIsAutoFilling(false);
        setJustFilledPartId(null);
        setSheetCompletedCelebration(true);
        setTimeout(() => setSheetCompletedCelebration(false), 4500);
        
        if (onSheetCompleted) {
          onSheetCompleted(currentSheet.name);
        }
        setTimeout(() => {
          captureAndSendToJarvis();
        }, 1000);
      }
    }, 320);
  }, [currentSheet, onSheetCompleted, captureAndSendToJarvis]);

  // Clean trigger: only fires when autoFillTrigger timestamp is newer than last handled
  useEffect(() => {
    if (autoFillTrigger && autoFillTrigger > lastHandledAutoFillTriggerRef.current) {
      lastHandledAutoFillTriggerRef.current = autoFillTrigger;
      triggerAutoFillColors();
    }
  }, [autoFillTrigger, triggerAutoFillColors]);



  // Request Jarvis's voice advice on color choice
  const handleAskJarvisColor = () => {
    if (onRequestColorAdvice) {
      onRequestColorAdvice(currentSheet.name, currentStepPart.name);
    }
  };

  // Download artwork as image
  const handleDownload = () => {
    captureAndSendToJarvis();
    if (studioMode === 'colorFill' && svgContainerRef.current) {
      const svgEl = svgContainerRef.current.querySelector('svg');
      if (!svgEl) return;
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(svgBlob);
      a.download = `my-colored-${currentSheet.id}-${Date.now()}.svg`;
      a.click();
    } else if (canvasRef.current) {
      const a = document.createElement('a');
      a.href = canvasRef.current.toDataURL('image/png');
      a.download = `my-drawing-${Date.now()}.png`;
      a.click();
    }
  };

  // Reset colors on current sheet
  const handleResetSheet = () => {
    setSheetFills(prev => ({
      ...prev,
      [currentSheet.id]: {}
    }));
    setActiveStepIndex(0);
    setSheetCompletedCelebration(false);
  };

  // Setup freehand canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = '#0a161f';
          ctx.fillRect(0, 0, rect.width, rect.height);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (studioMode === 'freehand') {
      const timer = setTimeout(setupCanvas, 60);
      window.addEventListener('resize', setupCanvas);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', setupCanvas);
      };
    }
  }, [studioMode, setupCanvas, isFullCanvas, viewSize]);

  // Autonomous Demonstration Engine: Jarvis draws on canvas step-by-step
  const runAutonomousDemonstration = useCallback((topicName: string) => {
    const lower = topicName.toLowerCase().trim();
    let recipeKey = 'cat';
    if (lower.includes('ball') || lower.includes('gend') || lower.includes('football') || lower.includes('gaint') || lower.includes('boll')) recipeKey = 'ball';
    else if (lower.includes('flower') || lower.includes('phool') || lower.includes('gulab') || lower.includes('kamal')) recipeKey = 'flower';
    else if (lower.includes('sun') || lower.includes('suraj') || lower.includes('dhoop')) recipeKey = 'sun';
    else if (lower.includes('house') || lower.includes('ghar') || lower.includes('makan') || lower.includes('jhopdi')) recipeKey = 'house';
    else if (lower.includes('star') || lower.includes('taara') || lower.includes('tara') || lower.includes('sitara')) recipeKey = 'star';
    else if (lower.includes('car') || lower.includes('gaadi') || lower.includes('gadi') || lower.includes('motor')) recipeKey = 'car';
    else if (lower.includes('fish') || lower.includes('machhli') || lower.includes('machli') || lower.includes('jalpari')) recipeKey = 'fish';
    else if (lower.includes('apple') || lower.includes('seb')) recipeKey = 'apple';
    else if (lower.includes('tree') || lower.includes('ped') || lower.includes('vriksh') || lower.includes('paudha')) recipeKey = 'tree';
    else if (lower.includes('butterfly') || lower.includes('titli')) recipeKey = 'butterfly';
    else if (lower.includes('mango') || lower.includes('aam') || lower.includes('kairi')) recipeKey = 'mango';
    else if (lower.includes('icecream') || lower.includes('ice cream') || lower.includes('kulfi')) recipeKey = 'icecream';
    else if (lower.includes('dog') || lower.includes('kutta') || lower.includes('puppy') || lower.includes('doggy')) recipeKey = 'dog';
    else if (lower.includes('duck') || lower.includes('battakh') || lower.includes('batakh')) recipeKey = 'duck';
    else if (lower.includes('rabbit') || lower.includes('khargosh') || lower.includes('bunny')) recipeKey = 'rabbit';
    else if (lower.includes('boat') || lower.includes('naav') || lower.includes('jahaj')) recipeKey = 'boat';
    else if (lower.includes('rocket') || lower.includes('missile')) recipeKey = 'rocket';
    else if (lower.includes('rainbow') || lower.includes('indradhanush')) recipeKey = 'rainbow';
    else if (lower.includes('cake') || lower.includes('birthday') || lower.includes('cupcake')) recipeKey = 'cake';
    else if (lower.includes('cat') || lower.includes('billi') || lower.includes('kitten') || lower.includes('billa')) recipeKey = 'cat';

    const recipe = AI_DEMO_RECIPES[recipeKey] || AI_DEMO_RECIPES.cat;

    // Cancel any previous running animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Switch to freehand mode so user can see AI draw
    setStudioMode('freehand');
    setIsDemonstrating(true);
    setHasDrawnFreehand(true);

    const executeDemo = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setTimeout(executeDemo, 80);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width > 0 ? rect.width : 400;
      const cssH = rect.height > 0 ? rect.height : 460;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear background
      ctx.fillStyle = '#0a161f';
      ctx.fillRect(0, 0, cssW, cssH);

      const scale = Math.min(cssW / 400, cssH / 400) * 0.90;
      const offsetX = (cssW - 400 * scale) / 2;
      const offsetY = (cssH - 400 * scale) / 2;

      let stepIndex = 0;
      let pointIndex = 0;

      const animateStroke = () => {
        if (stepIndex >= recipe.steps.length) {
          setIsDemonstrating(false);
          const finishedName = recipe.steps[0].label.replace(/Step \d+:\s*/, '').trim();
          setDemoStepLabel(`🎉 Shabaash! Jarvis ne ${finishedName} draw kar di! ⭐`);
          setDemoCursorPos(null);
          setTimeout(() => setDemoStepLabel(''), 6000);
          setTimeout(() => captureAndSendToJarvis(), 1200);
          return;
        }

        const currentStep = recipe.steps[stepIndex];
        setDemoStepLabel(currentStep.label);

        if (pointIndex < currentStep.points.length) {
          const pt = currentStep.points[pointIndex];
          const mappedX = pt.x * scale + offsetX;
          const mappedY = pt.y * scale + offsetY;
          setDemoCursorPos({ x: mappedX, y: mappedY });

          ctx.strokeStyle = currentStep.color;
          ctx.lineWidth = Math.max(3, currentStep.width * scale);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = currentStep.color;
          ctx.shadowBlur = 8;

          if (pointIndex === 0) {
            ctx.beginPath();
            ctx.moveTo(mappedX, mappedY);
          } else {
            ctx.lineTo(mappedX, mappedY);
            ctx.stroke();
          }

          pointIndex++;
          animationFrameRef.current = requestAnimationFrame(() => {
            setTimeout(animateStroke, 35);
          });
        } else {
          stepIndex++;
          pointIndex = 0;
          animationFrameRef.current = requestAnimationFrame(() => {
            setTimeout(animateStroke, 240);
          });
        }
      };

      animateStroke();
    };

    setTimeout(executeDemo, 120);
  }, [captureAndSendToJarvis]);

  // Listen for AI demonstration prop
  useEffect(() => {
    if (aiDemonstration) {
      const matched = matchColoringSheet(aiDemonstration.topic);
      if (matched && matched.id) {
        setActiveSheetId(matched.id);
      }
      runAutonomousDemonstration(aiDemonstration.topic);
    }
  }, [aiDemonstration, runAutonomousDemonstration]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Freehand pointer events
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDemonstrating) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (freehandTool === 'bucket') {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      floodFillCanvas(canvas, x, y, isEraser ? '#0a161f' : color);
      setHasDrawnFreehand(true);
      triggerAutoVisionSend();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isEraser) {
      ctx.strokeStyle = '#0a161f';
      ctx.lineWidth = brushSize * 2.2;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    isDrawingRef.current = true;
    setHasDrawnFreehand(true);

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || isDemonstrating || freehandTool === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    // Automatically schedule vision frame to Jarvis so she sees what child drew and praises
    triggerAutoVisionSend();
  };

  // Smooth scroll helpers to let users scroll up and down easily
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDrawing = () => {
    if (svgContainerRef.current) {
      svgContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollContainerRef.current?.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040810] flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
      {/* Top Navbar (Sticky & Clean) - Compact */}
      <header className="w-full bg-[#07131e]/95 border-b border-cyan-500/30 px-2 py-1.5 flex items-center justify-between z-40 shadow-lg backdrop-blur-md shrink-0">
        {/* Mode Switcher Toggle: Color Fill vs Freehand - Compact */}
        <div className="flex items-center bg-[#050d18] p-0.5 rounded-xl border border-cyan-500/30">
          <button
            type="button"
            onClick={() => {
              if (studioMode === 'freehand' && currentFreehandTopic) {
                transferDrawingToColorFill();
              } else {
                setStudioMode('colorFill');
                setIsFullCanvas(false);
                onSendTextMessage?.('[STUDENT_ACTION]: Student opened Rang Bharo 🎨 (Color Fill Book page).');
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
              studioMode === 'colorFill'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PaintBucket className="w-3 h-3" />
            <span>Color Fill 🎨</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStudioMode('freehand');
              onSendTextMessage?.('[STUDENT_ACTION]: Student opened Khud Banao ✏️ (Freehand Drawing page).');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
              studioMode === 'freehand'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Freehand Draw ✏️</span>
          </button>
        </div>

        {/* Right Header Controls: AI Voice Mute/Unmute Toggle + Close Button */}
        <div className="flex items-center gap-1.5">
          {/* AI Voice Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={toggleVoiceMute}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer active:scale-95 border touch-manipulation select-none ${
              isMuted
                ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/70 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
            }`}
            title={
              isMuted
                ? 'AI की आवाज बंद है (क्लिक करके चालू करें)'
                : 'AI की आवाज चालू है (क्लिक करके बंद करें)'
            }
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xs:inline">Voice: Off</span>
                <span className="xs:hidden">Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">Voice: On</span>
                <span className="xs:hidden">On</span>
              </>
            )}
          </button>

          {/* Close Button - Compact */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800/80 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title="Close Drawing Studio"
          >
            <X className="w-3.5 h-3.5 text-slate-300 hover:text-rose-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 w-full overflow-y-auto overscroll-contain bg-[#0a161f] px-2 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center pb-6 sm:pb-8"
      >
        {/* Color Fill Mode */}
        {studioMode === 'colorFill' ? (
          <div className="w-full max-w-xl flex flex-col items-center justify-center gap-2">
            {/* Interactive SVG Coloring Page */}
            <div
              ref={svgContainerRef}
              className="relative w-full flex flex-col items-center justify-center p-3 rounded-3xl bg-[#091522] border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >
              {/* Top Controls on Board: Color Picker + Reset */}
              <div className="w-full flex items-center justify-between gap-1.5 mb-2.5 z-20">
                {/* Single Color Picker Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEraser(false);
                    setIsColorPickerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#0d2338] to-[#071626] hover:from-[#122e49] hover:to-[#0a1e32] border border-cyan-400/60 hover:border-cyan-300 text-white shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all cursor-pointer active:scale-95 group shrink-0"
                  title="Choose Color (Tap to open Color Pop-up)"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/90 shadow-[0_0_8px_rgba(255,255,255,0.4)] shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-[11px] font-bold text-white font-mono">
                      {currentColorObj?.name || `Color: ${color}`}
                    </span>
                    <Palette className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span className="text-[9px] text-cyan-300">▾</span>
                  </div>
                </button>

                {/* Reset Sheet */}
                <button
                  type="button"
                  onClick={handleResetSheet}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 transition-all cursor-pointer active:scale-95 text-[11px] font-mono"
                  title="Reset Sheet"
                >
                  Reset
                </button>
              </div>

              {/* Interactive SVG Coloring Page Wrapper */}
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] flex items-center justify-center">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-[300px] sm:h-[380px] drop-shadow-[0_0_35px_rgba(34,211,238,0.2)]"
                >
                  {/* Background outline canvas */}
                  <rect width="400" height="400" rx="28" fill="#0f1f2e" stroke="#1e3a52" strokeWidth="3" />

                  {/* All segmented parts of the coloring sheet */}
                  {currentSheet.parts.map((part) => {
                    const partFill = currentFills[part.id] || part.defaultFill || '#ffffff';
                    const isJustFilled = justFilledPartId === part.id;

                    return (
                      <path
                        key={part.id}
                        d={part.d}
                        fill={partFill}
                        stroke="#050d14"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleFillPart(part.id)}
                        className={`cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.99] origin-center ${
                          isJustFilled ? 'animate-pulse' : ''
                        }`}
                      >
                        <title>{`Tap to color ${part.name}`}</title>
                      </path>
                    );
                  })}
                </svg>

                {/* Floating Download Button directly ON the board with NO background */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 p-1 text-cyan-300 hover:text-white transition-all cursor-pointer active:scale-95 group"
                  title="Save artwork to device"
                >
                  <Download className="w-5 h-5 text-cyan-400 group-hover:text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                  <span className="text-xs font-mono font-bold text-cyan-300 group-hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Download</span>
                </button>
              </div>

              {/* Progress & 30 Paintings Menu & Auto Fill Buttons */}
              <div className="mt-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#071524]/90 border-2 border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex flex-col gap-2 max-w-[340px] sm:max-w-[420px] w-full">
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    Filled: {filledCount} / {currentSheet.parts.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaintingMenuOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-mono font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all"
                    title="Choose from 30+ beautiful paintings"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>🎨 30 Paintings Menu ▾</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={triggerAutoFillColors}
                  disabled={isAutoFilling}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                  title="AI will automatically fill the colors"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isAutoFilling ? 'animate-spin' : ''}`} />
                  <span>{isAutoFilling ? '🎨 Jarvis is filling colors...' : '✨ Fill the colors for me (Auto-Fill)'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Freehand Drawing Mode - Clean Board with Floating Controls */
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Drawing Canvas Container */}
            <div
              className={`relative w-full rounded-3xl bg-[#0a161f] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden transition-all ${
                isFullCanvas ? 'h-[78vh]' : 'h-[500px] sm:h-[580px]'
              }`}
            >
              {/* Top Floating Toolbar (ON TOP OF BOARD - placed exactly where red mark was made) */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-[#06121d]/90 backdrop-blur-md border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)] overflow-x-auto scrollbar-none"
              >
                {/* Single Color Picker Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEraser(false);
                    setIsColorPickerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#0d2338] to-[#071626] hover:from-[#122e49] hover:to-[#0a1e32] border border-cyan-400/60 hover:border-cyan-300 text-white shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all cursor-pointer active:scale-95 group shrink-0"
                  title="Choose Color (Tap to open Color Pop-up)"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/90 shadow-[0_0_8px_rgba(255,255,255,0.4)] shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: isEraser ? '#ffffff' : color }}
                  />
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-[11px] font-bold text-white font-mono">
                      {currentColorObj?.name || (isEraser ? 'Eraser' : `Color: ${color}`)}
                    </span>
                    <Palette className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span className="text-[9px] text-cyan-300">▾</span>
                  </div>
                </button>

                {/* Freehand Tools: Pen, Fill, Eraser, Sizes, Reset */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Pen vs Bucket Fill */}
                  <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/80">
                    <button
                      type="button"
                      onClick={() => {
                        setFreehandTool('pen');
                        setIsEraser(false);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                        freehandTool === 'pen' && !isEraser
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Pen Tool: Draw lines"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>Pen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFreehandTool('bucket');
                        setIsEraser(false);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono cursor-pointer transition-all ${
                        freehandTool === 'bucket' && !isEraser
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Bucket Fill Tool: Tap inside any shape to fill color"
                    >
                      <PaintBucket className="w-3 h-3" />
                      <span>Fill</span>
                    </button>
                  </div>

                  {/* Eraser */}
                  <button
                    type="button"
                    onClick={() => setIsEraser(prev => !prev)}
                    className={`p-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      isEraser
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-bold'
                        : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Eraser / Clean fill"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Eraser</span>
                  </button>

                  {/* Brush Sizes */}
                  <div className="hidden sm:flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/80">
                    {BRUSH_SIZES.map(b => (
                      <button
                        key={b.size}
                        type="button"
                        onClick={() => setBrushSize(b.size)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                          brushSize === b.size ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  {/* Reset Canvas */}
                  <button
                    type="button"
                    onClick={() => {
                      if (canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = '#0a161f';
                          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                      }
                    }}
                    className="px-2 py-1 rounded-xl bg-slate-900/90 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 transition-all cursor-pointer active:scale-95 text-[11px] font-mono"
                    title="Clear Board"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Canvas element underneath (Board niche rahana chahie) */}
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onPointerCancel={stopDrawing}
                className="w-full h-full touch-none cursor-crosshair z-10"
              />

              {/* Autonomous Brush Indicator when Jarvis is drawing */}
              {isDemonstrating && demoCursorPos && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-75"
                  style={{
                    left: `${demoCursorPos.x}px`,
                    top: `${demoCursorPos.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400/80 border-2 border-white animate-ping" />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute -top-3 -right-3 animate-bounce" />
                </div>
              )}

              {/* Floating Download Button on Board with NO background */}
              <button
                type="button"
                onClick={handleDownload}
                className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 p-1 text-cyan-300 hover:text-white transition-all cursor-pointer active:scale-95 group"
                title="Save artwork to device"
              >
                <Download className="w-5 h-5 text-cyan-400 group-hover:text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                <span className="text-xs font-mono font-bold text-cyan-300 group-hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Download</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Paintings Selection Menu Modal */}
      <PaintingMenuModal
        isOpen={isPaintingMenuOpen}
        onClose={() => setIsPaintingMenuOpen(false)}
        sheets={COLORING_SHEETS}
        activeSheetId={activeSheetId}
        sheetFills={sheetFills}
        onSelectSheet={(sheetId) => {
          setActiveSheetId(sheetId);
        }}
      />

      {/* Color Selection Modal Pop-up */}
      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        selectedColor={color}
        onSelectColor={(hex) => {
          setColor(hex);
          setIsEraser(false);
        }}
      />
    </div>
  );
}
