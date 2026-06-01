import { CalendarEvent } from './types';

// Get the current week's dates
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

const weekDates = getWeekDates();

// Events the user is participating in
export const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'חוג ציור',
    titleEn: 'Painting Class',
    description: 'שיעור ציור בצבעי מים. נלמד טכניקות חדשות ליצירת נופים.',
    descriptionEn: 'Watercolor painting class. We will learn new techniques for creating landscapes.',
    date: weekDates[0], // Sunday
    startHour: 10,
    endHour: 12,
    category: 'art',
    simpleCategory: 'culture',
    isRecurring: true,
    teacher: 'רחל כהן',
    teacherEn: 'Rachel Cohen',
    participants: 12,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    instructions: 'יש להביא סינר או בגדים שלא אכפת ללכלך. חומרים מסופקים במקום.',
    instructionsEn: 'Please bring an apron or clothes you don\'t mind getting dirty. Materials are provided on site.',
    notifications: [
      {
        id: 'n1',
        message: 'שינוי מיקום: השיעור יתקיים בחדר 3 במקום חדר 5',
        date: new Date(),
        type: 'change'
      }
    ]
  },
  {
    id: '2',
    title: 'הרצאה: בריאות הגוף',
    titleEn: 'Lecture: Body Health',
    description: 'הרצאה מרתקת על שמירה על בריאות הגוף בגיל השלישי.',
    descriptionEn: 'A fascinating lecture on maintaining body health in the third age.',
    date: weekDates[2], // Tuesday
    startHour: 16,
    endHour: 17,
    category: 'lecture',
    simpleCategory: 'social',
    isRecurring: false,
    teacher: 'פרופ\' דוד לוי',
    teacherEn: 'Prof. David Levi',
    participants: 25,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
  },
  {
    id: '3',
    title: 'טיול לגליל',
    titleEn: 'Trip to the Galilee',
    description: 'טיול יום מאורגן לאתרים היסטוריים בגליל העליון. כולל ארוחת צהריים.',
    descriptionEn: 'An organized day trip to historical sites in the Upper Galilee. Includes lunch.',
    date: weekDates[4], // Thursday
    startHour: 8,
    endHour: 16,
    category: 'trip',
    simpleCategory: 'social',
    isRecurring: false,
    teacher: 'משה אברהם',
    teacherEn: 'Moshe Avraham',
    participants: 30,
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    instructions: 'יש להגיע עם נעלי הליכה נוחות, כובע, ובקבוק מים. הטיול מתקיים בחוץ.',
    instructionsEn: 'Please arrive with comfortable walking shoes, a hat, and a water bottle. The trip takes place outdoors.',
    notifications: [
      {
        id: 'n2',
        message: 'תזכורת: מפגש בשעה 7:45 בלובי',
        date: new Date(),
        type: 'info'
      },
      {
        id: 'n3',
        message: 'הטיול יתקיים גם אם יהיה גשם קל',
        date: new Date(Date.now() - 86400000),
        type: 'info'
      }
    ]
  },
  {
    id: '4',
    title: 'מועדון קריאה',
    titleEn: 'Book Club',
    description: 'דיון משותף על הספר "סיפור פשוט" מאת ש.י עגנון.',
    descriptionEn: 'Group discussion on the book "A Simple Story" by S.Y. Agnon.',
    date: weekDates[0], // Sunday
    startHour: 14,
    endHour: 15,
    category: 'reading',
    simpleCategory: 'culture',
    isRecurring: true,
    teacher: 'שרה גולדברג',
    teacherEn: 'Sarah Goldberg',
    participants: 8,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    instructions: 'מומלץ לקרוא את הספר מראש. ניתן לשאול עותק בספריה.',
    instructionsEn: 'It is recommended to read the book in advance. You can borrow a copy from the library.',
  },
  {
    id: '5',
    title: 'התעמלות בוקר',
    titleEn: 'Morning Exercise',
    description: 'שיעור התעמלות עדינה לחיזוק הגוף ושיפור הגמישות.',
    descriptionEn: 'Gentle exercise class to strengthen the body and improve flexibility.',
    date: weekDates[1], // Monday
    startHour: 9,
    endHour: 10,
    category: 'fitness',
    simpleCategory: 'sport',
    isRecurring: true,
    teacher: 'יעל שמיר',
    teacherEn: 'Yael Shamir',
    participants: 15,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    instructions: 'יש להגיע עם בגדי ספורט נוחים ובקבוק מים.',
    instructionsEn: 'Please arrive with comfortable sportswear and a water bottle.',
  },
  {
    id: '6',
    title: 'מקהלה',
    titleEn: 'Choir',
    description: 'חזרה שבועית של המקהלה. נשיר שירי נוסטלגיה ישראליים.',
    descriptionEn: 'Weekly choir rehearsal. We will sing Israeli nostalgia songs.',
    date: weekDates[3], // Wednesday
    startHour: 11,
    endHour: 12,
    category: 'music',
    simpleCategory: 'culture',
    isRecurring: true,
    teacher: 'אלי מזרחי',
    teacherEn: 'Eli Mizrachi',
    participants: 20,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    notifications: [
      {
        id: 'n4',
        message: 'שינוי מדריך: השבוע ימלא מקום דני כהן',
        date: new Date(),
        type: 'change'
      }
    ]
  },
  {
    id: '7',
    title: 'סדנת יצירה',
    titleEn: 'Creative Workshop',
    description: 'יצירת קישוטים לחגים מחומרים ממוחזרים.',
    descriptionEn: 'Creating holiday decorations from recycled materials.',
    date: weekDates[5], // Friday
    startHour: 10,
    endHour: 11,
    category: 'art',
    simpleCategory: 'culture',
    isRecurring: false,
    teacher: 'מרים לוי',
    teacherEn: 'Miriam Levi',
    participants: 10,
    imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
    instructions: 'כל החומרים מסופקים. אפשר להביא חומרים ממוחזרים מהבית.',
    instructionsEn: 'All materials are provided. You can bring recycled materials from home.',
  },
  {
    id: '8',
    title: 'יוגה עדינה',
    titleEn: 'Gentle Yoga',
    description: 'שיעור יוגה מותאם לכל רמות הכושר עם דגש על נשימה ורגיעה.',
    descriptionEn: 'Yoga class adapted for all fitness levels with emphasis on breathing and relaxation.',
    date: weekDates[3], // Wednesday
    startHour: 9,
    endHour: 10,
    category: 'fitness',
    simpleCategory: 'sport',
    isRecurring: true,
    teacher: 'נעמי רוזן',
    teacherEn: 'Naomi Rosen',
    participants: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    instructions: 'יש להגיע עם בגדים נוחים. מזרנים מסופקים במקום.',
    instructionsEn: 'Please arrive in comfortable clothes. Mats are provided on site.',
  },
];

// Events available for discovery (user is NOT participating)
export const availableEvents: CalendarEvent[] = [
  {
    id: 'avail-1',
    title: 'שחייה טיפולית',
    titleEn: 'Therapeutic Swimming',
    description: 'שחייה בבריכה מחוממת עם מדריך מוסמך. מתאים לכל הרמות.',
    descriptionEn: 'Swimming in a heated pool with a certified instructor. Suitable for all levels.',
    date: weekDates[1], // Monday
    startHour: 11,
    endHour: 12,
    category: 'fitness',
    simpleCategory: 'sport',
    isRecurring: true,
    teacher: 'דני כהן',
    teacherEn: 'Danny Cohen',
    participants: 8,
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400',
    instructions: 'יש להביא בגד ים, מגבת וכפכפים.',
    instructionsEn: 'Please bring a swimsuit, towel, and flip-flops.',
  },
  {
    id: 'avail-2',
    title: 'סדנת קרמיקה',
    titleEn: 'Ceramics Workshop',
    description: 'לימוד יסודות עבודה בחימר ויצירת כלים פשוטים.',
    descriptionEn: 'Learning the basics of working with clay and creating simple vessels.',
    date: weekDates[2], // Tuesday
    startHour: 10,
    endHour: 12,
    category: 'art',
    simpleCategory: 'culture',
    isRecurring: true,
    teacher: 'אורלי שפירא',
    teacherEn: 'Orly Shapira',
    participants: 6,
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    instructions: 'יש להגיע עם בגדים שלא אכפת ללכלך.',
    instructionsEn: 'Please arrive in clothes you don\'t mind getting dirty.',
  },
  {
    id: 'avail-3',
    title: 'הרצאה: היסטוריה ישראלית',
    titleEn: 'Lecture: Israeli History',
    description: 'סדרת הרצאות על תולדות מדינת ישראל.',
    descriptionEn: 'A lecture series on the history of the State of Israel.',
    date: weekDates[4], // Thursday
    startHour: 14,
    endHour: 15,
    category: 'lecture',
    simpleCategory: 'social',
    isRecurring: true,
    teacher: 'פרופ\' יעקב שטרן',
    teacherEn: 'Prof. Yaakov Stern',
    participants: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
  },
  {
    id: 'avail-4',
    title: 'ריקודי עם',
    titleEn: 'Folk Dancing',
    description: 'ריקודי עם ישראליים בקצב נוח ומתאים לכולם.',
    descriptionEn: 'Israeli folk dancing at a comfortable pace suitable for everyone.',
    date: weekDates[0], // Sunday
    startHour: 16,
    endHour: 17,
    category: 'fitness',
    simpleCategory: 'sport',
    isRecurring: true,
    teacher: 'רונית גל',
    teacherEn: 'Ronit Gal',
    participants: 18,
    imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400',
    instructions: 'יש להגיע עם נעליים נוחות.',
    instructionsEn: 'Please arrive with comfortable shoes.',
  },
  {
    id: 'avail-5',
    title: 'חוג גיטרה',
    titleEn: 'Guitar Class',
    description: 'לימוד נגינה בגיטרה למתחילים.',
    descriptionEn: 'Guitar lessons for beginners.',
    date: weekDates[5], // Friday
    startHour: 9,
    endHour: 10,
    category: 'music',
    simpleCategory: 'culture',
    isRecurring: true,
    teacher: 'עמית לוי',
    teacherEn: 'Amit Levi',
    participants: 5,
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
    instructions: 'גיטרות מסופקות במקום.',
    instructionsEn: 'Guitars are provided on site.',
  },
];
