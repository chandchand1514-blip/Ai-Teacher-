export interface ColoringPart {
  id: string;
  name: string;
  d: string;
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
  category: 'Animals' | 'Fruits' | 'Vehicles' | 'Nature' | 'Sky' | 'Treats' | 'Buildings';
  parts: ColoringPart[];
}

export interface SheetCategoryInfo {
  id: string;
  label: string;
  emoji: string;
  count?: number;
}

export const SHEET_CATEGORIES: SheetCategoryInfo[] = [
  { id: 'all', label: 'All', emoji: '🌟' },
  { id: 'Animals', label: 'Animals & Birds', emoji: '🦁' },
  { id: 'Fruits', label: 'Fruits & Veggies', emoji: '🍎' },
  { id: 'Vehicles', label: 'Vehicles', emoji: '🚗' },
  { id: 'Nature', label: 'Nature', emoji: '🌸' },
  { id: 'Sky', label: 'Sky & Stars', emoji: '⭐' },
  { id: 'Treats', label: 'Toys & Treats', emoji: '🎈' },
  { id: 'Buildings', label: 'Buildings', emoji: '🏠' }
];

export const COLORING_SHEETS: ColoringSheet[] = [
  // 1. FLOWER
  {
    id: 'flower',
    name: 'Flower',
    emoji: '🌸',
    category: 'Nature',
    parts: [
      {
        id: 'flower-stem',
        name: 'Stem',
        d: 'M192,205 C190,260 210,310 198,370 C206,370 208,260 208,205 Z',
        recommendedColor: '#4ade80',
        recommendedName: 'Green',
        avoidColors: 'Red, Black',
        hint: 'Fill the stem with fresh green!'
      },
      {
        id: 'flower-leaf-left',
        name: 'Left Leaf',
        d: 'M194,270 C140,260 110,230 115,210 C150,225 180,250 194,275 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'Green',
        avoidColors: 'Blue, Black',
        hint: 'Fill the leaves with green!'
      },
      {
        id: 'flower-leaf-right',
        name: 'Right Leaf',
        d: 'M206,290 C255,275 285,250 280,230 C245,245 220,270 206,295 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'Green',
        avoidColors: 'Blue, Black',
        hint: 'Fill the right leaf with green too!'
      },
      {
        id: 'flower-petals',
        name: 'Petals',
        d: 'M200,80 C230,20 280,30 260,90 C320,80 340,130 290,160 C340,190 310,245 250,225 C260,285 205,300 180,240 C140,290 85,260 110,205 C50,195 60,130 120,130 C90,80 150,30 200,80 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'Pink or Red',
        avoidColors: 'Black, Brown',
        hint: 'Fill the petals with bright pink or red!'
      },
      {
        id: 'flower-center',
        name: 'Center Disc',
        d: 'M200,120 A42,42 0 1,0 200,204 A42,42 0 1,0 200,120 Z',
        recommendedColor: '#fde047',
        recommendedName: 'Yellow',
        avoidColors: 'Black, Gray',
        hint: 'Fill the center with golden yellow!'
      }
    ]
  },

  // 2. SUN
  {
    id: 'sun',
    name: 'Sun (सूरज देवता)',
    emoji: '☀️',
    category: 'Nature',
    parts: [
      {
        id: 'sun-rays',
        name: 'Sun Rays (सूरज की किरणें)',
        d: 'M200,40 L212,85 L260,50 L245,98 L305,80 L275,122 L335,130 L290,165 L345,195 L290,215 L335,250 L275,260 L305,300 L245,285 L260,335 L212,300 L200,345 L188,300 L140,335 L155,285 L95,300 L125,260 L65,250 L110,215 L55,195 L110,165 L65,130 L125,122 L95,80 L155,98 L140,50 L188,85 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'नारंगी (Orange) या गोल्डन',
        avoidColors: 'काला, हरा',
        hint: 'किरणों में चमकदार नारंगी या सुनहरा रंग भरें!'
      },
      {
        id: 'sun-face',
        name: 'Sun Face (सूरज का चेहरा)',
        d: 'M200,115 A85,85 0 1,0 200,285 A85,85 0 1,0 200,115 Z',
        recommendedColor: '#fde047',
        recommendedName: 'चमकीला पीला (Yellow)',
        avoidColors: 'काला, भूरा',
        hint: 'सूरज के चेहरे में खिलता हुआ पीला रंग भरें!'
      },
      {
        id: 'sun-cheeks',
        name: 'Rosy Cheeks (गुलाबी गाल)',
        d: 'M155,210 A15,15 0 1,0 155,240 A15,15 0 1,0 155,210 Z M245,210 A15,15 0 1,0 245,240 A15,15 0 1,0 245,210 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Pink)',
        avoidColors: 'काला',
        hint: 'सूरज के गालों पर प्यारा गुलाबी रंग भरें!'
      }
    ]
  },

  // 3. CAT
  {
    id: 'cat',
    name: 'Cat (प्यारी बिल्ली)',
    emoji: '🐱',
    category: 'Animals',
    parts: [
      {
        id: 'cat-body',
        name: 'Cat Body (बिल्ली का शरीर)',
        d: 'M130,250 C120,330 110,370 170,370 L230,370 C290,370 280,330 270,250 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी (Orange) या सफेद',
        avoidColors: 'हरा, नीला',
        hint: 'बिल्ली के शरीर पर संतरी या सफेद रंग भरें!'
      },
      {
        id: 'cat-tail',
        name: 'Cat Tail (पूँछ)',
        d: 'M265,340 C330,340 350,270 330,230 C315,245 315,280 260,320 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी (Orange) या भूरा',
        avoidColors: 'हरा, नीला',
        hint: 'पूँछ में शरीर से मिलता हुआ संतरी रंग भरें!'
      },
      {
        id: 'cat-head',
        name: 'Cat Face (बिल्ली का चेहरा)',
        d: 'M200,130 C150,130 140,180 140,210 C140,260 170,270 200,270 C230,270 260,260 260,210 C260,180 250,130 200,130 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी (Orange) या सफेद',
        avoidColors: 'नीला, हरा',
        hint: 'चेहरे में प्यारा संतरी या सफेद रंग भरें!'
      },
      {
        id: 'cat-ears',
        name: 'Cat Ears (कान)',
        d: 'M145,160 L125,95 L175,135 Z M255,160 L275,95 L225,135 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी या भूरा',
        avoidColors: 'हरा',
        hint: 'कानों में संतरी रंग भरें!'
      },
      {
        id: 'cat-ears-inner',
        name: 'Inner Ears (कान के अंदर)',
        d: 'M145,150 L135,110 L165,135 Z M255,150 L265,110 L235,135 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'हल्का गुलाबी (Pink)',
        avoidColors: 'काला, नीला',
        hint: 'कानों के अंदर हल्का गुलाबी रंग भरें!'
      },
      {
        id: 'cat-nose',
        name: 'Little Nose (छोटी नाक)',
        d: 'M192,205 L208,205 L200,218 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Pink Nose)',
        avoidColors: 'काला',
        hint: 'नाक में प्यारा गुलाबी रंग भरें!'
      }
    ]
  },

  // 4. HOUSE
  {
    id: 'house',
    name: 'House (सुंदर घर)',
    emoji: '🏠',
    category: 'Buildings',
    parts: [
      {
        id: 'house-roof',
        name: 'Roof (छत)',
        d: 'M200,60 L70,165 L330,165 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red) या संतरी',
        avoidColors: 'काला',
        hint: 'घर की छत को चमकदार लाल रंग दें!'
      },
      {
        id: 'house-chimney',
        name: 'Chimney (धुएं की चिमनी)',
        d: 'M260,115 L260,75 L285,75 L285,135 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'पीला',
        hint: 'चिमनी में ईंट जैसा भूरा रंग भरें!'
      },
      {
        id: 'house-walls',
        name: 'Walls (दीवारें)',
        d: 'M95,165 L305,165 L305,340 L95,340 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी (Sky Blue) या पीला',
        avoidColors: 'काला, ग्रे',
        hint: 'दीवारों में सुंदर आसमानी नीला रंग भरें!'
      },
      {
        id: 'house-door',
        name: 'Door (दरवाज़ा)',
        d: 'M170,240 L230,240 L230,340 L170,340 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'पीला',
        hint: 'दरवाज़े में लकड़ी जैसा भूरा रंग भरें!'
      },
      {
        id: 'house-window',
        name: 'Windows (खिड़कियाँ)',
        d: 'M115,200 L155,200 L155,240 L115,240 Z M245,200 L285,200 L285,240 L245,240 Z',
        recommendedColor: '#fde047',
        recommendedName: 'पीला (Yellow)',
        avoidColors: 'काला',
        hint: 'खिड़की में चमकती रोशनी जैसा पीला रंग भरें!'
      }
    ]
  },

  // 5. CAR
  {
    id: 'car',
    name: 'Car (तेज़ कार)',
    emoji: '🚗',
    category: 'Vehicles',
    parts: [
      {
        id: 'car-body',
        name: 'Car Body (कार का ढांचा)',
        d: 'M60,250 C50,225 70,200 95,195 L135,195 L175,130 L275,130 L320,195 L345,210 C360,225 355,255 340,260 L305,260 C300,230 260,230 255,260 L145,260 C140,230 100,230 95,260 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red) या नीला',
        avoidColors: 'काला, भूरा',
        hint: 'कार की बॉडी में रेसिंग लाल रंग भरें!'
      },
      {
        id: 'car-window-front',
        name: 'Front Glass (आगे का शीशा)',
        d: 'M230,140 L270,195 L225,195 L225,140 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'हल्का आसमानी नीला',
        avoidColors: 'काला, लाल',
        hint: 'शीशे में साफ़ आसमानी नीला रंग भरें!'
      },
      {
        id: 'car-window-rear',
        name: 'Back Glass (पीछे का शीशा)',
        d: 'M180,140 L218,140 L218,195 L145,195 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'हल्का आसमानी नीला',
        avoidColors: 'काला, लाल',
        hint: 'पीछे के शीशे में भी आसमानी रंग डालें!'
      },
      {
        id: 'car-wheel-front',
        name: 'Front Wheel (आगे का पहिया)',
        d: 'M260,240 A28,28 0 1,0 300,270 A28,28 0 1,0 260,240 Z',
        recommendedColor: '#1e293b',
        recommendedName: 'गहरा काला / डार्क स्लेट',
        avoidColors: 'पीला, लाल',
        hint: 'पहिये में रबर जैसा डार्क काला रंग भरें!'
      },
      {
        id: 'car-wheel-rear',
        name: 'Rear Wheel (पीछे का पहिया)',
        d: 'M100,240 A28,28 0 1,0 140,270 A28,28 0 1,0 100,240 Z',
        recommendedColor: '#1e293b',
        recommendedName: 'गहरा काला / डार्क स्लेट',
        avoidColors: 'पीला, लाल',
        hint: 'पीछे के पहिये में भी डार्क रंग भरें!'
      }
    ]
  },

  // 6. FISH
  {
    id: 'fish',
    name: 'Fish (जल की रानी)',
    emoji: '🐠',
    category: 'Animals',
    parts: [
      {
        id: 'fish-tail',
        name: 'Tail Fin (पूँछ)',
        d: 'M100,200 L40,140 L60,200 L40,260 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'नारंगी (Orange)',
        avoidColors: 'काला, भूरा',
        hint: 'मछली की पूँछ में नारंगी रंग भरें!'
      },
      {
        id: 'fish-body',
        name: 'Fish Body (मछली का शरीर)',
        d: 'M95,200 C110,120 230,120 310,200 C230,280 110,280 95,200 Z',
        recommendedColor: '#fde047',
        recommendedName: 'सुनहरा पीला (Yellow)',
        avoidColors: 'काला, भूरा',
        hint: 'मछली के शरीर में सुनहरा पीला रंग भरें!'
      },
      {
        id: 'fish-fin-top',
        name: 'Top Fin (ऊपर का पर)',
        d: 'M170,140 C190,100 230,105 250,145 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red)',
        avoidColors: 'काला',
        hint: 'ऊपर के पर में चमकदार लाल रंग भरें!'
      },
      {
        id: 'fish-face',
        name: 'Face & Gills (चेहरा)',
        d: 'M250,155 C275,175 275,225 250,245 C290,230 305,210 310,200 C305,190 290,170 250,155 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'नारंगी (Orange)',
        avoidColors: 'काला',
        hint: 'आगे के चेहरे में नारंगी रंग भरें!'
      }
    ]
  },

  // 7. TREE
  {
    id: 'tree',
    name: 'Tree (हरा-भरा पेड़)',
    emoji: '🌳',
    category: 'Nature',
    parts: [
      {
        id: 'tree-trunk',
        name: 'Trunk (पेड़ का तना)',
        d: 'M175,230 L165,370 L235,370 L225,230 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Wood Brown)',
        avoidColors: 'नीला, लाल',
        hint: 'तने में लकड़ी जैसा गहरा भूरा रंग भरें!'
      },
      {
        id: 'tree-leaves',
        name: 'Leaves Crown (हरी पत्तियां)',
        d: 'M200,60 C240,55 285,90 280,135 C320,150 330,200 295,235 C270,260 220,250 200,245 C180,250 130,260 105,235 C70,200 80,150 120,135 C115,90 160,55 200,60 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'ताज़ा हरा (Green)',
        avoidColors: 'लाल, काला',
        hint: 'पत्तियों में खिलता हुआ हरा रंग भरें!'
      },
      {
        id: 'tree-apples',
        name: 'Red Apples (लाल सेब)',
        d: 'M150,150 A14,14 0 1,0 150,178 A14,14 0 1,0 150,150 Z M240,165 A14,14 0 1,0 240,193 A14,14 0 1,0 240,165 Z M195,190 A14,14 0 1,0 195,218 A14,14 0 1,0 195,190 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red)',
        avoidColors: 'भूरा, काला',
        hint: 'मीठे सेबों में चमकदार लाल रंग भरें!'
      }
    ]
  },

  // 8. APPLE
  {
    id: 'apple',
    name: 'Apple (मीठा सेब)',
    emoji: '🍎',
    category: 'Fruits',
    parts: [
      {
        id: 'apple-stem',
        name: 'Stem (डंडी)',
        d: 'M196,110 C194,80 205,60 215,55 C213,75 202,90 202,110 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'नीला, पीला',
        hint: 'डंडी में भूरा रंग भरें!'
      },
      {
        id: 'apple-leaf',
        name: 'Leaf (पत्ती)',
        d: 'M210,70 C240,65 260,85 250,105 C225,100 215,85 210,70 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'हरा (Green)',
        avoidColors: 'लाल, काला',
        hint: 'सेब की पत्ती में हरा रंग भरें!'
      },
      {
        id: 'apple-body',
        name: 'Apple Body (रसीला सेब)',
        d: 'M200,120 C160,95 100,120 100,190 C100,270 160,330 195,335 C200,335 205,335 205,335 C240,330 300,270 300,190 C300,120 240,95 200,120 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'रसीला लाल (Red)',
        avoidColors: 'काला, नीला',
        hint: 'सेब में मीठा और रसीला लाल रंग भरें!'
      }
    ]
  },

  // 9. BUTTERFLY
  {
    id: 'butterfly',
    name: 'Butterfly (सुंदर तितली)',
    emoji: '🦋',
    category: 'Animals',
    parts: [
      {
        id: 'bf-wing-left-top',
        name: 'Left Top Wing (बायाँ बड़ा पंख)',
        d: 'M185,170 C140,80 70,100 80,180 C85,210 135,225 185,200 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Sky Blue)',
        avoidColors: 'काला, भूरा',
        hint: 'बाएँ पंख में चमकता नीला रंग भरें!'
      },
      {
        id: 'bf-wing-right-top',
        name: 'Right Top Wing (दायाँ बड़ा पंख)',
        d: 'M215,170 C260,80 330,100 320,180 C315,210 265,225 215,200 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Sky Blue)',
        avoidColors: 'काला, भूरा',
        hint: 'दाएँ पंख में भी नीला रंग भरें!'
      },
      {
        id: 'bf-wing-left-bottom',
        name: 'Left Lower Wing (बायाँ छोटा पंख)',
        d: 'M185,205 C130,225 110,290 150,310 C180,315 190,260 185,220 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Pink)',
        avoidColors: 'काला',
        hint: 'नीचे के पंख में गुलाबी रंग भरें!'
      },
      {
        id: 'bf-wing-right-bottom',
        name: 'Right Lower Wing (दायाँ छोटा पंख)',
        d: 'M215,205 C270,225 290,290 250,310 C220,315 210,260 215,220 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Pink)',
        avoidColors: 'काला',
        hint: 'दाएँ नीचे पंख में भी गुलाबी रंग भरें!'
      },
      {
        id: 'bf-body',
        name: 'Body & Antennae (तितली का शरीर)',
        d: 'M193,150 C193,130 207,130 207,150 L207,290 C207,305 193,305 193,290 Z',
        recommendedColor: '#c084fc',
        recommendedName: 'बैंगनी (Purple)',
        avoidColors: 'सफेद',
        hint: 'तितली के शरीर में बैंगनी रंग भरें!'
      }
    ]
  },

  // 10. MANGO
  {
    id: 'mango',
    name: 'Mango (फलों का राजा आम)',
    emoji: '🥭',
    category: 'Fruits',
    parts: [
      {
        id: 'mango-stem',
        name: 'Stem (डंडी)',
        d: 'M195,85 C190,60 205,45 215,40 C212,55 202,70 202,85 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'लाल',
        hint: 'डंडी में भूरा रंग भरें!'
      },
      {
        id: 'mango-leaf',
        name: 'Leaf (पत्ती)',
        d: 'M205,55 C245,45 270,70 260,95 C230,85 215,70 205,55 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'गहरा हरा (Green)',
        avoidColors: 'काला',
        hint: 'आम की पत्ती में हरा रंग भरें!'
      },
      {
        id: 'mango-body',
        name: 'Mango Pulp (रसीला आम)',
        d: 'M195,95 C140,90 90,140 100,215 C115,310 190,360 245,340 C305,315 315,230 290,170 C270,125 235,95 195,95 Z',
        recommendedColor: '#fde047',
        recommendedName: 'मीठा पीला (Yellow)',
        avoidColors: 'नीला, काला',
        hint: 'मीठे आम में सुनहरा पीला रंग भरें!'
      }
    ]
  },

  // 11. ICE CREAM
  {
    id: 'icecream',
    name: 'Ice Cream (ठंडी कुल्फी)',
    emoji: '🍦',
    category: 'Treats',
    parts: [
      {
        id: 'icecream-cone',
        name: 'Waffle Cone (कोन)',
        d: 'M140,210 L260,210 L200,360 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'गोल्डन भूरा (Cone Brown)',
        avoidColors: 'हरा, नीला',
        hint: 'कुरकुरे कोन में सुनहरा भूरा या संतरी रंग भरें!'
      },
      {
        id: 'icecream-scoop-bottom',
        name: 'Bottom Scoop (नीचे का स्कूप)',
        d: 'M130,210 C120,165 170,140 200,160 C230,140 280,165 270,210 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Blueberry)',
        avoidColors: 'काला, ग्रे',
        hint: 'नीचे के स्कूप में आसमानी नीला रंग भरें!'
      },
      {
        id: 'icecream-scoop-top',
        name: 'Top Scoop (स्ट्रॉबेरी स्कूप)',
        d: 'M150,160 C140,110 200,85 200,100 C200,85 260,110 250,160 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Strawberry Pink)',
        avoidColors: 'काला, भूरा',
        hint: 'ऊपर के स्कूप में प्यारा गुलाबी रंग भरें!'
      },
      {
        id: 'icecream-cherry',
        name: 'Cherry On Top (लाल चेरी)',
        d: 'M200,75 A15,15 0 1,0 200,105 A15,15 0 1,0 200,75 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Cherry)',
        avoidColors: 'पीला, सफेद',
        hint: 'टॉप पर लगी चेरी में चमकदार लाल रंग भरें!'
      }
    ]
  },

  // 12. STAR
  {
    id: 'star',
    name: 'Star (चमकता तारा)',
    emoji: '⭐',
    category: 'Sky',
    parts: [
      {
        id: 'star-body',
        name: 'Star Points (तारे के कोने)',
        d: 'M200,60 L235,150 L330,155 L255,215 L285,305 L200,255 L115,305 L145,215 L70,155 L165,150 Z',
        recommendedColor: '#fde047',
        recommendedName: 'चमकीला पीला (Golden Yellow)',
        avoidColors: 'काला, भूरा',
        hint: 'तारे में चमकदार पीला रंग भरें!'
      },
      {
        id: 'star-sparkles',
        name: 'Sparkles (किरणों की चमक)',
        d: 'M80,90 L90,65 L100,90 L125,100 L100,110 L90,135 L80,110 L55,100 Z M310,260 L318,240 L326,260 L346,268 L326,276 L318,296 L310,276 L290,268 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद या हल्का नीला',
        avoidColors: 'काला',
        hint: 'चमकने वाली किरणों में सफेद रंग भरें!'
      }
    ]
  },

  // 13. DOG
  {
    id: 'dog',
    name: 'Puppy Dog (प्यारा कुत्ता)',
    emoji: '🐶',
    category: 'Animals',
    parts: [
      {
        id: 'dog-body',
        name: 'Body & Paws (शरीर और पंजे)',
        d: 'M140,250 C125,320 120,360 170,360 L230,360 C280,360 275,320 260,250 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown) या सफेद',
        avoidColors: 'हरा, नीला',
        hint: 'कुत्ते के शरीर पर भूरा या हल्का क्रीम रंग भरें!'
      },
      {
        id: 'dog-head',
        name: 'Head & Face (चेहरा)',
        d: 'M200,120 C145,120 145,190 145,230 C145,270 170,280 200,280 C230,280 255,270 255,230 C255,190 255,120 200,120 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'नीला, हरा',
        hint: 'चेहरे में भूरा रंग भरें!'
      },
      {
        id: 'dog-ears',
        name: 'Floppy Ears (झूलते कान)',
        d: 'M150,140 C110,150 90,210 115,240 C135,240 145,200 150,160 Z M250,140 C290,150 310,210 285,240 C265,240 255,200 250,160 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी या गहरा भूरा',
        avoidColors: 'हरा, गुलाबी',
        hint: 'कानों में गहरा भूरा या संतरी रंग भरें!'
      },
      {
        id: 'dog-collar',
        name: 'Collar (गले का पट्टा)',
        d: 'M155,255 C180,265 220,265 245,255 L240,275 C215,285 185,285 160,275 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Collar)',
        avoidColors: 'भूरा',
        hint: 'गले के पट्टे में चमकीला लाल रंग भरें!'
      },
      {
        id: 'dog-nose',
        name: 'Snout & Nose (नाक)',
        d: 'M188,215 C188,205 212,205 212,215 C212,228 188,228 188,215 Z',
        recommendedColor: '#1e293b',
        recommendedName: 'काला (Black Nose)',
        avoidColors: 'सफेद',
        hint: 'नाक में छोटा सा काला रंग भरें!'
      }
    ]
  },

  // 14. DUCK
  {
    id: 'duck',
    name: 'Duck (तैरती बत्तख)',
    emoji: '🦆',
    category: 'Animals',
    parts: [
      {
        id: 'duck-body',
        name: 'Duck Body (बत्तख का शरीर)',
        d: 'M120,220 C100,240 110,290 170,300 L250,300 C300,300 320,260 290,230 C270,210 240,230 200,230 C160,230 140,210 120,220 Z',
        recommendedColor: '#fde047',
        recommendedName: 'चमकदार पीला (Yellow)',
        avoidColors: 'काला, लाल',
        hint: 'बत्तख के शरीर में चमकदार पीला रंग भरें!'
      },
      {
        id: 'duck-head',
        name: 'Duck Head (सिर)',
        d: 'M180,140 C150,140 140,170 140,195 C140,225 170,235 195,235 C220,235 225,210 220,180 C215,150 205,140 180,140 Z',
        recommendedColor: '#fde047',
        recommendedName: 'पीला (Yellow)',
        avoidColors: 'काला, लाल',
        hint: 'सिर में भी पीला रंग भरें!'
      },
      {
        id: 'duck-beak',
        name: 'Duck Beak (चोंच)',
        d: 'M145,185 L95,195 L145,210 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी (Orange Beak)',
        avoidColors: 'नीला, हरा',
        hint: 'चोंच में नारंगी या संतरी रंग भरें!'
      },
      {
        id: 'duck-water',
        name: 'Water Waves (पानी की लहरें)',
        d: 'M70,310 C110,295 150,325 190,310 C230,295 270,325 310,310 L330,345 L60,345 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Blue Water)',
        avoidColors: 'लाल, पीला',
        hint: 'पानी की लहरों में सुंदर आसमानी नीला रंग भरें!'
      }
    ]
  },

  // 15. RABBIT
  {
    id: 'rabbit',
    name: 'Rabbit (नन्हा खरगोश)',
    emoji: '🐰',
    category: 'Animals',
    parts: [
      {
        id: 'rabbit-ears',
        name: 'Long Ears (लंबे कान)',
        d: 'M160,150 C140,70 160,40 180,60 C195,80 185,130 175,160 Z M240,150 C260,70 240,40 220,60 C205,80 215,130 225,160 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White)',
        avoidColors: 'काला, लाल',
        hint: 'कानों में सफेद रंग भरें!'
      },
      {
        id: 'rabbit-ears-inner',
        name: 'Inner Ears (कान के अंदर)',
        d: 'M165,130 C155,85 165,65 175,80 C180,95 175,120 170,135 Z M235,130 C245,85 235,65 225,80 C220,95 225,120 230,135 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'हल्का गुलाबी (Pink)',
        avoidColors: 'काला, हरा',
        hint: 'कानों के अंदर हल्का गुलाबी रंग भरें!'
      },
      {
        id: 'rabbit-head',
        name: 'Chubby Face (चेहरा)',
        d: 'M200,150 C150,150 140,195 140,230 C140,265 170,275 200,275 C230,275 260,265 260,230 C260,195 250,150 200,150 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White)',
        avoidColors: 'काला',
        hint: 'खरगोश के चेहरे में सफेद रंग भरें!'
      },
      {
        id: 'rabbit-body',
        name: 'Rabbit Body (शरीर)',
        d: 'M150,270 C130,310 130,360 180,360 L220,360 C270,360 270,310 250,270 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White)',
        avoidColors: 'नीला, हरा',
        hint: 'शरीर में भी सफेद रंग भरें!'
      },
      {
        id: 'rabbit-carrot',
        name: 'Carrot Snack (मीठी गाजर)',
        d: 'M180,290 L220,290 L200,345 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'नारंगी (Orange Carrot)',
        avoidColors: 'काला',
        hint: 'गाजर में चटख नारंगी रंग भरें!'
      }
    ]
  },

  // 16. ELEPHANT
  {
    id: 'elephant',
    name: 'Elephant (हाथी राजा)',
    emoji: '🐘',
    category: 'Animals',
    parts: [
      {
        id: 'ele-body',
        name: 'Elephant Body (हाथी का शरीर)',
        d: 'M140,220 C120,220 100,280 110,360 L160,360 L170,300 L230,300 L240,360 L290,360 C300,280 280,220 260,220 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला या ग्रे',
        avoidColors: 'लाल, पीला',
        hint: 'हाथी के बड़े शरीर में नीला या ग्रे रंग भरें!'
      },
      {
        id: 'ele-head',
        name: 'Head (सिर)',
        d: 'M200,130 C165,130 155,170 155,210 C155,245 180,250 200,250 C220,250 245,245 245,210 C245,170 235,130 200,130 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'हल्का नीला / ग्रे',
        avoidColors: 'लाल',
        hint: 'सिर में भी नीला या ग्रे रंग भरें!'
      },
      {
        id: 'ele-ears-left',
        name: 'Left Big Ear (बायाँ सूप जैसा कान)',
        d: 'M160,150 C110,140 80,180 90,240 C100,270 140,260 160,230 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी या नीला',
        avoidColors: 'काला',
        hint: 'बाएँ कान में गुलाबी या नीला रंग भरें!'
      },
      {
        id: 'ele-ears-right',
        name: 'Right Big Ear (दायाँ सूप जैसा कान)',
        d: 'M240,150 C290,140 320,180 310,240 C300,270 260,260 240,230 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी या नीला',
        avoidColors: 'काला',
        hint: 'दाएँ कान में गुलाबी या नीला रंग भरें!'
      },
      {
        id: 'ele-trunk',
        name: 'Long Trunk (लंबी सूंड)',
        d: 'M190,230 C190,290 170,320 150,310 C140,300 155,280 175,270 L180,230 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'नीला / ग्रे',
        avoidColors: 'लाल',
        hint: 'हाथी की सूंड में नीला रंग भरें!'
      }
    ]
  },

  // 17. LION
  {
    id: 'lion',
    name: 'Lion King (शेर राजा)',
    emoji: '🦁',
    category: 'Animals',
    parts: [
      {
        id: 'lion-mane',
        name: 'Lion Mane (घने बाल / अयाल)',
        d: 'M200,60 C240,55 285,85 295,130 C330,150 345,210 320,250 C335,295 295,335 250,335 C230,345 200,345 170,335 C115,335 80,290 90,240 C65,200 80,145 115,120 C125,75 165,55 200,60 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown) या गहरा संतरी',
        avoidColors: 'हरा, नीला',
        hint: 'शेर के घने बालों में गहरा भूरा या संतरी रंग भरें!'
      },
      {
        id: 'lion-face',
        name: 'Lion Face (चेहरा)',
        d: 'M200,135 C160,135 150,175 150,210 C150,250 170,265 200,265 C230,265 250,250 250,210 C250,175 240,135 200,135 Z',
        recommendedColor: '#fde047',
        recommendedName: 'पीला (Golden Yellow)',
        avoidColors: 'नीला, हरा',
        hint: 'शेर के चेहरे में सुनहरा पीला रंग भरें!'
      },
      {
        id: 'lion-ears',
        name: 'Ears (कान)',
        d: 'M145,145 C130,130 135,110 155,120 Z M255,145 C270,130 265,110 245,120 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी या पीला',
        avoidColors: 'काला',
        hint: 'कानों में संतरी रंग भरें!'
      },
      {
        id: 'lion-nose',
        name: 'Nose & Mouth (नाक)',
        d: 'M190,205 L210,205 L200,218 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'गुलाबी या लाल',
        avoidColors: 'हरा',
        hint: 'नाक में छोटा सा गुलाबी रंग भरें!'
      }
    ]
  },

  // 18. PARROT
  {
    id: 'parrot',
    name: 'Parrot (मिठ्ठू तोता)',
    emoji: '🦜',
    category: 'Animals',
    parts: [
      {
        id: 'parrot-body',
        name: 'Body & Tail (शरीर और पूँछ)',
        d: 'M170,130 C150,150 145,210 155,270 L140,370 L170,370 L185,280 C215,280 230,250 225,200 C220,160 200,130 170,130 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'चमकदार हरा (Green)',
        avoidColors: 'काला, भूरा',
        hint: 'तोते के पूरे शरीर में तोतिया हरा रंग भरें!'
      },
      {
        id: 'parrot-wing',
        name: 'Wing (पंख)',
        d: 'M165,180 C140,210 140,260 160,270 C185,270 195,230 190,190 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'नीला (Sky Blue) या पीला',
        avoidColors: 'काला',
        hint: 'तोते के पंख में नीला या पीला रंग भरें!'
      },
      {
        id: 'parrot-beak',
        name: 'Curved Beak (लाल चोंच)',
        d: 'M200,140 C235,145 240,175 220,185 C210,185 205,175 200,165 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Beak)',
        avoidColors: 'हरा, नीला',
        hint: 'तोते की तीखी चोंच में चमकदार लाल रंग भरें!'
      },
      {
        id: 'parrot-perch',
        name: 'Wooden Branch (डाल)',
        d: 'M70,285 L330,285 L330,305 L70,305 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown Branch)',
        avoidColors: 'नीला',
        hint: 'पेड़ की डाल में लकड़ी जैसा भूरा रंग भरें!'
      }
    ]
  },

  // 19. BANANA
  {
    id: 'banana',
    name: 'Banana (पका मीठा केला)',
    emoji: '🍌',
    category: 'Fruits',
    parts: [
      {
        id: 'banana-peel',
        name: 'Banana Peel (केले का छिलका)',
        d: 'M100,240 C120,330 260,340 310,230 C270,300 170,290 120,230 Z',
        recommendedColor: '#fde047',
        recommendedName: 'चमकीला पीला (Yellow)',
        avoidColors: 'नीला, लाल',
        hint: 'केले के छिलके में चमकता पीला रंग भरें!'
      },
      {
        id: 'banana-pulp',
        name: 'Sweet Fruit (मीठा फल)',
        d: 'M120,230 C150,170 230,160 270,190 C250,250 180,260 120,230 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद या हल्का क्रीम',
        avoidColors: 'काला, लाल',
        hint: 'अंदर के मीठे फल में सफेद या क्रीम रंग भरें!'
      },
      {
        id: 'banana-stem',
        name: 'Stem & Tip (डंडी)',
        d: 'M95,235 L80,245 L90,260 L105,248 Z M310,230 L325,225 L320,240 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'हरा (Green Tip) या भूरा',
        avoidColors: 'लाल',
        hint: 'डंडी में हल्का हरा या भूरा रंग भरें!'
      }
    ]
  },

  // 20. STRAWBERRY
  {
    id: 'strawberry',
    name: 'Strawberry (रसीली स्ट्रॉबेरी)',
    emoji: '🍓',
    category: 'Fruits',
    parts: [
      {
        id: 'sb-body',
        name: 'Berry Body (स्ट्रॉबेरी फल)',
        d: 'M200,120 C140,110 110,180 130,250 C150,310 190,345 200,350 C210,345 250,310 270,250 C290,180 260,110 200,120 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'चटख लाल (Bright Red)',
        avoidColors: 'नीला, हरा',
        hint: 'स्ट्रॉबेरी में मीठा और चटख लाल रंग भरें!'
      },
      {
        id: 'sb-leaves',
        name: 'Crown Leaves (सिर की पत्तियां)',
        d: 'M200,130 C170,120 140,100 130,120 C155,135 175,135 185,140 C175,150 160,165 180,160 C190,150 198,140 200,140 C202,140 210,150 220,160 C240,165 225,150 215,140 C225,135 245,135 270,120 C260,100 230,120 200,130 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'ताज़ा हरा (Fresh Green)',
        avoidColors: 'लाल, पीला',
        hint: 'ऊपर की पत्तियों में ताज़ा हरा रंग भरें!'
      },
      {
        id: 'sb-stem',
        name: 'Stem (डंडी)',
        d: 'M195,120 L195,80 L208,80 L205,120 Z',
        recommendedColor: '#4ade80',
        recommendedName: 'हरा (Green)',
        avoidColors: 'लाल',
        hint: 'डंडी में हरा रंग भरें!'
      }
    ]
  },

  // 21. GRAPES
  {
    id: 'grapes',
    name: 'Grapes (मीठे अंगूर का गुच्छा)',
    emoji: '🍇',
    category: 'Fruits',
    parts: [
      {
        id: 'grapes-berries-top',
        name: 'Top Berries (ऊपर के अंगूर)',
        d: 'M150,150 A20,20 0 1,0 150,190 A20,20 0 1,0 150,150 Z M190,140 A20,20 0 1,0 190,180 A20,20 0 1,0 190,140 Z M230,140 A20,20 0 1,0 230,180 A20,20 0 1,0 230,140 Z M270,150 A20,20 0 1,0 270,190 A20,20 0 1,0 270,150 Z',
        recommendedColor: '#c084fc',
        recommendedName: 'बैंगनी (Purple) या हरा',
        avoidColors: 'लाल, भूरा',
        hint: 'ऊपर के अंगूरों में प्यारा बैंगनी रंग भरें!'
      },
      {
        id: 'grapes-berries-mid',
        name: 'Middle Berries (बीच के अंगूर)',
        d: 'M170,185 A20,20 0 1,0 170,225 A20,20 0 1,0 170,185 Z M210,180 A20,20 0 1,0 210,220 A20,20 0 1,0 210,180 Z M250,185 A20,20 0 1,0 250,225 A20,20 0 1,0 250,185 Z',
        recommendedColor: '#c084fc',
        recommendedName: 'बैंगनी (Purple)',
        avoidColors: 'काला',
        hint: 'बीच के अंगूरों में भी बैंगनी रंग भरें!'
      },
      {
        id: 'grapes-berries-bottom',
        name: 'Bottom Berries (नीचे के अंगूर)',
        d: 'M190,225 A20,20 0 1,0 190,265 A20,20 0 1,0 190,225 Z M230,225 A20,20 0 1,0 230,265 A20,20 0 1,0 230,225 Z M210,265 A20,20 0 1,0 210,305 A20,20 0 1,0 210,265 Z',
        recommendedColor: '#c084fc',
        recommendedName: 'बैंगनी (Purple)',
        avoidColors: 'काला',
        hint: 'नीचे के अंगूरों में भी बैंगनी रंग भरें!'
      },
      {
        id: 'grapes-leaf',
        name: 'Grape Leaf (अंगूर की पत्ती)',
        d: 'M210,90 C250,60 280,100 260,130 C230,120 220,105 210,90 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'हरा (Green)',
        avoidColors: 'लाल',
        hint: 'पत्ती में ताज़ा हरा रंग भरें!'
      },
      {
        id: 'grapes-vine',
        name: 'Vine Stem (डंडी)',
        d: 'M205,140 L205,80 C205,60 190,55 180,60',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Brown)',
        avoidColors: 'नीला',
        hint: 'डंडी में भूरा रंग भरें!'
      }
    ]
  },

  // 22. WATERMELON
  {
    id: 'watermelon',
    name: 'Watermelon (मीठा तरबूज)',
    emoji: '🍉',
    category: 'Fruits',
    parts: [
      {
        id: 'wm-rind-outer',
        name: 'Outer Green Rind (बाहरी छिलका)',
        d: 'M70,160 C90,320 310,320 330,160 L310,160 C290,295 110,295 90,160 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'गहरा हरा (Dark Green)',
        avoidColors: 'लाल, पीला',
        hint: 'छिलके के किनारे में गहरा हरा रंग भरें!'
      },
      {
        id: 'wm-rind-inner',
        name: 'Inner White Rind (सफेद परत)',
        d: 'M90,160 C110,295 290,295 310,160 L295,160 C280,280 120,280 105,160 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'हल्का सफेद / हल्का हरा',
        avoidColors: 'काला, लाल',
        hint: 'भीतरी परत में सफेद रंग भरें!'
      },
      {
        id: 'wm-flesh',
        name: 'Red Juicy Pulp (लाल रसीला गूदा)',
        d: 'M105,160 C120,280 280,280 295,160 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'चमकदार लाल (Juicy Red)',
        avoidColors: 'नीला, पीला',
        hint: 'तरबूज के अंदर मीठा लाल रंग भरें!'
      }
    ]
  },

  // 23. CARROT
  {
    id: 'carrot',
    name: 'Carrot (मीठी गाजर)',
    emoji: '🥕',
    category: 'Fruits',
    parts: [
      {
        id: 'carrot-body',
        name: 'Carrot Root (गाजर)',
        d: 'M160,150 C170,140 230,140 240,150 L205,360 C200,365 200,365 195,360 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'चटख नारंगी (Orange)',
        avoidColors: 'नीला, काला',
        hint: 'गाजर में चटख नारंगी रंग भरें!'
      },
      {
        id: 'carrot-leaves',
        name: 'Green Leaves (हरी पत्तियां)',
        d: 'M200,140 C170,80 130,90 120,110 C140,130 170,135 195,140 Z M200,140 C200,60 215,50 220,70 C215,95 210,125 205,140 Z M200,140 C230,80 270,90 280,110 C260,130 230,135 205,140 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'ताज़ा हरा (Fresh Green)',
        avoidColors: 'लाल, नारंगी',
        hint: 'गाजर की हरी पत्तियों में हरा रंग भरें!'
      }
    ]
  },

  // 24. ROCKET
  {
    id: 'rocket',
    name: 'Rocket (अंतरिक्ष रॉकेट)',
    emoji: '🚀',
    category: 'Vehicles',
    parts: [
      {
        id: 'rocket-nose',
        name: 'Nose Cone (ऊपर की चोंच)',
        d: 'M200,50 L165,130 L235,130 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Cone)',
        avoidColors: 'काला',
        hint: 'रॉकेट के टॉप पर लाल रंग भरें!'
      },
      {
        id: 'rocket-body',
        name: 'Rocket Body (रॉकेट का शरीर)',
        d: 'M165,130 L165,270 L235,270 L235,130 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White) या हल्का नीला',
        avoidColors: 'काला',
        hint: 'रॉकेट के शरीर में सफेद रंग भरें!'
      },
      {
        id: 'rocket-window',
        name: 'Porthole (गोल खिड़की)',
        d: 'M200,170 A22,22 0 1,0 200,214 A22,22 0 1,0 200,170 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Sky Blue)',
        avoidColors: 'काला',
        hint: 'खिड़की में आसमानी नीला रंग भरें!'
      },
      {
        id: 'rocket-fin-left',
        name: 'Left Fin (बायाँ विंग)',
        d: 'M165,230 L120,290 L165,280 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red)',
        avoidColors: 'सफेद',
        hint: 'बाएँ पंख में लाल रंग भरें!'
      },
      {
        id: 'rocket-fin-right',
        name: 'Right Fin (दायाँ विंग)',
        d: 'M235,230 L280,290 L235,280 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red)',
        avoidColors: 'सफेद',
        hint: 'दाएँ पंख में भी लाल रंग भरें!'
      },
      {
        id: 'rocket-fire',
        name: 'Fire Booster (आग का शोला)',
        d: 'M175,270 L200,360 L225,270 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'नारंगी (Orange Flame) या पीला',
        avoidColors: 'नीला, हरा',
        hint: 'नीचे निकलने वाली आग में नारंगी रंग भरें!'
      }
    ]
  },

  // 25. BOAT
  {
    id: 'boat',
    name: 'Sail Boat (पाल वाली नाव)',
    emoji: '⛵',
    category: 'Vehicles',
    parts: [
      {
        id: 'boat-hull',
        name: 'Boat Hull (नाव का निचला हिस्सा)',
        d: 'M100,250 L300,250 L270,310 L130,310 Z',
        recommendedColor: '#a16207',
        recommendedName: 'भूरा (Wood Brown) या लाल',
        avoidColors: 'नीला',
        hint: 'नाव के निचले हिस्से में भूरा रंग भरें!'
      },
      {
        id: 'boat-sail-large',
        name: 'Big Sail (बड़ा पाल)',
        d: 'M195,80 L195,240 L100,240 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Sail) या पीला',
        avoidColors: 'काला',
        hint: 'बड़े पाल में चमकदार लाल रंग भरें!'
      },
      {
        id: 'boat-sail-small',
        name: 'Small Sail (छोटा पाल)',
        d: 'M205,110 L205,240 L285,240 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White) या पीला',
        avoidColors: 'काला',
        hint: 'छोटे पाल में सफेद या पीला रंग भरें!'
      },
      {
        id: 'boat-water',
        name: 'Sea Waves (समुद्र की लहरें)',
        d: 'M60,320 C100,305 140,335 180,320 C220,305 260,335 300,320 C320,315 340,325 350,335 L350,360 L50,360 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Ocean Blue)',
        avoidColors: 'लाल, पीला',
        hint: 'समुद्र के पानी में सुंदर नीला रंग भरें!'
      }
    ]
  },

  // 26. AIRPLANE
  {
    id: 'airplane',
    name: 'Aeroplane (हवाई जहाज़)',
    emoji: '✈️',
    category: 'Vehicles',
    parts: [
      {
        id: 'plane-body',
        name: 'Fuselage (हवाई जहाज़ की बॉडी)',
        d: 'M60,200 C80,185 140,180 290,180 C340,180 360,195 360,200 C360,205 340,220 290,220 C140,220 80,215 60,200 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White) या आसमानी',
        avoidColors: 'काला',
        hint: 'हवाई जहाज़ की बॉडी में सफेद रंग भरें!'
      },
      {
        id: 'plane-wing-top',
        name: 'Top Wing (ऊपर का पंख)',
        d: 'M200,180 L230,90 L260,90 L240,180 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'नीला (Blue Wing)',
        avoidColors: 'काला',
        hint: 'ऊपर के पंख में नीला रंग भरें!'
      },
      {
        id: 'plane-wing-bottom',
        name: 'Bottom Wing (नीचे का पंख)',
        d: 'M200,220 L230,310 L260,310 L240,220 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'नीला (Blue Wing)',
        avoidColors: 'काला',
        hint: 'नीचे के पंख में भी नीला रंग भरें!'
      },
      {
        id: 'plane-tail',
        name: 'Tail Fin (पीछे की पूँछ)',
        d: 'M80,185 L60,120 L95,120 L115,185 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Tail)',
        avoidColors: 'काला',
        hint: 'पीछे की पूँछ में लाल रंग भरें!'
      },
      {
        id: 'plane-windows',
        name: 'Passenger Windows (खिड़कियाँ)',
        d: 'M160,195 A6,6 0 1,0 160,207 A6,6 0 1,0 160,195 Z M185,195 A6,6 0 1,0 185,207 A6,6 0 1,0 185,195 Z M210,195 A6,6 0 1,0 210,207 A6,6 0 1,0 210,195 Z M235,195 A6,6 0 1,0 235,207 A6,6 0 1,0 235,195 Z M260,195 A6,6 0 1,0 260,207 A6,6 0 1,0 260,195 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'हल्का नीला (Sky Blue)',
        avoidColors: 'काला',
        hint: 'छोटी खिड़कियों में हल्का नीला रंग भरें!'
      }
    ]
  },

  // 27. TRAIN
  {
    id: 'train',
    name: 'Choo Choo Train (छुक-छुक रेलगाड़ी)',
    emoji: '🚂',
    category: 'Vehicles',
    parts: [
      {
        id: 'train-boiler',
        name: 'Front Boiler (इंजन का बॉयलर)',
        d: 'M140,170 L280,170 L280,260 L140,260 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Engine)',
        avoidColors: 'सफेद',
        hint: 'इंजन के आगे वाले हिस्से में लाल रंग भरें!'
      },
      {
        id: 'train-cabin',
        name: 'Driver Cabin (ड्राइवर का केबिन)',
        d: 'M80,120 L140,120 L140,260 L80,260 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'नीला (Sky Blue)',
        avoidColors: 'काला',
        hint: 'ड्राइवर के केबिन में नीला रंग भरें!'
      },
      {
        id: 'train-chimney',
        name: 'Smoke Funnel (चिमनी)',
        d: 'M230,120 L260,120 L250,170 L240,170 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी या भूरा',
        avoidColors: 'सफेद',
        hint: 'धुएं की चिमनी में संतरी रंग भरें!'
      },
      {
        id: 'train-wheels',
        name: 'Wheels (पहिए)',
        d: 'M100,250 A25,25 0 1,0 150,285 A25,25 0 1,0 100,250 Z M170,255 A20,20 0 1,0 210,285 A20,20 0 1,0 170,255 Z M230,255 A20,20 0 1,0 270,285 A20,20 0 1,0 230,255 Z',
        recommendedColor: '#1e293b',
        recommendedName: 'गहरा काला / डार्क स्लेट',
        avoidColors: 'पीला',
        hint: 'पहियों में गहरा काला रंग भरें!'
      },
      {
        id: 'train-smoke',
        name: 'Smoke Puffs (धुएं के छल्ले)',
        d: 'M245,100 A15,15 0 1,0 245,70 A15,15 0 1,0 245,100 Z M270,75 A20,20 0 1,0 270,35 A20,20 0 1,0 270,75 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White Cloud)',
        avoidColors: 'काला',
        hint: 'धुएं के छल्लों में सफेद रंग भरें!'
      }
    ]
  },

  // 28. RAINBOW
  {
    id: 'rainbow',
    name: 'Rainbow (इंद्रधनुष और बादल)',
    emoji: '🌈',
    category: 'Sky',
    parts: [
      {
        id: 'rb-red',
        name: 'Red Arch (लाल पट्टी)',
        d: 'M80,240 C80,120 320,120 320,240 C290,240 290,150 200,150 C110,150 110,240 80,240 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Arch)',
        avoidColors: 'काला',
        hint: 'सबसे ऊपर की पट्टी में लाल रंग भरें!'
      },
      {
        id: 'rb-yellow',
        name: 'Yellow Arch (पीली पट्टी)',
        d: 'M110,240 C110,150 290,150 290,240 C265,240 265,175 200,175 C135,175 135,240 110,240 Z',
        recommendedColor: '#fde047',
        recommendedName: 'पीला (Yellow Arch)',
        avoidColors: 'काला',
        hint: 'बीच की पट्टी में पीला रंग भरें!'
      },
      {
        id: 'rb-blue',
        name: 'Blue Arch (नीली पट्टी)',
        d: 'M135,240 C135,175 265,175 265,240 C240,240 240,200 200,200 C160,200 160,240 135,240 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Sky Blue)',
        avoidColors: 'काला',
        hint: 'नीचे की पट्टी में नीला रंग भरें!'
      },
      {
        id: 'rb-cloud-left',
        name: 'Left Cloud (बायाँ बादल)',
        d: 'M70,260 C50,260 40,240 55,225 C50,205 75,195 90,205 C105,190 130,200 130,220 C145,230 140,260 115,260 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White Cloud)',
        avoidColors: 'काला, लाल',
        hint: 'बाएँ बादल में सफेद रंग भरें!'
      },
      {
        id: 'rb-cloud-right',
        name: 'Right Cloud (दायाँ बादल)',
        d: 'M280,260 C260,260 250,240 265,225 C260,205 285,195 300,205 C315,190 340,200 340,220 C355,230 350,260 325,260 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White Cloud)',
        avoidColors: 'काला, लाल',
        hint: 'दाएँ बादल में भी सफेद रंग भरें!'
      }
    ]
  },

  // 29. MUSHROOM
  {
    id: 'mushroom',
    name: 'Mushroom (सुंदर छतरी / कुकुरमुत्ता)',
    emoji: '🍄',
    category: 'Nature',
    parts: [
      {
        id: 'mush-cap',
        name: 'Mushroom Cap (छतरी का ऊपरी हिस्सा)',
        d: 'M90,220 C90,100 310,100 310,220 C250,240 150,240 90,220 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red Cap)',
        avoidColors: 'काला',
        hint: 'छतरी के ऊपरी हिस्से में चमकदार लाल रंग भरें!'
      },
      {
        id: 'mush-spots',
        name: 'White Spots (सफेद बिंदियां)',
        d: 'M140,160 A18,18 0 1,0 140,196 A18,18 0 1,0 140,160 Z M200,130 A20,20 0 1,0 200,170 A20,20 0 1,0 200,130 Z M260,160 A18,18 0 1,0 260,196 A18,18 0 1,0 260,160 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद (White Spots)',
        avoidColors: 'काला',
        hint: 'गोल बिंदियों में सफेद रंग भरें!'
      },
      {
        id: 'mush-stem',
        name: 'Stem (डंडी / तना)',
        d: 'M160,225 C160,330 150,340 170,350 L230,350 C250,340 240,330 240,225 Z',
        recommendedColor: '#ffffff',
        recommendedName: 'सफेद या हल्का क्रीम',
        avoidColors: 'काला, लाल',
        hint: 'नीचे के तने में सफेद या क्रीम रंग भरें!'
      },
      {
        id: 'mush-grass',
        name: 'Grass Tuft (हरी घास)',
        d: 'M120,350 L140,310 L160,350 L180,300 L200,350 L220,300 L240,350 L260,310 L280,350 Z',
        recommendedColor: '#22c55e',
        recommendedName: 'हरा (Fresh Green)',
        avoidColors: 'लाल',
        hint: 'नीचे की घास में ताज़ा हरा रंग भरें!'
      }
    ]
  },

  // 30. BIRTHDAY CAKE
  {
    id: 'cake',
    name: 'Birthday Cake (जन्मदिन केक)',
    emoji: '🎂',
    category: 'Treats',
    parts: [
      {
        id: 'cake-base',
        name: 'Bottom Layer (केक का निचला बेस)',
        d: 'M100,240 L300,240 L300,340 L100,340 Z',
        recommendedColor: '#a16207',
        recommendedName: 'चॉकलेट भूरा (Brown)',
        avoidColors: 'हरा',
        hint: 'केक के बेस में चॉकलेट भूरा रंग भरें!'
      },
      {
        id: 'cake-frosting',
        name: 'Cream Frosting (स्ट्रॉबेरी क्रीम)',
        d: 'M100,240 C120,260 140,240 160,260 C180,240 200,260 220,240 C240,260 260,240 280,260 C290,250 300,250 300,240 L300,210 L100,210 Z',
        recommendedColor: '#f472b6',
        recommendedName: 'गुलाबी (Pink Cream)',
        avoidColors: 'काला',
        hint: 'ऊपर की क्रीम में स्वादिष्ट गुलाबी रंग भरें!'
      },
      {
        id: 'cake-top-tier',
        name: 'Top Layer (ऊपरी हिस्सा)',
        d: 'M130,150 L270,150 L270,210 L130,210 Z',
        recommendedColor: '#fde047',
        recommendedName: 'वैनिला पीला (Vanilla Yellow)',
        avoidColors: 'काला',
        hint: 'ऊपर की परत में वैनिला पीला रंग भरें!'
      },
      {
        id: 'cake-candles',
        name: 'Candles (मोमबत्तियाँ)',
        d: 'M160,110 L170,110 L170,150 L160,150 Z M195,100 L205,100 L205,150 L195,150 Z M230,110 L240,110 L240,150 L230,150 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Blue Candles)',
        avoidColors: 'काला',
        hint: 'मोमबत्तियों में आसमानी नीला रंग भरें!'
      },
      {
        id: 'cake-flames',
        name: 'Candle Flames (जलती लौ)',
        d: 'M165,95 C160,105 170,105 165,95 Z M200,85 C195,95 205,95 200,85 Z M235,95 C230,105 240,105 235,95 Z',
        recommendedColor: '#fb923c',
        recommendedName: 'संतरी या पीला (Orange Flame)',
        avoidColors: 'नीला, हरा',
        hint: 'मोमबत्ती की लौ में संतरी या पीला रंग भरें!'
      }
    ]
  },

  // 31. FOOTBALL / PLAY BALL
  {
    id: 'ball',
    name: 'Ball (रंग-बिरंगी फुटबॉल)',
    emoji: '⚽',
    category: 'Treats',
    parts: [
      {
        id: 'ball-outer',
        name: 'Ball Base (गेंद का गोला)',
        d: 'M200,110 A90,90 0 1,0 200,290 A90,90 0 1,0 200,110 Z',
        recommendedColor: '#38bdf8',
        recommendedName: 'आसमानी नीला (Sky Blue)',
        avoidColors: 'काला, स्लेटी',
        hint: 'गेंद के गोल हिस्से में सुंदर नीला रंग भरें!'
      },
      {
        id: 'ball-center-patch',
        name: 'Center Star Patch (बीच का तारा पैच)',
        d: 'M200,170 L212,192 L236,192 L216,206 L224,228 L200,214 L176,228 L184,206 L164,192 L188,192 Z',
        recommendedColor: '#facc15',
        recommendedName: 'चमकदार पीला (Yellow)',
        avoidColors: 'काला, भूरा',
        hint: 'बीच के तारे जैसे पैच में चमकदार पीला रंग भरें!'
      },
      {
        id: 'ball-stripe-top',
        name: 'Top Stripe (ऊपरी पट्टी)',
        d: 'M140,150 C170,135 230,135 260,150 C240,168 160,168 140,150 Z',
        recommendedColor: '#ef4444',
        recommendedName: 'लाल (Red)',
        avoidColors: 'काला, स्लेटी',
        hint: 'ऊपरी पट्टी में प्यारा लाल रंग भरें!'
      },
      {
        id: 'ball-stripe-bottom',
        name: 'Bottom Stripe (निचली पट्टी)',
        d: 'M140,250 C170,265 230,265 260,250 C240,232 160,232 140,250 Z',
        recommendedColor: '#4ade80',
        recommendedName: 'ताज़ा हरा (Green)',
        avoidColors: 'काला, भूरा',
        hint: 'निचली पट्टी में ताज़ा हरा रंग भरें!'
      }
    ]
  }
];

// Spoken Hindi scripts for all 30 coloring sheets
export const SHEET_VOICE_SCRIPTS: Record<string, { spokenText: string; shortAdvice: string }> = {
  flower: {
    spokenText: 'नमस्ते बच्चों! चलिए इस सुंदर फूल में रंग भरते हैं। इसमें बीच वाले गोले में चमकदार पीला रंग भरें। पंखुड़ियों में प्यारा गुलाबी या लाल रंग भरें। और नीचे की हरी पत्तियों में ताज़ा हरा रंग भरें। नीचे दिए गए रंगों में से रंग चुनिए और जिस हिस्से में रंग भरना है उस पर टच कीजिए!',
    shortAdvice: 'बीच में पीला, पंखुड़ियों में गुलाबी या लाल, और पत्तियों में हरा रंग भरें!'
  },
  sun: {
    spokenText: 'आइए चमकते हुए सूरज में रंग भरते हैं! सूरज के गोल चेहरे में चमकदार पीला रंग भरें, और चारों तरफ की किरणों में सुनहरा नारंगी रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'चेहरे में चमकदार पीला और किरणों में नारंगी रंग भरें!'
  },
  cat: {
    spokenText: 'अरे वाह! चलिए इस प्यारी बिल्ली में रंग भरते हैं। बिल्ली के शरीर और चेहरे पर संतरी, भूरा या सफेद रंग भरें। कानों के अंदर और छोटी सी नाक में हल्का गुलाबी रंग भरें। नीचे से रंग चुनिए और बिल्ली के अंगों पर टच करके रंग भरिए!',
    shortAdvice: 'शरीर में संतरी या सफेद, कानों और नाक में गुलाबी रंग भरें!'
  },
  house: {
    spokenText: 'इस सुंदर घर में आपको रंग भरना है! घर की छत में लाल या नारंगी रंग भरें, दीवारों में आसमानी नीला या पीला रंग, खिड़कियों में चमकता पीला रंग, और दरवाज़े में लकड़ी जैसा भूरा रंग भरें। नीचे से रंग चुनिए और घर के हिस्सों पर टच करके भरिए!',
    shortAdvice: 'छत में लाल, दीवारों में आसमानी नीला, और दरवाज़े में भूरा रंग भरें!'
  },
  car: {
    spokenText: 'वाह, इस तेज़ कार में आपको रंग भरना है! कार की बॉडी में लाल या नीला चमकदार रंग भरें। आगे और पीछे के शीशों में हल्का आसमानी नीला रंग, और पहियों में गहरा काला रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'बॉडी में लाल या नीला, शीशों में आसमानी, और पहियों में काला रंग भरें!'
  },
  fish: {
    spokenText: 'जल की रानी मछली में आपको रंग भरना है! मछली के शरीर में सुनहरा पीला रंग, पूंछ और चेहरे में नारंगी रंग, और ऊपर के पंख में लाल रंग भरें। नीचे से रंग चुनकर मछली को रंगीन बनाइए!',
    shortAdvice: 'शरीर में पीला, पूंछ और चेहरे में नारंगी, और पर में लाल रंग भरें!'
  },
  tree: {
    spokenText: 'आइए इस हरे-भरे पेड़ में रंग भरते हैं! पेड़ की पत्तियों में गाढ़ा हरा रंग भरें, पेड़ के तने में भूरा रंग भरें, और छोटे मीठे सेबों में लाल रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'पत्तियों में हरा, तने में भूरा, और सेबों में लाल रंग भरें!'
  },
  apple: {
    spokenText: 'इस मीठे रसीले सेब में आपको रंग भरना है! पूरे सेब में चमकदार लाल रंग भरें, ऊपर की पत्ती में हरा रंग, और डंडी में भूरा रंग भरें। नीचे से रंग चुनिए और टच कीजिए!',
    shortAdvice: 'सेब में लाल, पत्ती में हरा, और डंडी में भूरा रंग भरें!'
  },
  butterfly: {
    spokenText: 'वाह, इस सुंदर तितली में आपको रंग भरना है! ऊपर के बड़े पंखों में आसमानी नीला रंग, नीचे के छोटे पंखों में गुलाबी रंग, और तितली के शरीर में बैंगनी रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'ऊपरी पंखों में आसमानी नीला, निचले पंखों में गुलाबी, और शरीर में बैंगनी रंग भरें!'
  },
  mango: {
    spokenText: 'फलों के राजा आम में आपको रंग भरना है! पके हुए आम में मीठा पीला या नारंगी रंग भरें, आम की पत्ती में हरा रंग, और डंडी में भूरा रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'आम में पीला या नारंगी, पत्ती में हरा, और डंडी में भूरा रंग भरें!'
  },
  icecream: {
    spokenText: 'यम्मी ठंडी आइसक्रीम में आपको रंग भरना है! ऊपर की चेरी में लाल रंग, स्ट्रॉबेरी स्कूप में गुलाबी रंग, नीचे के स्कूप में आसमानी नीला रंग, और कोन में सुनहरा भूरा रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'चेरी में लाल, स्कूप में गुलाबी या नीला, और कोन में भूरा रंग भरें!'
  },
  star: {
    spokenText: 'इस चमकते हुए तारे में आपको रंग भरना है! तारे के अंदर चमकीला पीला या सुनहरा रंग भरें। नीचे से रंग चुनिए और टच करके भरिए!',
    shortAdvice: 'तारे में चमकदार पीला या सुनहरा रंग भरें!'
  },
  dog: {
    spokenText: 'अरे वाह! चलिए इस प्यारे कुत्ते में रंग भरते हैं। कुत्ते के शरीर में भूरा या सफेद रंग भरें, कानों में संतरी या भूरा, और गले के पट्टे में चमकीला लाल रंग भरें। नाक में काला रंग भरें!',
    shortAdvice: 'शरीर में भूरा, कानों में संतरी, और पट्टे में लाल रंग भरें!'
  },
  duck: {
    spokenText: 'आइए इस तैरती हुई बत्तख में रंग भरते हैं! बत्तख के शरीर और सिर में चमकदार पीला रंग भरें, उसकी चोंच में संतरी रंग भरें, और नीचे पानी की लहरों में आसमानी नीला रंग भरें!',
    shortAdvice: 'बत्तख में पीला, चोंच में संतरी, और पानी में नीला रंग भरें!'
  },
  rabbit: {
    spokenText: 'नन्हे प्यारे खरगोश में आपको रंग भरना है! खरगोश के पूरे शरीर और चेहरे में सफेद रंग, कानों के अंदर हल्का गुलाबी रंग, और उसकी गाजर में संतरी रंग भरें!',
    shortAdvice: 'खरगोश में सफेद, कानों के अंदर गुलाबी, और गाजर में संतरी रंग भरें!'
  },
  elephant: {
    spokenText: 'हाथी राजा में आपको रंग भरना है! हाथी के बड़े शरीर और सूंड में आसमानी नीला या ग्रे रंग भरें, और सूप जैसे कानों में प्यारा गुलाबी या नीला रंग भरें!',
    shortAdvice: 'हाथी के शरीर में नीला या ग्रे, और कानों में गुलाबी रंग भरें!'
  },
  lion: {
    spokenText: 'जंगल के राजा शेर में आपको रंग भरना है! शेर के घने बालों में गहरा भूरा या संतरी रंग भरें, चेहरे में सुनहरा पीला रंग, और नाक में हल्का गुलाबी रंग भरें!',
    shortAdvice: 'बालों में भूरा या संतरी, और चेहरे में पीला रंग भरें!'
  },
  parrot: {
    spokenText: 'मिठ्ठू तोते में आपको रंग भरना है! तोते के पूरे शरीर में तोतिया हरा रंग, पंख में नीला या पीला रंग, और तीखी चोंच में चमकदार लाल रंग भरें!',
    shortAdvice: 'शरीर में हरा, पंख में नीला, और चोंच में लाल रंग भरें!'
  },
  banana: {
    spokenText: 'पके हुए मीठे केले में आपको रंग भरना है! केले के छिलके में चमकदार पीला रंग, अंदर के फल में सफेद, और डंडी में हल्का हरा या भूरा रंग भरें!',
    shortAdvice: 'छिलके में पीला, फल में सफेद, और डंडी में हरा रंग भरें!'
  },
  strawberry: {
    spokenText: 'रसीली स्ट्रॉबेरी में आपको रंग भरना है! पूरी स्ट्रॉबेरी में मीठा चटख लाल रंग, ऊपर की पत्तियों में ताज़ा हरा रंग भरें!',
    shortAdvice: 'स्ट्रॉबेरी में लाल, और ऊपर की पत्तियों में हरा रंग भरें!'
  },
  grapes: {
    spokenText: 'अंगूर के मीठे गुच्छे में आपको रंग भरना है! सारे गोल अंगूरों में प्यारा बैंगनी या हरा रंग भरें, और ऊपर की पत्ती में हरा रंग भरें!',
    shortAdvice: 'अंगूरों में बैंगनी, और पत्ती में हरा रंग भरें!'
  },
  watermelon: {
    spokenText: 'गर्मियों के मीठे तरबूज में आपको रंग भरना है! तरबूज के रसीले अंदरूनी हिस्से में चमकदार लाल रंग, और बाहर के छिलके में गहरा हरा रंग भरें!',
    shortAdvice: 'अंदर लाल, और छिलके में हरा रंग भरें!'
  },
  carrot: {
    spokenText: 'खरगोश की पसंदीदा गाजर में आपको रंग भरना है! गाजर में चटख नारंगी रंग, और ऊपर की हरी पत्तियों में ताज़ा हरा रंग भरें!',
    shortAdvice: 'गाजर में नारंगी, और पत्तियों में हरा रंग भरें!'
  },
  rocket: {
    spokenText: 'अंतरिक्ष में उड़ने वाले रॉकेट में आपको रंग भरना है! रॉकेट की बॉडी में सफेद, ऊपर की चोंच और पंखों में लाल, खिड़की में नीला, और नीचे की आग में नारंगी रंग भरें!',
    shortAdvice: 'बॉडी में सफेद, चोंच में लाल, खिड़की में नीला, और आग में नारंगी भरें!'
  },
  boat: {
    spokenText: 'पानी पर तैरती नाव में आपको रंग भरना है! नाव की लकड़ी में भूरा रंग, बड़े पाल में लाल रंग, छोटे पाल में सफेद, और समुद्र के पानी में नीला रंग भरें!',
    shortAdvice: 'नाव में भूरा, पाल में लाल व सफेद, और पानी में नीला रंग भरें!'
  },
  airplane: {
    spokenText: 'हवाई जहाज़ में आपको रंग भरना है! जहाज़ की बॉडी में सफेद रंग, ऊपर और नीचे के पंखों में नीला रंग, पूंछ में लाल, और खिड़कियों में आसमानी नीला रंग भरें!',
    shortAdvice: 'बॉडी में सफेद, पंखों में नीला, और पूंछ में लाल रंग भरें!'
  },
  train: {
    spokenText: 'छुक-छुक रेलगाड़ी के इंजन में आपको रंग भरना है! आगे के बॉयलर में लाल रंग, ड्राइवर के केबिन में नीला, चिमनी में संतरी, और पहियों में गहरा काला रंग भरें!',
    shortAdvice: 'इंजन में लाल, केबिन में नीला, चिमनी में संतरी, और पहियों में काला भरें!'
  },
  rainbow: {
    spokenText: 'आकाश के सुंदर इंद्रधनुष में आपको रंग भरना है! सबसे ऊपर लाल रंग, बीच में पीला रंग, नीचे नीला रंग, और दोनों बादलों में सफेद रंग भरें!',
    shortAdvice: 'ऊपर लाल, बीच में पीला, नीचे नीला, और बादलों में सफेद रंग भरें!'
  },
  mushroom: {
    spokenText: 'जंगल की सुंदर छतरी में आपको रंग भरना है! छतरी के ऊपर लाल रंग, गोल बिंदियों में सफेद रंग, तने में सफेद, और नीचे घास में हरा रंग भरें!',
    shortAdvice: 'छतरी में लाल, बिंदियों में सफेद, और घास में हरा रंग भरें!'
  },
  cake: {
    spokenText: 'यम्मी बर्थडे केक में आपको रंग भरना है! केक के बेस में चॉकलेट भूरा रंग, क्रीम में स्ट्रॉबेरी गुलाबी रंग, मोमबत्तियों में नीला, और लौ में संतरी रंग भरें!',
    shortAdvice: 'बेस में भूरा, क्रीम में गुलाबी, मोमबत्तियों में नीला, और लौ में संतरी भरें!'
  },
  ball: {
    spokenText: 'खेलने वाली रंग-बिरंगी गेंद में आपको रंग भरना है! गेंद के गोल बेस में सुंदर आसमानी नीला रंग, बीच के तारे में चमकदार पीला, और पट्टियों में लाल और हरा रंग भरें!',
    shortAdvice: 'गेंद में नीला, तारे में पीला, और पट्टियों में लाल व हरा रंग भरें!'
  }
};
