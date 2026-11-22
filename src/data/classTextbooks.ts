import { GradeLevel } from '../types';

export interface TextbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  topic: string;
  summary: string;
  textbookExcerpt: string; // What is written in the textbook
  explanation: string; // Friendly line-by-line breakdown
  wordMeanings: Array<{ word: string; meaning: string; hindiMeaning?: string }>;
  writingPracticeWord: string; // Word to practice writing on board
  weeklyDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  dailyQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface ClassTextbook {
  id: string;
  grade: GradeLevel;
  subject: 'Hindi' | 'English' | 'Mathematics' | 'Science & EVS' | 'General Knowledge';
  bookName: string;
  board: 'NCERT' | 'State Board';
  coverEmoji: string;
  description: string;
  chapters: TextbookChapter[];
}

export const CLASS_TEXTBOOKS: ClassTextbook[] = [
  // ==========================================
  // CLASS 1 TEXTBOOKS
  // ==========================================
  {
    id: 'c1-hindi',
    grade: 'Class 1',
    subject: 'Hindi',
    bookName: 'रिमझिम / सारंगी (Class 1 Hindi)',
    board: 'NCERT',
    coverEmoji: '📖',
    description: 'कक्षा 1 की हिंदी पाठ्यपुस्तक: झूला, आम की टोकरी, चार चने, पतंग और पकौड़ी की सुंदर कविताएं और कहानियां।',
    chapters: [
      {
        id: 'c1-h-ch1',
        chapterNumber: 1,
        title: 'झूला (Jhoola)',
        hindiTitle: 'पाठ 1: झूला',
        topic: 'कविता (Poem)',
        summary: 'बच्चा अपनी अम्मा से पेड़ पर झूला लगाने की प्रार्थना करता है ताकि वह आसमान को छू सके।',
        textbookExcerpt: `अम्मा आज लगा दे झूला,
इस झूले पर मैं झूलूँगा।
इस पर चढ़कर, ऊपर बढ़कर,
आसमान को मैं छू लूँगा।
झूला झूल रही है डाली,
झूल रहा है पत्ता-पत्ता।
इस झूले पर बड़ा मज़ा है,
चल दिल्ली, ले चल कलकत्ता!`,
        explanation: 'इस पाठ में एक प्यारा बच्चा अपनी माँ (अम्मा) से कहता है कि मेरे लिए एक झूला लगा दो। झूले पर बैठकर वह इतना ऊँचा उड़ना चाहता है कि आसमान छू ले। पेड़ की हर डाली और पत्ता भी हवा में झूलते लगते हैं।',
        wordMeanings: [
          { word: 'अम्मा (Amma)', meaning: 'Mother / माँ' },
          { word: 'झूला (Jhoola)', meaning: 'Swing' },
          { word: 'आसमान (Aasman)', meaning: 'Sky / गगन' },
          { word: 'डाली (Daali)', meaning: 'Branch of a tree / शाखा' }
        ],
        writingPracticeWord: 'झूला',
        weeklyDay: 'Monday',
        dailyQuestions: [
          {
            question: 'बच्चा अपनी अम्मा से क्या लगाने के लिए कहता है?',
            options: ['झूला', 'खिलौना', 'पंखा', 'पलंग'],
            correctIndex: 0,
            explanation: 'कविता में बच्चा कहता है: अम्मा आज लगा दे झूला!'
          },
          {
            question: 'बच्चा झूले पर चढ़कर किसे छूना चाहता है?',
            options: ['सूरज को', 'आसमान को', 'चाँद को', 'बादल को'],
            correctIndex: 1,
            explanation: 'बच्चा कहता है: इस पर चढ़कर, ऊपर बढ़कर, आसमान को मैं छू लूँगा।'
          }
        ]
      },
      {
        id: 'c1-h-ch2',
        chapterNumber: 2,
        title: 'आम की टोकरी (Aam Ki Tokri)',
        hindiTitle: 'पाठ 2: आम की टोकरी',
        topic: 'कविता (Poem)',
        summary: 'छह साल की छोटी छोकरी सिर पर आम की टोकरी रखकर आम बेचती है।',
        textbookExcerpt: `छह साल की छोकरी,
भरकर लाई टोकरी।
टोकरी में आम हैं,
नहीं बताती दाम है।
दिखा-दिखा कर टोकरी,
हमें बुलाती छोकरी।
हमको देती आम है,
नहीं पूछती नाम है।
नाम नहीं अब पूछना,
हमें आम है चूसना!`,
        explanation: 'छह साल की नन्ही बच्ची मीठे-मीठे रसीले आम टोकरी में भरकर लाती है। वह सबको आम देती है और कोई नाम नहीं पूछती। बच्चों को बस मीठे आम खाने का मज़ा लेना है!',
        wordMeanings: [
          { word: 'छोकरी (Chhokri)', meaning: 'Little Girl / नन्ही लड़की' },
          { word: 'टोकरी (Tokri)', meaning: 'Basket' },
          { word: 'दाम (Daam)', meaning: 'Price / कीमत' },
          { word: 'आम (Aam)', meaning: 'Mango / फलों का राजा' }
        ],
        writingPracticeWord: 'आम',
        weeklyDay: 'Tuesday',
        dailyQuestions: [
          {
            question: 'टोकरी लाने वाली छोकरी कितने साल की है?',
            options: ['पाँच साल', 'छह साल', 'सात साल', 'दस साल'],
            correctIndex: 1,
            explanation: 'कविता की पहली पंक्ति में लिखा है: छह साल की छोकरी।'
          },
          {
            question: 'छोकरी की टोकरी में क्या भरा हुआ है?',
            options: ['सेब', 'अंगूर', 'आम', 'केले'],
            correctIndex: 2,
            explanation: 'टोकरी में मीठे-मीठे आम भरे हुए हैं।'
          }
        ]
      },
      {
        id: 'c1-h-ch3',
        chapterNumber: 3,
        title: 'पतंग (Patang)',
        hindiTitle: 'पाठ 3: पतंग',
        topic: 'कविता (Poem)',
        summary: 'आसमान में सर-सर उड़ती पतंग और हवा में उसकी सैर।',
        textbookExcerpt: `सर-सर सर-सर उड़ी पतंग,
फर-फर फर-फर उड़ी पतंग।
इसको काटा, उसको काटा,
खूब लगाया सैर-सपाटा।
अब लड़ने में जुटी पतंग,
अरे कट गई, लुटी पतंग!
सर-सर सर-सर उड़ी पतंग!`,
        explanation: 'पतंग हवा में सर-सर फर-फर करते हुए ऊपर आसमान में उड़ती है। हवा में सैर सपाटा करते हुए दूसरी पतंगों से पेंच लड़ाती है और अंत में कट कर नीचे आती है।',
        wordMeanings: [
          { word: 'पतंग (Patang)', meaning: 'Kite' },
          { word: 'सैर-सपाटा (Sair-Sapata)', meaning: 'Wandering / Fun Walk' },
          { word: 'लड़ना (Ladhna)', meaning: 'Entangling strings in sky' }
        ],
        writingPracticeWord: 'पतंग',
        weeklyDay: 'Wednesday',
        dailyQuestions: [
          {
            question: 'पतंग आसमान में कैसे उड़ती है?',
            options: ['धीमे-धीमे', 'सर-सर, फर-फर', 'गुन-गुन', 'छुक-छुक'],
            correctIndex: 1,
            explanation: 'कविता में लिखा है: सर-सर सर-सर उड़ी पतंग, फर-फर फर-फर उड़ी पतंग।'
          }
        ]
      }
    ]
  },
  {
    id: 'c1-english',
    grade: 'Class 1',
    subject: 'English',
    bookName: 'मृदंग / Marigold (Class 1 English)',
    board: 'NCERT',
    coverEmoji: '📘',
    description: 'Class 1 English: Unit 1 A Happy Child, Three Little Pigs, After a Bath, and Phonics stories.',
    chapters: [
      {
        id: 'c1-e-ch1',
        chapterNumber: 1,
        title: 'A Happy Child',
        topic: 'Poem',
        summary: 'A joyful poem about a child who lives in a red house and laughs all day under the green tree.',
        textbookExcerpt: `My house is red - a little house;
A happy child am I.
I laugh and play the whole day long,
I hardly ever cry.
I have a tree, a green, green tree,
To shade me from the sun;
And under it I often sit,
When all my play is done.`,
        explanation: 'In this poem, the child is very happy and cheerful. Their home is cute and red. Outside the house, a big green leafy tree gives cool shade from the bright sun.',
        wordMeanings: [
          { word: 'Happy', meaning: 'Joyful, smiling / खुश' },
          { word: 'Hardly', meaning: 'Rarely, almost never / कभी नहीं' },
          { word: 'Shade', meaning: 'Cool shelter from sun / छाया' },
          { word: 'Cry', meaning: 'To shed tears / रोना' }
        ],
        writingPracticeWord: 'HAPPY',
        weeklyDay: 'Thursday',
        dailyQuestions: [
          {
            question: 'What color is the happy child’s house?',
            options: ['Blue', 'Red', 'Yellow', 'Green'],
            correctIndex: 1,
            explanation: 'The poem says: My house is red - a little house!'
          },
          {
            question: 'What shades the child from the hot sun?',
            options: ['An umbrella', 'A green tree', 'A cap', 'A cloud'],
            correctIndex: 1,
            explanation: 'The child has a green, green tree to shade from the sun.'
          }
        ]
      },
      {
        id: 'c1-e-ch2',
        chapterNumber: 2,
        title: 'Three Little Pigs',
        topic: 'Story',
        summary: 'Story of Sonu, Monu, and Gonu who built houses of straw, sticks, and strong bricks.',
        textbookExcerpt: `Once there were three little pigs,
Sonu, Monu and Gonu.
Sonu lived in a house of straw.
Monu lived in a house of sticks.
Gonu lived in a house of bricks.
One day a big bad wolf came and huffed and puffed!
He blew Sonu and Monu's houses down.
They ran to Gonu's brick house.
The big wolf could not blow the strong brick house down!
The three pigs lived happily together.`,
        explanation: 'Sonu built his house with grass straw, Monu with wooden sticks, and Gonu built a very strong house of red bricks. When the bad wolf came, only the brick house stayed safe and strong!',
        wordMeanings: [
          { word: 'Straw', meaning: 'Dry grass stems / घास-फूस' },
          { word: 'Sticks', meaning: 'Small wooden branches / लकड़ियां' },
          { word: 'Bricks', meaning: 'Hard red building blocks / ईंटें' },
          { word: 'Wolf', meaning: 'A wild dog-like animal / भेड़िया' }
        ],
        writingPracticeWord: 'BRICKS',
        weeklyDay: 'Friday',
        dailyQuestions: [
          {
            question: 'Whose house was made of strong bricks?',
            options: ['Sonu', 'Monu', 'Gonu', 'The Wolf'],
            correctIndex: 2,
            explanation: 'Gonu lived in a house of strong bricks which could not be blown down.'
          }
        ]
      }
    ]
  },
  {
    id: 'c1-math',
    grade: 'Class 1',
    subject: 'Mathematics',
    bookName: 'गणित का जादू / Math-Magic (Class 1)',
    board: 'NCERT',
    coverEmoji: '🔢',
    description: 'कक्षा 1 गणित: आकृतियाँ और स्थान (Shapes & Space), 1 से 9 तक संख्याएँ, जोड़ (Addition), और घटाव (Subtraction)।',
    chapters: [
      {
        id: 'c1-m-ch1',
        chapterNumber: 1,
        title: 'Shapes and Space (आकृतियाँ और स्थान)',
        hindiTitle: 'पाठ 1: आकृतियाँ और स्थान',
        topic: 'Geometry & Spatial Concepts',
        summary: 'Inside-Outside, Bigger-Smaller, Top-Bottom, Rolling and Sliding objects.',
        textbookExcerpt: `Inside and Outside: An Arab and his Camel.
The camel was outside the tent in the cold desert.
Bigger and Smaller: A Hippo is bigger than a puppy!
Top and Bottom: The bird is at the top of the tree; the cat is at the bottom.
Rolling: A round ball rolls on the ground.
Sliding: A flat wooden block slides down the slope.`,
        explanation: 'इस पाठ में हम सीखते हैं: बड़ा क्या है और छोटा क्या है (Bigger vs Smaller). जो चीजें गोल होती हैं जैसे गेंद और संतरा, वो जमीन पर लुढ़कती हैं (Roll). और जो चपटी होती हैं जैसे माचिस की डिब्बी, वो फिसलती हैं (Slide).',
        wordMeanings: [
          { word: 'Bigger (बड़ा)', meaning: 'Larger in size' },
          { word: 'Smaller (छोटा)', meaning: 'Little in size' },
          { word: 'Roll (लुढ़कना)', meaning: 'Turning over and over' },
          { word: 'Slide (फिसलना)', meaning: 'Moving smoothly along a surface' }
        ],
        writingPracticeWord: 'CIRCLE',
        weeklyDay: 'Saturday',
        dailyQuestions: [
          {
            question: 'इनमें से कौन सी वस्तु जमीन पर लुढ़कती (Roll करती) है?',
            options: ['माचिस की डिब्बी', 'फुटबॉल (Ball)', 'किताब', 'ईंट'],
            correctIndex: 1,
            explanation: 'फुटबॉल पूरी गोल होती है, इसलिए वह लुढ़कती (Roll) है!'
          },
          {
            question: 'हाथी (Elephant) और चूहे (Mouse) में कौन बड़ा (Bigger) है?',
            options: ['चूहा', 'हाथी', 'दोनों बराबर', 'कोई नहीं'],
            correctIndex: 1,
            explanation: 'हाथी आकार में बहुत बड़ा (Bigger) होता है!'
          }
        ]
      },
      {
        id: 'c1-m-ch2',
        chapterNumber: 2,
        title: 'Numbers from 1 to 9 & Addition',
        hindiTitle: 'पाठ 2: 1 से 9 तक संख्याएँ और जोड़',
        topic: 'Counting & Addition (+)',
        summary: 'Counting objects, writing numerals 1 to 9, and adding groups together.',
        textbookExcerpt: `One little baby eating an apple.
Two little children to the zoo go.
Three green parrots flying free.
Four hungry pups want to eat more.
Five honey bees are flying to the hive.
Addition: 2 birds + 3 birds = 5 birds!
When you add 0 to any number, the answer remains the same: 4 + 0 = 4.`,
        explanation: 'गिनती और जोड़ना: जब हम दो चीजों को एक साथ मिलाते हैं, तो उसे जोड़ (Addition +) कहते हैं। जैसे 3 सेब और 2 सेब मिलकर बन जाते हैं 5 सेब!',
        wordMeanings: [
          { word: 'Addition (जोड़)', meaning: 'Putting things together (+)' },
          { word: 'Zero (शून्य)', meaning: 'Nothing / कुछ नहीं (0)' },
          { word: 'Count (गिनना)', meaning: 'Finding total quantity' }
        ],
        writingPracticeWord: '3 + 2 = 5',
        weeklyDay: 'Monday',
        dailyQuestions: [
          {
            question: 'अगर आपके पास 4 टॉफ़ी हैं और माँ ने 2 और दीं, तो कुल कितनी टॉफ़ी हुईं? (4 + 2 = ?)',
            options: ['5', '6', '7', '8'],
            correctIndex: 1,
            explanation: '4 + 2 = 6 टॉफ़ी होती हैं।'
          }
        ]
      }
    ]
  },

  // ==========================================
  // CLASS 2 TEXTBOOKS
  // ==========================================
  {
    id: 'c2-hindi',
    grade: 'Class 2',
    subject: 'Hindi',
    bookName: 'सारंगी / रिमझिम 2 (Class 2 Hindi)',
    board: 'NCERT',
    coverEmoji: '📙',
    description: 'कक्षा 2 हिंदी: ऊँट चला, भालू ने खेली फुटबॉल, म्याऊँ-म्याऊँ, अधिक बलवान कौन और दोस्त की मदद।',
    chapters: [
      {
        id: 'c2-h-ch1',
        chapterNumber: 1,
        title: 'ऊँट चला (Oont Chala)',
        hindiTitle: 'पाठ 1: ऊँट चला',
        topic: 'कविता (Poem)',
        summary: 'रेगिस्तान का जहाज ऊँट कैसे हिलता-डुलता अपनी ऊंची गर्दन और कूबड़ उठाकर चलता है।',
        textbookExcerpt: `ऊँट चला भाई ऊँट चला,
हिलता-डुलता ऊँट चला।
इतना ऊँचा ऊँट चला,
ऊँट चला भाई ऊँट चला।
ऊँची गर्दन, ऊँची पीठ,
पीठ उठाए ऊँट चला।
बालू है तो होने दो,
बोझ ऊँट को ढोने दो।
नहीं फँसेगा बालू में,
बालू में भी ऊँट चला!`,
        explanation: 'ऊँट को रेगिस्तान का जहाज कहा जाता है। उसके चौड़े गद्देदार पैर बालू (रेत) में धंसते नहीं हैं। वह अपनी लंबी गर्दन और ऊंची पीठ उठाए शान से चलता है।',
        wordMeanings: [
          { word: 'बालू (Balu)', meaning: 'Sand / रेत' },
          { word: 'बोझ (Bojh)', meaning: 'Load, burden / भार' },
          { word: 'कूबड़ / पीठ (Hump)', meaning: 'Camel hump where it stores energy' }
        ],
        writingPracticeWord: 'ऊँट',
        weeklyDay: 'Tuesday',
        dailyQuestions: [
          {
            question: 'ऊँट के पैर किसमें नहीं फँसते?',
            options: ['कीचड़ में', 'बालू (रेत) में', 'पानी में', 'बर्फ में'],
            correctIndex: 1,
            explanation: 'ऊँट के पैर गद्देदार होते हैं, इसलिए वह बालू में भी आसानी से चलता है।'
          },
          {
            question: 'ऊँट की गर्दन कैसी होती है?',
            options: ['छोटी', 'ऊँची (लंबी)', 'मोटी', 'टेढ़ी'],
            correctIndex: 1,
            explanation: 'कविता में लिखा है: ऊँची गर्दन, ऊँची पीठ!'
          }
        ]
      },
      {
        id: 'c2-h-ch2',
        chapterNumber: 2,
        title: 'भालू ने खेली फुटबॉल (Bhaalu Ne Kheli Football)',
        hindiTitle: 'पाठ 2: भालू ने खेली फुटबॉल',
        topic: 'हास्य कहानी (Story)',
        summary: 'सर्दियों के मौसम में भालू ने शेर के बच्चे को फुटबॉल समझकर लात मार दी!',
        textbookExcerpt: `सर्दियों का मौसम था। सुबह का वक्त।
चारों ओर कोहरा ही कोहरा।
एक शेर का बच्चा सिमटकर जामुन के पेड़ के नीचे सोया हुआ था।
भालू साहब सैर पर निकले।
उनकी नजर जामुन के पेड़ के नीचे पड़ी।
उन्होंने सोचा - यह फुटबॉल है!
आओ देखा न ताव, भालू जी ने पैर से उछाल दिया शेर के बच्चे को!
हड़बड़ी में शेर के बच्चे ने दहाड़ लगाई और पेड़ की डाल पकड़ ली!
शेर के बच्चे को बड़ा मजा आया, उसने कहा - मुझे और उछालो!
बारहवीं बार उछालते ही भालू साहब थककर बोले: ओह! किस आफत में आ फंसा!`,
        explanation: 'सर्दियों में भालू को ठंड में दौड़ने का मन किया। उसने जामुन के पेड़ के नीचे गोल-मटोल सोए शेर के बच्चे को गोल फुटबॉल समझा और पैर से किक मार दी! शेर का बच्चा डाल पर लटक गया और फिर बार-बार उछलने की जिद करने लगा!',
        wordMeanings: [
          { word: 'कोहरा (Kohra)', meaning: 'Fog / धुंध' },
          { word: 'आफत (Aafat)', meaning: 'Trouble, hardship / मुसीबत' },
          { word: 'दहाड़ (Dahaad)', meaning: 'Roar of a lion / शेर की आवाज' }
        ],
        writingPracticeWord: 'भालू',
        weeklyDay: 'Wednesday',
        dailyQuestions: [
          {
            question: 'भालू ने शेर के बच्चे को क्या समझ लिया था?',
            options: ['गेंद', 'फुटबॉल', 'तरबूज', 'पत्थर'],
            correctIndex: 1,
            explanation: 'भालू ने सोचा कि यह कोई फुटबॉल पड़ी है और पैर से उछाल दिया!'
          }
        ]
      }
    ]
  },
  {
    id: 'c2-math',
    grade: 'Class 2',
    subject: 'Mathematics',
    bookName: 'गणित का जादू 2 (Class 2 Math-Magic)',
    board: 'NCERT',
    coverEmoji: '✖️',
    description: 'कक्षा 2 गणित: क्या लंबा क्या गोल, 10 के समूह में गिनना, पहाड़े (Tables 2-5), और जोड़-घटाव।',
    chapters: [
      {
        id: 'c2-m-ch1',
        chapterNumber: 1,
        title: 'What is Long, What is Round? (क्या है लंबा, क्या है गोल?)',
        hindiTitle: 'पाठ 1: क्या है लंबा, क्या है गोल?',
        topic: 'Shapes and Dimensions',
        summary: 'Identify long and round objects in everyday life.',
        textbookExcerpt: `Guess what I have in my hand!
It is round like a ball, but rolls on the floor.
It is long like a bat, can hit from afar.
Long objects: Bat, pencil, ruler, tree trunk, pipe.
Round objects: Ball, coin, orange, wheel, chapati.
Things that can both roll and slide: Coins, carrom men, bottle caps!`,
        explanation: 'इस पाठ में हम अपने आसपास की चीजों को पहचानते हैं: पेंसिल, स्केल और बल्ला लंबे होते हैं। सिक्का, गेंद और पहिया गोल होते हैं। सिक्का खड़ा करके धक्का दो तो रोल करता है, और लिटाकर धक्का दो तो स्लाइड करता है!',
        wordMeanings: [
          { word: 'Long (लंबा)', meaning: 'Having great length' },
          { word: 'Round (गोल)', meaning: 'Circular or spherical' }
        ],
        writingPracticeWord: 'PENCIL',
        weeklyDay: 'Thursday',
        dailyQuestions: [
          {
            question: 'इनमें से कौन सी वस्तु लंबी (Long) है?',
            options: ['सिक्का', 'पेंसिल', 'नींबू', 'गेंद'],
            correctIndex: 1,
            explanation: 'पेंसिल लंबी (Long) होती है।'
          }
        ]
      },
      {
        id: 'c2-m-ch2',
        chapterNumber: 2,
        title: 'Multiplication Tables (2, 3, 4, 5 के पहाड़े)',
        hindiTitle: 'पाठ 2: पहाड़े और गुणा',
        topic: 'Repeated Addition & Tables',
        summary: 'Multiplication is fast repeated addition. Learn 2x, 3x, 4x, 5x tables.',
        textbookExcerpt: `2 x 1 = 2
2 x 2 = 4
2 x 3 = 6
2 x 4 = 8
2 x 5 = 10
2 x 10 = 20!
3 x 1 = 3, 3 x 2 = 6, 3 x 3 = 9, 3 x 4 = 12, 3 x 5 = 15!
5 x 1 = 5, 5 x 2 = 10, 5 x 3 = 15, 5 x 4 = 20, 5 x 5 = 25!`,
        explanation: 'गुणा बार-बार जोड़ने का छोटा तरीका है। अगर 3 बच्चों को 2-2 टॉफ़ी दी जाए, तो 2 + 2 + 2 = 6, यानी 3 × 2 = 6!',
        wordMeanings: [
          { word: 'Multiplication (गुणा)', meaning: 'Repeated addition (×)' },
          { word: 'Pahada (पहाड़ा)', meaning: 'Math table' }
        ],
        writingPracticeWord: '2 x 5 = 10',
        weeklyDay: 'Friday',
        dailyQuestions: [
          {
            question: '2 का पहाड़ा: 2 × 4 कितना होता है?',
            options: ['6', '8', '10', '12'],
            correctIndex: 1,
            explanation: '2 x 4 = 8 होता है।'
          },
          {
            question: '5 का पहाड़ा: 5 × 3 कितना होता है?',
            options: ['10', '15', '20', '25'],
            correctIndex: 1,
            explanation: '5 x 3 = 15 होता है।'
          }
        ]
      }
    ]
  },

  // ==========================================
  // CLASS 3 TEXTBOOKS
  // ==========================================
  {
    id: 'c3-hindi',
    grade: 'Class 3',
    subject: 'Hindi',
    bookName: 'वीणा / रिमझिम 3 (Class 3 Hindi)',
    board: 'NCERT',
    coverEmoji: '📕',
    description: 'कक्षा 3 हिंदी: कक्कू (नाम है उसका कक्कू लेकिन दिन भर रोता है), शेखीबाज़ मक्खी, और चाँद वाली अम्मा।',
    chapters: [
      {
        id: 'c3-h-ch1',
        chapterNumber: 1,
        title: 'कक्कू (Kakku)',
        hindiTitle: 'पाठ 1: कक्कू',
        topic: 'हास्य कविता (Poem)',
        summary: 'कक्कू माने कोयल होता है, लेकिन यह कक्कू दिन भर रोता है और चिढ़ता है!',
        textbookExcerpt: `नाम है उसका कक्कू,
कक्कू माने कोयल होता।
लेकिन यह तो दिन भर रोता,
इसलिए हम इसे चिढ़ाते,
कहते इसको सक्कू।
नाम है उसका कक्कू!
कोयल माने मिश्री जैसी,
मीठी जिसकी बोली।
यह तो जाता भड़क, करो जब
इससे तनिक ठिठोली!`,
        explanation: 'कोयल की बोली मिश्री जैसी मीठी होती है, लेकिन इस लड़के का नाम कक्कू होने के बावजूद वह जरा सी मजाक करने पर भड़क जाता है और दिन भर रोता है!',
        wordMeanings: [
          { word: 'मिश्री (Mishri)', meaning: 'Sweet sugar candy' },
          { word: 'ठिठोली (Thitholi)', meaning: 'Joking, teasing / मज़ाक' },
          { word: 'भड़कना (Bhadakna)', meaning: 'Getting angry suddenly / गुस्सा होना' }
        ],
        writingPracticeWord: 'कोयल',
        weeklyDay: 'Monday',
        dailyQuestions: [
          {
            question: 'कक्कू का असली अर्थ क्या होता है?',
            options: ['तोता', 'कोयल', 'कौआ', 'मैना'],
            correctIndex: 1,
            explanation: 'कक्कू माने कोयल होता है जिसकी बोली बहुत मीठी होती है।'
          }
        ]
      }
    ]
  },
  {
    id: 'c3-science',
    grade: 'Class 3',
    subject: 'Science & EVS',
    bookName: 'Looking Around (आसपास 3)',
    board: 'NCERT',
    coverEmoji: '🌿',
    description: 'Class 3 EVS: Poonam\'s Day Out, The Plant Fairy, Water O\' Water, Our First School.',
    chapters: [
      {
        id: 'c3-s-ch1',
        chapterNumber: 1,
        title: 'Poonam\'s Day Out (पूनम की एक दिन की सैर)',
        topic: 'Animals & Habitats',
        summary: 'Observing different animals on trees, on ground, in water, and in the air.',
        textbookExcerpt: `Poonam was at home because she had fever.
She looked up at the big tree:
She saw a pigeon, a crow, squirrels, monkeys, butterflies, and ants!
At the pond she saw goats, tortoises, egrets, and frogs.
Animals move in different ways:
Some walk, some crawl, some fly, and some swim!
Birds have wings to fly; fish have fins to swim.`,
        explanation: 'इस पाठ में हम सीखते हैं कि जानवर अलग-अलग जगहों पर रहते हैं। कुछ पेड़ों पर (बंदर, गिलहरी, पक्षी), कुछ पानी में (मछली, कछुआ, मेंढक), और कुछ जमीन पर (गाय, कुत्ता, चींटी)।',
        wordMeanings: [
          { word: 'Habitat (आवास)', meaning: 'The natural home of an animal' },
          { word: 'Crawl (रेंगना)', meaning: 'Moving on belly like snakes and lizards' }
        ],
        writingPracticeWord: 'ANIMALS',
        weeklyDay: 'Wednesday',
        dailyQuestions: [
          {
            question: 'इनमें से कौन सा जानवर पानी और जमीन दोनों पर रह सकता है?',
            options: ['मेंढक (Frog)', 'चिड़िया', 'बंदर', 'मछली'],
            correctIndex: 0,
            explanation: 'मेंढक (Amphibian) जमीन और पानी दोनों जगह रह सकता है।'
          }
        ]
      }
    ]
  },

  // ==========================================
  // CLASS 4 & 5 TEXTBOOKS
  // ==========================================
  {
    id: 'c4-math',
    grade: 'Class 4',
    subject: 'Mathematics',
    bookName: 'गणित का जादू 4 (Class 4 Math-Magic)',
    board: 'NCERT',
    coverEmoji: '📐',
    description: 'Class 4 Math: Building with Bricks, Long & Short, Trip to Bhopal, Fractions and Angles.',
    chapters: [
      {
        id: 'c4-m-ch1',
        chapterNumber: 1,
        title: 'Fractions (भिन्न: आधा और चौथाई)',
        topic: 'Fractions & Division',
        summary: 'Understanding parts of a whole: Half (1/2), Quarter (1/4), Three Quarters (3/4).',
        textbookExcerpt: `If a whole chapati is divided equally between 2 cats, each cat gets 1/2 (half).
If it is divided equally among 4 cats, each gets 1/4 (one quarter).
Two quarters make one half: 2/4 = 1/2.
Numerator is the top number; Denominator is the bottom number.`,
        explanation: 'भिन्न (Fraction) का मतलब होता है किसी पूरी चीज़ का बराबर हिस्सा। 1/2 का मतलब आधा, 1/4 का मतलब चौथाई हिस्सा।',
        wordMeanings: [
          { word: 'Numerator (अंश)', meaning: 'Top number of fraction' },
          { word: 'Denominator (हर)', meaning: 'Bottom number showing total parts' }
        ],
        writingPracticeWord: '1/2 = HALF',
        weeklyDay: 'Thursday',
        dailyQuestions: [
          {
            question: 'एक पिज्जा के 4 बराबर टुकड़े किए गए। आपने 1 टुकड़ा खाया, तो आपने कितना हिस्सा खाया?',
            options: ['1/2', '1/4', '3/4', '4/4'],
            correctIndex: 1,
            explanation: '4 में से 1 टुकड़ा खाने का मतलब 1/4 (एक चौथाई) हिस्सा है।'
          }
        ]
      }
    ]
  },
  {
    id: 'c5-science',
    grade: 'Class 5',
    subject: 'Science & EVS',
    bookName: 'Looking Around 5 (आसपास 5)',
    board: 'NCERT',
    coverEmoji: '🫀',
    description: 'Class 5 Science: Super Senses, A Snake Charmer\'s Story, From Tasting to Digesting, Seeds & Seeds.',
    chapters: [
      {
        id: 'c5-s-ch1',
        chapterNumber: 1,
        title: 'Super Senses (अनोखे senses)',
        topic: 'Biology & Animal Senses',
        summary: 'Amazing sense of smell in ants, vision in eagles, and sound in tigers.',
        textbookExcerpt: `Ants leave a smell on the ground as they walk. Other ants follow the smell to find the way.
Eagles, kites, and vultures can see 4 times as far as humans!
A tiger can see 6 times better at night than most humans.
A tiger's whiskers are very sensitive and can feel the vibrations in the air.
Silkworm can find his female moth from many kilometers away by her smell!`,
        explanation: 'जानवरों के पास चमत्कारी इंद्रियां (Super Senses) होती हैं। चींटियां जमीन पर गंध छोड़ती हैं जिससे वे एक सीधी लाइन में चलती हैं। चील और बाज हमसे 4 गुना दूर देख सकते हैं!',
        wordMeanings: [
          { word: 'Super Senses', meaning: 'Exceptional sight, smell, or hearing / अद्भुत इंद्रियां' },
          { word: 'Vibration', meaning: 'Tremor or gentle wave / कंपन' }
        ],
        writingPracticeWord: 'SENSES',
        weeklyDay: 'Friday',
        dailyQuestions: [
          {
            question: 'चींटियां एक लाइन में कैसे चलती हैं?',
            options: ['आवाज सुनकर', 'गंध (Smell) पहचानकर', 'रोशनी देखकर', 'हवा से'],
            correctIndex: 1,
            explanation: 'चींटियां जमीन पर खास गंध छोड़ती हैं जिससे पीछे वाली चींटियां लाइन नहीं तोड़तीं।'
          }
        ]
      }
    ]
  },

  // ==========================================
  // CLASS 6 TO 10 TEXTBOOKS
  // ==========================================
  {
    id: 'c6-science',
    grade: 'Class 6',
    subject: 'Science & EVS',
    bookName: 'NCERT Science (Class 6 विज्ञान)',
    board: 'NCERT',
    coverEmoji: '🔬',
    description: 'Class 6 Science: Components of Food, Sorting Materials, Separation of Substances, Plants and Body Movements.',
    chapters: [
      {
        id: 'c6-s-ch1',
        chapterNumber: 1,
        title: 'Components of Food (भोजन के घटक)',
        topic: 'Nutrition & Balanced Diet',
        summary: 'Carbohydrates, Fats, Proteins, Vitamins, Minerals, Dietary Fibre, and Water.',
        textbookExcerpt: `Nutrients in food:
1. Carbohydrates & Fats: Energy-giving foods (Rice, Wheat, Oil, Butter).
2. Proteins: Body-building foods needed for growth and muscle repair (Dal, Milk, Eggs).
3. Vitamins & Minerals: Protective foods that protect against diseases.
Vitamin C is destroyed by heat during cooking.
Lack of Vitamin A causes night blindness.
Lack of Vitamin C causes Scurvy.
Lack of Vitamin D causes Rickets.`,
        explanation: 'हमारे भोजन में पाँच मुख्य पोषक तत्व (Nutrients) होते हैं: कार्बोहाइड्रेट और वसा (ऊर्जा देने वाले), प्रोटीन (शरीर को बढ़ाने और मरम्मत करने वाले), और विटामिन तथा खनिज (रोगों से बचाने वाले)। संतुलित आहार में ये सभी सही मात्रा में होते हैं।',
        wordMeanings: [
          { word: 'Nutrients (पोषक तत्व)', meaning: 'Substances providing nourishment' },
          { word: 'Balanced Diet (संतुलित आहार)', meaning: 'Diet with all nutrients in right proportion' }
        ],
        writingPracticeWord: 'PROTEIN',
        weeklyDay: 'Monday',
        dailyQuestions: [
          {
            question: 'शरीर के विकास (Body-building) के लिए कौन सा पोषक तत्व सबसे आवश्यक है?',
            options: ['विटामिन', 'प्रोटीन (Protein)', 'पानी', 'वसा'],
            correctIndex: 1,
            explanation: 'प्रोटीन मांसपेशियों की वृद्धि और कोशिकाओं की मरम्मत के लिए बॉडी-बिल्डिंग फूड कहलाता है।'
          }
        ]
      }
    ]
  },
  {
    id: 'c8-science',
    grade: 'Class 8',
    subject: 'Science & EVS',
    bookName: 'NCERT Science (Class 8 विज्ञान)',
    board: 'NCERT',
    coverEmoji: '🧪',
    description: 'Class 8 Science: Microorganisms: Friend and Foe, Force and Pressure, Friction, Sound, Light.',
    chapters: [
      {
        id: 'c8-s-ch1',
        chapterNumber: 1,
        title: 'Microorganisms: Friend and Foe (सूक्ष्मजीव: मित्र एवं शत्रु)',
        topic: 'Microbiology',
        summary: 'Bacteria, Fungi, Protozoa, Algae, Viruses. Role in curd making, antibiotics, and disease causation.',
        textbookExcerpt: `Microorganisms are tiny living organisms invisible to the naked eye.
Lactobacillus bacteria promote the formation of curd from milk.
Yeast reproduces rapidly and produces carbon dioxide during fermentation, used in baking bread.
Alexander Fleming discovered Penicillin from Penicillium fungus in 1929.
Edward Jenner discovered the vaccine for smallpox in 1798.`,
        explanation: 'सूक्ष्मजीव इतने छोटे होते हैं कि उन्हें सूक्ष्मदर्शी (Microscope) से देखा जाता है। कुछ हमारे मित्र हैं जैसे लैक्टोबैसिलस जो दूध से दही जमाता है, और कुछ शत्रु हैं जो मलेरिया, टाइफाइड जैसी बीमारियां फैलाते हैं।',
        wordMeanings: [
          { word: 'Microorganism (सूक्ष्मजीव)', meaning: 'Microscopic living organism' },
          { word: 'Antibiotic (प्रतिजैविक)', meaning: 'Medicines killing disease-causing bacteria' }
        ],
        writingPracticeWord: 'BACTERIA',
        weeklyDay: 'Tuesday',
        dailyQuestions: [
          {
            question: 'दूध को दही में बदलने वाला बैक्टीरिया कौन सा है?',
            options: ['ई-कोलाई', 'लैक्टोबैसिलस (Lactobacillus)', 'यीस्ट', 'पेनिसिलियम'],
            correctIndex: 1,
            explanation: 'लैक्टोबैसिलस बैक्टीरिया दूध को दही में बदलता है।'
          }
        ]
      }
    ]
  },
  {
    id: 'c10-science',
    grade: 'Class 10',
    subject: 'Science & EVS',
    bookName: 'NCERT Science (Class 10 विज्ञान)',
    board: 'NCERT',
    coverEmoji: '⚡',
    description: 'Class 10 Science: Chemical Reactions, Life Processes, Light Reflection/Refraction, Electricity.',
    chapters: [
      {
        id: 'c10-s-ch1',
        chapterNumber: 1,
        title: 'Life Processes: Nutrition, Respiration & Circulation',
        topic: 'Biology',
        summary: 'Autotrophic photosynthesis, human digestive system enzymes, double circulation in heart.',
        textbookExcerpt: `Life processes are essential maintenance functions of living organisms:
1. Photosynthesis: 6CO2 + 12H2O + Sunlight + Chlorophyll -> C6H12O6 + 6O2 + 6H2O.
2. Digestion: Salivary amylase breaks starch into maltose. Pepsin digests protein in acidic stomach.
3. Circulation: Human heart has 4 chambers (2 atria, 2 ventricles).
Deoxygenated blood enters right atrium -> right ventricle -> lungs for oxygenation.
Oxygenated blood enters left atrium -> left ventricle -> pumped to body via Aorta.
Double circulation prevents mixing of oxygenated and deoxygenated blood.`,
        explanation: 'कक्षा 10 के इस महत्वपूर्ण अध्याय में हम सीखते हैं: पौधे प्रकाश संश्लेषण (Photosynthesis) द्वारा भोजन बनाते हैं। मनुष्य में हृदय के 4 कक्ष होते हैं जो दोहरा परिसंचरण (Double Circulation) करते हैं ताकि शुद्ध और अशुद्ध रक्त आपस में न मिलें।',
        wordMeanings: [
          { word: 'Double Circulation', meaning: 'Blood passes through the heart twice in one complete cycle' },
          { word: 'Enzyme', meaning: 'Biological catalyst speeding up biochemical reactions' }
        ],
        writingPracticeWord: 'PHOTOSYNTHESIS',
        weeklyDay: 'Wednesday',
        dailyQuestions: [
          {
            question: 'मानव हृदय (Human Heart) में कुल कितने कोष्ठक (Chambers) होते हैं?',
            options: ['2', '3', '4', '6'],
            correctIndex: 2,
            explanation: 'मानव हृदय में 4 कोष्ठक होते हैं: 2 अलिंद (Atria) और 2 निलय (Ventricles)।'
          }
        ]
      }
    ]
  }
];

export const ALL_SUPPORTED_GRADES: GradeLevel[] = [
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

export const WEEKLY_DAYS = [
  { day: 'Monday', hindi: 'सोमवार', focus: 'Chapter Reading & Core Concepts', emoji: '📖' },
  { day: 'Tuesday', hindi: 'मंगलवार', focus: 'Word Meanings (शब्दार्थ) & Vocabulary', emoji: '🔤' },
  { day: 'Wednesday', hindi: 'बुधवार', focus: 'Mathematics & Problem Solving', emoji: '🔢' },
  { day: 'Thursday', hindi: 'गुरुवार', focus: 'Science & Environmental Questions', emoji: '🌱' },
  { day: 'Friday', hindi: 'शुक्रवार', focus: 'Fill in Blanks & Fast Quiz', emoji: '⚡' },
  { day: 'Saturday', hindi: 'शनिवार', focus: 'Pre-Exam Speed Drill & Revision', emoji: '🎯' },
  { day: 'Sunday', hindi: 'रविवार', focus: 'Grand Weekly Exam Day 🏆', emoji: '🏆' },
];
