import { AlphabetItem, HindiVarnamalaItem, LessonTopic, Rhyme } from '../types';

export const ALPHABETS: AlphabetItem[] = [
  { letter: 'A', word: 'Apple', hindi: 'सेब (Seb)', phonics: 'A says æ as in Apple', emoji: '🍎', funFact: 'Apples float in water because they have 25% air inside!' },
  { letter: 'B', word: 'Ball', hindi: 'गेंद (Gend)', phonics: 'B says b as in Ball', emoji: '⚽', funFact: 'Bouncing balls are bouncy because of compressed air.' },
  { letter: 'C', word: 'Cat', hindi: 'बिल्ली (Billi)', phonics: 'C says k as in Cat', emoji: '🐱', funFact: 'Cats can make more than 100 different cute sounds.' },
  { letter: 'D', word: 'Dog', hindi: 'कुत्ता (Kutta)', phonics: 'D says d as in Dog', emoji: '🐶', funFact: 'Dogs are super friendly and have an amazing nose.' },
  { letter: 'E', word: 'Elephant', hindi: 'हाथी (Haathi)', phonics: 'E says e as in Elephant', emoji: '🐘', funFact: 'Elephants are the biggest gentle giants on land!' },
  { letter: 'F', word: 'Fish', hindi: 'मछली (Machhli)', phonics: 'F says f as in Fish', emoji: '🐠', funFact: 'Fish breathe underwater using their gills.' },
  { letter: 'G', word: 'Giraffe', hindi: 'जिराफ़ (Giraffe)', phonics: 'G says g as in Giraffe', emoji: '🦒', funFact: 'Giraffes have the longest neck in the world.' },
  { letter: 'H', word: 'Horse', hindi: 'घोड़ा (Ghoda)', phonics: 'H says h as in Horse', emoji: '🐴', funFact: 'Horses can run very fast and sleep standing up!' },
  { letter: 'I', word: 'Ice Cream', hindi: 'आइसक्रीम (Ice cream)', phonics: 'I says ai as in Ice Cream', emoji: '🍦', funFact: 'Ice cream is sweet, cold, and yummy on sunny days!' },
  { letter: 'J', word: 'Joker', hindi: 'जोकर (Joker)', phonics: 'J says j as in Joker', emoji: '🃏', funFact: 'Jokers make everyone smile with magic and funny tricks.' },
  { letter: 'K', word: 'Kite', hindi: 'पतंग (Patang)', phonics: 'K says k as in Kite', emoji: '🪁', funFact: 'Kites dance high in the sky with the wind.' },
  { letter: 'L', word: 'Lion', hindi: 'शेर (Sher)', phonics: 'L says l as in Lion', emoji: '🦁', funFact: 'The lion is known as the brave King of the Jungle!' },
  { letter: 'M', word: 'Mango', hindi: 'आम (Aam)', phonics: 'M says m as in Mango', emoji: '🥭', funFact: 'Mango is the delicious King of Fruits in India!' },
  { letter: 'N', word: 'Nest', hindi: 'घोंसला (Ghosla)', phonics: 'N says n as in Nest', emoji: '🪺', funFact: 'Mommy birds make cozy warm nests for baby eggs.' },
  { letter: 'O', word: 'Owl', hindi: 'उल्लू (Ullu)', phonics: 'O says o as in Owl', emoji: '🦉', funFact: 'Owls are wise night birds with big round eyes.' },
  { letter: 'P', word: 'Peacock', hindi: 'मोर (Mor)', phonics: 'P says p as in Peacock', emoji: '🦚', funFact: 'The peacock is India’s national bird and dances in the rain!' },
  { letter: 'Q', word: 'Queen', hindi: 'रानी (Rani)', phonics: 'Q says kw as in Queen', emoji: '👑', funFact: 'Queens wear glittering crowns with jewels.' },
  { letter: 'R', word: 'Rabbit', hindi: 'खरगोश (Khargosh)', phonics: 'R says r as in Rabbit', emoji: '🐰', funFact: 'Rabbits have soft long ears and love crunchy carrots!' },
  { letter: 'S', word: 'Sun', hindi: 'सूरज (Suraj)', phonics: 'S says s as in Sun', emoji: '☀️', funFact: 'The bright golden Sun gives light and life to Earth.' },
  { letter: 'T', word: 'Tiger', hindi: 'बाघ (Bagh)', phonics: 'T says t as in Tiger', emoji: '🐯', funFact: 'The tiger is the proud national animal of India!' },
  { letter: 'U', word: 'Umbrella', hindi: 'छाता (Chhata)', phonics: 'U says u as in Umbrella', emoji: '☂️', funFact: 'Umbrellas protect us from raindrops and hot sunlight.' },
  { letter: 'V', word: 'Van', hindi: 'गाड़ी (Gaadi)', phonics: 'V says v as in Van', emoji: '🚐', funFact: 'The bright yellow school van takes children to school.' },
  { letter: 'W', word: 'Watermelon', hindi: 'तरबूज (Tarbooj)', phonics: 'W says w as in Watermelon', emoji: '🍉', funFact: 'Watermelon is full of sweet, refreshing red juice!' },
  { letter: 'X', word: 'Xylophone', hindi: 'जाइलोफ़ोन (Xylophone)', phonics: 'X says z as in Xylophone', emoji: '🪵', funFact: 'Tapping rainbow bars on a xylophone creates cheerful music.' },
  { letter: 'Y', word: 'Yak', hindi: 'याक (Yak)', phonics: 'Y says y as in Yak', emoji: '🐂', funFact: 'Yaks have thick warm fur to live on snowy mountains.' },
  { letter: 'Z', word: 'Zebra', hindi: 'ज़ेब्रा (Zebra)', phonics: 'Z says z as in Zebra', emoji: '🦓', funFact: 'Zebras have beautiful black and white stripes.' },
];

export const HINDI_VARNAMALA: HindiVarnamalaItem[] = [
  { letter: 'अ', word: 'अनार (Anar)', meaning: 'Pomegranate', emoji: '🍎' },
  { letter: 'आ', word: 'आम (Aam)', meaning: 'Mango', emoji: '🥭' },
  { letter: 'इ', word: 'इमली (Imli)', meaning: 'Tamarind', emoji: '🟤' },
  { letter: 'ई', word: 'ईख (Eekh)', meaning: 'Sugarcane', emoji: '🎋' },
  { letter: 'उ', word: 'उल्लू (Ullu)', meaning: 'Owl', emoji: '🦉' },
  { letter: 'ऊ', word: 'ऊन (Oon)', meaning: 'Wool', emoji: '🧶' },
  { letter: 'ऋ', word: 'ऋषि (Rishi)', meaning: 'Sage', emoji: '🧘' },
  { letter: 'ए', word: 'एड़ी (Aedi)', meaning: 'Heel', emoji: '🦶' },
  { letter: 'ऐ', word: 'ऐनक (Ainak)', meaning: 'Spectacles', emoji: '👓' },
  { letter: 'ओ', word: 'ओखली (Okhli)', meaning: 'Mortar', emoji: '🥣' },
  { letter: 'औ', word: 'औरत (Aurat)', meaning: 'Woman', emoji: '👩' },
  { letter: 'अं', word: 'अंगूर (Angoor)', meaning: 'Grapes', emoji: '🍇' },
  { letter: 'क', word: 'कमल (Kamal)', meaning: 'Lotus', emoji: '🪷' },
  { letter: 'ख', word: 'खरगोश (Khargosh)', meaning: 'Rabbit', emoji: '🐰' },
  { letter: 'ग', word: 'गमला (Gamla)', meaning: 'Flowerpot', emoji: '🪴' },
  { letter: 'घ', word: 'घर (Ghar)', meaning: 'Home', emoji: '🏠' },
  { letter: 'च', word: 'चम्मच (Chammach)', meaning: 'Spoon', emoji: '🥄' },
  { letter: 'छ', word: 'छतरी (Chhatri)', meaning: 'Umbrella', emoji: '☂️' },
  { letter: 'ज', word: 'जहाज (Jahaaj)', meaning: 'Ship', emoji: '🚢' },
  { letter: 'झ', word: 'झंडा (Jhanda)', meaning: 'Flag', emoji: '🇮🇳' },
  { letter: 'ट', word: 'टमाटर (Tamatar)', meaning: 'Tomato', emoji: '🍅' },
  { letter: 'ठ', word: 'ठठेरा (Thathera)', meaning: 'Tinker', emoji: '🔨' },
  { letter: 'ड', word: 'डमरू (Damru)', meaning: 'Small Drum', emoji: '🪘' },
  { letter: 'ढ', word: 'ढोलक (Dholak)', meaning: 'Drum', emoji: '🥁' },
  { letter: 'त', word: 'तितली (Titli)', meaning: 'Butterfly', emoji: '🦋' },
  { letter: 'थ', word: 'थाली (Thaali)', meaning: 'Plate', emoji: '🍽️' },
  { letter: 'द', word: 'दवात (Dawaat)', meaning: 'Inkpot', emoji: '🖋️' },
  { letter: 'ध', word: 'धनुष (Dhanush)', meaning: 'Bow', emoji: '🏹' },
  { letter: 'न', word: 'नल (Nal)', meaning: 'Tap', emoji: '🚰' },
  { letter: 'प', word: 'पतंग (Patang)', meaning: 'Kite', emoji: '🪁' },
  { letter: 'फ', word: 'फल (Phal)', meaning: 'Fruits', emoji: '🍎' },
  { letter: 'ब', word: 'बतख (Batakh)', meaning: 'Duck', emoji: '🦆' },
  { letter: 'भ', word: 'भालू (Bhaalu)', meaning: 'Bear', emoji: '🐻' },
  { letter: 'म', word: 'मछली (Machhli)', meaning: 'Fish', emoji: '🐟' },
  { letter: 'य', word: 'यज्ञ (Yagya)', meaning: 'Holy Fire', emoji: '🔥' },
  { letter: 'र', word: 'रथ (Rath)', meaning: 'Chariot', emoji: '🛒' },
  { letter: 'ल', word: 'लट्टू (Lattoo)', meaning: 'Top Toy', emoji: '🪀' },
  { letter: 'व', word: 'वक (Vak)', meaning: 'Crane', emoji: '🦩' },
  { letter: 'श', word: 'शलजम (Shaljam)', meaning: 'Turnip', emoji: '🧅' },
  { letter: 'स', word: 'सपेरा (Sapera)', meaning: 'Snake Charmer', emoji: '🐍' },
  { letter: 'ह', word: 'हाथी (Haathi)', meaning: 'Elephant', emoji: '🐘' },
];

export const RHYMES_LIST: Rhyme[] = [
  {
    id: 'rhyme-1',
    title: 'Twinkle Twinkle Little Star',
    language: 'English',
    emoji: '⭐',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!'
    ],
    funFact: 'Stars twinkle because their light travels through Earth’s moving atmosphere!'
  },
  {
    id: 'rhyme-2',
    title: 'मछली जल की रानी है (Machhli Jal Ki Rani)',
    language: 'Hindi',
    emoji: '🐟',
    lyrics: [
      'मछली जल की रानी है,',
      'जीवन उसका पानी है।',
      'हाथ लगाओ तो डर जाएगी,',
      'बाहर निकालो तो मर जाएगी।',
      'पानी में डालो तो तैर जाएगी!'
    ],
    funFact: 'मछलियां अपनी गलफड़ों (gills) से पानी के अंदर सांस लेती हैं!'
  },
  {
    id: 'rhyme-3',
    title: 'Wheels on the Bus',
    language: 'English',
    emoji: '🚌',
    lyrics: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round!',
      'The wipers on the bus go Swish, swish, swish,',
      'All through the town!',
      'The horn on the bus goes Beep, beep, beep,',
      'All through the town!'
    ],
    funFact: 'Singing nursery rhymes helps little kids learn rhythm and word memory!'
  },
  {
    id: 'rhyme-4',
    title: 'चंदा मामा दूर के (Chanda Mama Door Ke)',
    language: 'Hindi',
    emoji: '🌙',
    lyrics: [
      'चंदा मामा दूर के,',
      'पुए पकाएं बूर के।',
      'आप खाएं थाली में,',
      'मुन्ने को दें प्याली में।',
      'प्याली गई टूट, मुन्ना गया रूठ!',
      'लाएंगे नई प्यालियां, बजाएंगे तालियां!'
    ],
    funFact: 'चांद पृथ्वी का एकमात्र प्राकृतिक उपग्रह (natural satellite) है!'
  }
];

export const LESSONS_BY_GRADE: LessonTopic[] = [
  // --- UKG ---
  {
    id: 'ukg-1',
    grade: 'UKG',
    subject: 'Phonics & Words',
    title: 'Magic Vowels: A, E, I, O, U',
    emoji: '🔤',
    summary: 'Discover the 5 magical vowel sounds that live inside almost every English word!',
    content: [
      'The 5 special vowels are: A, E, I, O, and U.',
      'A is in C-A-T (Cat) 🐱 and B-A-T (Bat) 🦇.',
      'E is in B-E-D (Bed) 🛏️ and H-E-N (Hen) 🐔.',
      'I is in P-I-N (Pin) 📌 and F-I-S-H (Fish) 🐟.',
      'O is in D-O-G (Dog) 🐶 and B-O-X (Box) 📦.',
      'U is in S-U-N (Sun) ☀️ and C-U-P (Cup) ☕.'
    ],
    example: 'Try saying C-A-T slowly: /k/ /æ/ /t/ = CAT!',
    audioPrompt: 'Hello little learner! The five magical vowels are A, E, I, O, and U. Every word loves having a vowel friend!'
  },
  {
    id: 'ukg-2',
    grade: 'UKG',
    subject: 'Mathematics',
    title: 'Numbers 1 to 20 & Fun Counting',
    emoji: '🔢',
    summary: 'Count from 1 to 20 with friendly animal friends and colorful balloons!',
    content: [
      '1 One Sun ☀️',
      '2 Two Eyes 👀',
      '3 Three Wheels on an Auto 🛺',
      '4 Four Legs on a Chair 🪑',
      '5 Five Fingers on one hand 🖐️',
      '10 Ten toes on our happy feet! 🦶'
    ],
    example: 'If you have 2 apples 🍎🍎 and get 1 more 🍎, you have 3 apples in total!',
    audioPrompt: 'Let us count together: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, and Ten! Super job!'
  },
  {
    id: 'ukg-3',
    grade: 'UKG',
    subject: 'Science & Nature',
    title: 'Colors & Shapes in Our World',
    emoji: '🎨',
    summary: 'Identify Red, Blue, Green, Yellow, and Circles, Squares, Triangles!',
    content: [
      '🔴 Red like a juicy ripe apple.',
      '🔵 Blue like the endless sky.',
      '🟢 Green like fresh tree leaves.',
      '🟡 Yellow like the warm shining sun.',
      '⭕ Circle is round like a ball.',
      '🔺 Triangle has 3 sharp corners like a slice of pizza.'
    ],
    example: 'Look around your room! Can you find something shaped like a round circle?',
    audioPrompt: 'Red, yellow, green, and blue! Circles are round, and triangles have three sides. What color is your favorite shirt?'
  },

  // --- Class 1 ---
  {
    id: 'c1-1',
    grade: 'Class 1',
    subject: 'Mathematics',
    title: 'Addition & Subtraction Adventures',
    emoji: '➕',
    summary: 'Learn putting things together (Addition +) and taking away (Subtraction -).',
    content: [
      'Addition means joining groups: 3 + 2 = 5.',
      'Subtraction means taking away: 5 - 2 = 3.',
      'Adding 0 to any number leaves the number unchanged: 7 + 0 = 7.',
      'When you subtract a number from itself, you get zero: 4 - 4 = 0.'
    ],
    example: 'Rohan has 4 toy cars 🚗🚗🚗🚗. His sister gives him 3 more 🚗🚗🚗. Now Rohan has 4 + 3 = 7 cars!',
    audioPrompt: 'Welcome to Class 1 Math! Addition is like bringing friends together, and subtraction is sharing your candies with a friend.'
  },
  {
    id: 'c1-2',
    grade: 'Class 1',
    subject: 'Science & Nature',
    title: 'Living vs Non-Living Things',
    emoji: '🌱',
    summary: 'Discover what makes plants and animals alive compared to rocks and toys.',
    content: [
      'Living Things: breathe air, need food & water, grow bigger, and can move. (Trees, Dogs, Birds, Humans)',
      'Non-Living Things: do not eat food, do not breathe, and do not grow by themselves. (Pencils, Tables, Cars, Rocks)'
    ],
    example: 'A little puppy grows into a big dog 🐶. But a toy plastic car stays the same size forever!',
    audioPrompt: 'Living things grow, eat food, and breathe fresh air! Can a stone eat an apple? No, a stone is non-living!'
  },
  {
    id: 'c1-3',
    grade: 'Class 1',
    subject: 'English & Grammar',
    title: 'Naming Words (Nouns) & Pronouns',
    emoji: '🏷️',
    summary: 'Names of people, places, animals, and things around us.',
    content: [
      'A Noun is the name of a Person (Teacher, Doctor), Place (School, Park), Animal (Tiger, Parrot), or Thing (Book, Ball).',
      'Pronouns like He, She, It, and They are friendly words that stand in place of names.'
    ],
    example: 'Rahul is reading. -> "Rahul" is a person noun. "Book" is a thing noun.',
    audioPrompt: 'Everything in this big beautiful world has a name! Names of people, cute animals, and yummy fruits are all Nouns!'
  },

  // --- Class 2 ---
  {
    id: 'c2-1',
    grade: 'Class 2',
    subject: 'Mathematics',
    title: 'Multiplication Tables (2 to 10 Pahade)',
    emoji: '✖️',
    summary: 'Multiplication is super-fast repeated addition! Learn 2x, 3x, 4x, 5x tables.',
    content: [
      '2 x 1 = 2,  2 x 2 = 4,  2 x 3 = 6,  2 x 4 = 8,  2 x 5 = 10',
      '3 x 1 = 3,  3 x 2 = 6,  3 x 3 = 9,  3 x 4 = 12, 3 x 5 = 15',
      '5 x 1 = 5,  5 x 2 = 10, 5 x 3 = 15, 5 x 4 = 20, 5 x 5 = 25',
      '10 x 1 = 10, 10 x 5 = 50, 10 x 10 = 100!'
    ],
    example: '4 baskets with 3 apples each = 3 + 3 + 3 + 3 = 4 x 3 = 12 apples!',
    audioPrompt: 'Multiplication is like a math superpower! Instead of adding three times, you just multiply: 3 times 4 is 12!'
  },
  {
    id: 'c2-2',
    grade: 'Class 2',
    subject: 'Science & Nature',
    title: 'Parts of a Plant & Photosynthesis Basics',
    emoji: '🌿',
    summary: 'Explore Roots, Stems, Leaves, Flowers, and Fruits of green plants.',
    content: [
      'Roots: Absorb water and minerals from the deep soil.',
      'Stem: Acts like a strong elevator carrying water up to branches.',
      'Leaves: The kitchen of the plant! They use sunlight, water, and air to cook green food.',
      'Flowers & Fruits: Hold precious seeds to grow brand new baby plants.'
    ],
    example: 'Leaves are green because of a magic helper called Chlorophyll!',
    audioPrompt: 'Did you know green leaves are like a plant’s little kitchen? They use golden sunshine to make tasty food!'
  },
  {
    id: 'c2-3',
    grade: 'Class 2',
    subject: 'General Knowledge',
    title: 'Our Beautiful Planet & India Symbols',
    emoji: '🇮🇳',
    summary: 'National Flag (Tiranga), National Animal, National Bird, and Oceans.',
    content: [
      'National Flag: Tiranga with Saffron (bravery), White (peace), Green (prosperity), and Ashok Chakra (24 spokes).',
      'National Animal: Royal Bengal Tiger 🐯',
      'National Bird: Indian Peacock 🦚',
      'National Flower: Lotus 🪷',
      'National River: Holy Ganga 🌊'
    ],
    example: 'Ashoka Chakra has 24 blue spokes symbolizing constant progress and duty.',
    audioPrompt: 'India’s national flag has three vibrant colors: Saffron, White, and Green, with the blue Ashoka Chakra in the center!'
  },

  // --- Class 3 ---
  {
    id: 'c3-1',
    grade: 'Class 3',
    subject: 'Mathematics',
    title: 'Multiplication & Division Word Problems',
    emoji: '➗',
    summary: 'Equal sharing with division and fast grouping with multiplication.',
    content: [
      'Division is equal distribution: 20 divided by 4 = 5.',
      'Dividend = (Divisor x Quotient) + Remainder.',
      'Multiplication and Division are opposites: 6 x 7 = 42, and 42 ÷ 7 = 6.'
    ],
    example: 'A mother has 24 crayons to share equally among 6 children. Each child receives 24 ÷ 6 = 4 crayons!',
    audioPrompt: 'Division simply means sharing equally with your best friends so everyone gets the exact same amount!'
  },
  {
    id: 'c3-2',
    grade: 'Class 3',
    subject: 'Science & Nature',
    title: 'Our Solar System & The 8 Planets',
    emoji: '🪐',
    summary: 'Journey from Sun to Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
    content: [
      'Sun: The massive shining star at the center of our solar system.',
      'Mercury: The smallest planet closest to the burning Sun.',
      'Venus: The hottest and brightest morning/evening star.',
      'Earth: Our blue planet with water, air, and life!',
      'Mars: The mysterious Red Planet with giant volcanoes.',
      'Jupiter: The biggest planet with a great red spot.',
      'Saturn: Famous for its glorious sparkling rings made of ice.'
    ],
    example: 'Remember the order: "My Very Educated Mother Just Served Us Noodles!"',
    audioPrompt: 'Put on your astronaut helmet! There are eight amazing planets orbiting the Sun. Earth is our blue oasis where we live!'
  },
  {
    id: 'c3-3',
    grade: 'Class 3',
    subject: 'English & Grammar',
    title: 'Action Words (Verbs) & Describing Words (Adjectives)',
    emoji: '🏃',
    summary: 'Verbs tell what someone is doing (jump, write, smile). Adjectives describe nouns (tall, sweet, bright).',
    content: [
      'Verbs: Run, Play, Sing, Read, Dance, Sleep.',
      'Adjectives: Big elephant, Sweet mango, Shiny star, Brave knight.',
      'Adverbs: Describe how actions happen (happily, quickly, loudly).'
    ],
    example: '"The clever fox jumped quickly." -> "Clever" is an Adjective, "jumped" is a Verb, "quickly" is an Adverb!',
    audioPrompt: 'Verbs are full of action and movement, while Adjectives paint colorful pictures with words!'
  },

  // --- Class 4 ---
  {
    id: 'c4-1',
    grade: 'Class 4',
    subject: 'Mathematics',
    title: 'Fractions, Decimals & Geometry Angles',
    emoji: '📐',
    summary: 'Parts of a whole (1/2, 1/4, 3/4), Acute, Right (90°), and Obtuse Angles.',
    content: [
      'Fractions have a Numerator (top) and a Denominator (bottom).',
      '1/2 is half, 1/4 is one quarter, 2/4 is equal to 1/2.',
      'A Right Angle is exactly 90 degrees like the corner of your notebook.',
      'An Acute Angle is smaller than 90°, and an Obtuse Angle is larger than 90°.'
    ],
    example: 'Cut a round pizza into 4 slices. If you eat 1 slice, you ate 1/4 of the pizza, leaving 3/4 remaining!',
    audioPrompt: 'Fractions are pieces of a delicious pie! When you slice an apple in half, each piece is one over two.'
  },
  {
    id: 'c4-2',
    grade: 'Class 4',
    subject: 'Science & Nature',
    title: 'States of Matter: Solid, Liquid & Gas',
    emoji: '🧊',
    summary: 'How water transforms from ice (Solid) to water (Liquid) to steam (Gas).',
    content: [
      'Solids: Have a definite shape and volume. (Wood, Ice, Rock)',
      'Liquids: Have a fixed volume but take the shape of any container. (Water, Milk, Juice)',
      'Gases: Have no fixed shape or volume; they expand freely. (Air, Steam, Helium in balloons)',
      'Water Cycle: Evaporation ➡️ Condensation ➡️ Precipitation (Rain).'
    ],
    example: 'Ice melts into water at 0°C, and water boils into steam at 100°C!',
    audioPrompt: 'Matter is everything around us! Ice is solid, water is liquid, and water vapor in clouds is a gas!'
  },

  // --- Class 5 ---
  {
    id: 'c5-1',
    grade: 'Class 5',
    subject: 'Mathematics',
    title: 'Percentages, Decimals & Area/Perimeter',
    emoji: '📊',
    summary: 'Percentages (out of 100), Decimal point math, and Calculating Rectangle Area (L x B).',
    content: [
      'Percent means "per hundred": 50% = 50/100 = 0.5 = 1/2.',
      'Area of a Rectangle = Length × Breadth (Square units).',
      'Perimeter = Distance all the way around the outside edge.',
      'HCF (Highest Common Factor) & LCM (Lowest Common Multiple).'
    ],
    example: 'A garden is 10 meters long and 5 meters wide. Area = 10 x 5 = 50 square meters!',
    audioPrompt: 'Class 5 math opens the doors to real-world calculations like calculating percentages on exam marks and finding room areas!'
  },
  {
    id: 'c5-2',
    grade: 'Class 5',
    subject: 'Science & Nature',
    title: 'Human Body Systems & Organs',
    emoji: '🫀',
    summary: 'The Circulatory (Heart), Respiratory (Lungs), Nervous (Brain), and Digestive Systems.',
    content: [
      'Brain: The master computer of the body controlling thoughts and memory.',
      'Heart: Powerful muscular pump beating ~72 times per minute to circulate oxygenated blood.',
      'Lungs: Expand and contract to take in oxygen (O2) and release carbon dioxide (CO2).',
      'Stomach & Intestines: Break down food into energy nutrients for muscles.'
    ],
    example: 'Your heart beats around 100,000 times every single day without taking a break!',
    audioPrompt: 'Your body is an incredible biological wonder machine! Your heart pumps blood, lungs breathe fresh oxygen, and brain thinks bright ideas!'
  },
  {
    id: 'c5-3',
    grade: 'Class 5',
    subject: 'General Knowledge',
    title: 'World Wonders & Famous Inventions',
    emoji: '🌍',
    summary: 'Taj Mahal, Great Wall of China, Inventions like the Telephone, Airplane, and Computer.',
    content: [
      'Taj Mahal: Magnificent white marble wonder located in Agra, India.',
      'Great Wall of China: Longest wall built in ancient history stretching thousands of kilometers.',
      'Airplane: Invented by Wright Brothers in 1903.',
      'Telephone: Invented by Alexander Graham Bell.',
      'Gravity: Formulated by Sir Isaac Newton when an apple fell from a tree.'
    ],
    example: 'The Earth has 7 continents (Asia, Africa, North America, South America, Antarctica, Europe, Australia) and 5 vast oceans!',
    audioPrompt: 'The world is full of magnificent wonders! From the Taj Mahal to astronauts exploring outer space, human curiosity knows no bounds.'
  }
];
