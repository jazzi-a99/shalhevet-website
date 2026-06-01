import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'he' | 'en';

interface Translations {
  // Header
  home: string;
  about: string;
  multiCenter: string;
  activities: string;
  sparks: string;
  discounts: string;
  donations: string;
  contact: string;
  login: string;
  logout: string;
  welcome: string;
  myCalendar: string;
  
  // Calendar page
  calendarTitle: string;
  calendarSubtitle: string;
  prevWeek: string;
  nextWeek: string;
  today: string;
  hour: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  day: string;
  
  // Filters
  allEvents: string;
  recurring: string;
  oneTime: string;
  sport: string;
  culture: string;
  social: string;
  filterInstruction: string;
  
  // Side list
  myActivities: string;
  clickToViewDetails: string;
  moreEvents: string;
  
  // Event preview
  eventInstructions: string;
  notifications: string;
  participants: string;
  close: string;
  noNotifications: string;
  clickToPurchase: string;
  registerForActivity: string;
  unregisterFromActivity: string;
  registeredSuccess: string;
  unregisteredSuccess: string;
  
  // Summary
  totalActivities: string;
  thisWeek: string;
  
  // Footer
  footerText: string;
  allRightsReserved: string;
  
  // Auth
  loginTitle: string;
  signupTitle: string;
  welcomeToSite: string;
  nameOrId: string;
  enterNameOrId: string;
  email: string;
  enterEmail: string;
  fullName: string;
  enterFullName: string;
  password: string;
  enterPassword: string;
  loginButton: string;
  signupButton: string;
  loggingIn: string;
  forgotPassword: string;
  enterFirstName: string;
  passwordMin: string;
  passwordMinSix: string;
  loginError: string;
  signupSuccess: string;
  alreadyHaveAccount: string;
  noAccount: string;
  noUserFound: string;
  createAccountNow: string;
  wrongPassword: string;
  myProfile: string;
  
  // Categories
  art: string;
  lecture: string;
  trip: string;
  reading: string;
  fitness: string;
  music: string;
  default: string;
  
  // Language switcher
  languageName: string;
  changeLanguageHint: string;
  
  // Days array for grid
  daysHebrew: string[];

  // Help button & What's New page
  aboutThisPage: string;
  whatsNew: string;
  whatsNewSubtitle: string;
  stepLabel: string;
  stepOf: string;
  nextStep: string;
  previousStep: string;
  imagePlaceholder: string;
  catActivities: string;
  catLogin: string;
  catCalendar: string;
  whatsNewSteps: {
    activities: { title: string; description: string }[];
    login: { title: string; description: string }[];
    calendar: { title: string; description: string }[];
  };

  // Home page (Hero + SecondarySection)
  heroTitle: string;
  heroSubtitle: string;
  ctaToActivities: string;
  ctaToUpcoming: string;
  ctaToPayment: string;
  secondaryTitle: string;
  secondarySubtitle: string;
  brandName: string;

  // Activity Center
  activityCenterTitle: string;
  tabClickInstruction: string;
  tabLectures: string;
  tabHealth: string;
  tabUpcoming: string;
  weeklyActivitiesIntro: string;
  healthAndFitness: string;
  healthIntro: string;
  legend: string;
  clickActivityForDetails: string;
  upcomingEventsIntro: string;
  clickEventForDetails: string;
  eventCalendar: string;
  calendarPickHint: string;
  seatsAvailable: string;
  eventFull: string;
  eventFullLong: string;
  timeColon: string;
  dateLabel: string;
  timeLabel: string;
  instructorLabel: string;
  locationLabel: string;
  weeklyRecurringNote: string;
  purchaseTickets: string;
  purchaseSoon: string;
  contactCenterNote: string;
  lectureLabel: string;
  concertLabel: string;
  movieLabel: string;
  previousMonth: string;
  nextMonth: string;
  noActivitiesThisWeek: string;
  recurringEvent: string;
  to: string;

  // Homepage extra sections
  homeUpcomingTitle: string;
  homeUpcomingViewAll: string;
  homeNewsTitle: string;
  homeNewsCardTitle: string;
  homeNewsCardCta: string;
  homeNewsCard2Title: string;
  homeNewsCard2Cta: string;
  homeAboutTitle: string;
  homeAboutBody: string;
  homeAboutReadMore: string;
  homeDonationsTitle: string;
  homeDonationsBody: string;
  homeDonationsCta: string;
  homeContactTitle: string;
  homeContactAddress: string;
  homeContactPhone: string;
  homeContactEmail: string;
  homeContactFacebook: string;
  homeHeroPrimaryCta: string;
  homeNoUpcoming: string;
  homeAtHour: string;
}

const hebrewTranslations: Translations = {
  home: 'דף הבית',
  about: 'אודות',
  multiCenter: 'מערך שירותים',
  activities: 'מערכת פעילויות',
  sparks: 'ניצוצות',
  discounts: 'הנחות',
  donations: 'תרומות',
  contact: 'צור קשר',
  login: 'התחברות',
  logout: 'התנתק',
  welcome: 'ברוך הבא,',
  myCalendar: 'היומן שלי',
  calendarTitle: 'היומן שלי',
  calendarSubtitle: 'כאן תוכלו לראות את כל הפעילויות שנרשמתם אליהן',
  prevWeek: 'שבוע קודם',
  nextWeek: 'שבוע הבא',
  today: 'היום',
  hour: 'שעה',
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
  day: 'יום',
  allEvents: 'כל האירועים',
  recurring: 'אירועים קבועים',
  oneTime: 'אירועים חד-פעמיים',
  sport: 'ספורט',
  culture: 'תרבות',
  social: 'חברתי',
  filterInstruction: 'לחצו על פילטר כדי להציג או להסתיר פעילויות',
  myActivities: 'הפעילויות שלי',
  clickToViewDetails: 'לחצו על אירוע לצפייה בפרטים',
  moreEvents: 'אירועים נוספים',
  eventInstructions: 'הנחיות לאירוע',
  notifications: 'עדכונים והודעות',
  participants: 'משתתפים',
  close: 'סגור',
  noNotifications: 'אין עדכונים חדשים',
  clickToPurchase: 'לחצו לרכישה',
  registerForActivity: 'הרשמה לפעילות',
  unregisterFromActivity: 'בטל הרשמה',
  registeredSuccess: 'נרשמת בהצלחה',
  unregisteredSuccess: 'ההרשמה בוטלה',
  totalActivities: 'סה״כ',
  thisWeek: 'פעילויות השבוע',
  footerText: 'שלהב״ת - שירותים לאוכלוסייה המבוגרת בקריית טבעון והסביבה',
  allRightsReserved: 'כל הזכויות שמורות',
  loginTitle: 'התחברות לאתר',
  signupTitle: 'יצירת חשבון',
  welcomeToSite: 'ברוכים הבאים לשלהב״ת',
  nameOrId: 'שם פרטי / תעודת זהות',
  enterNameOrId: 'הזן את שמך או מספר ת.ז.',
  email: 'אימייל',
  enterEmail: 'הזן את כתובת האימייל',
  fullName: 'שם מלא',
  enterFullName: 'הזן את שמך המלא',
  password: 'סיסמה',
  enterPassword: 'הזן סיסמה',
  loginButton: 'כניסה',
  signupButton: 'הרשמה',
  loggingIn: 'מתחבר...',
  forgotPassword: 'שכחת סיסמה? פנה למשרד שלהב״ת לקבלת עזרה',
  enterFirstName: 'נא להזין שם פרטי או תעודת זהות',
  passwordMin: 'הסיסמה חייבת להכיל לפחות 4 תווים',
  passwordMinSix: 'הסיסמה חייבת להכיל לפחות 6 תווים',
  loginError: 'שגיאה בהתחברות. נא לנסות שוב.',
  signupSuccess: 'החשבון נוצר! אנא בדוק את האימייל שלך לאימות.',
  alreadyHaveAccount: 'כבר יש לך חשבון? התחבר',
  noAccount: 'אין לך חשבון? הירשם',
  noUserFound: 'לא נמצא משתמש עם כתובת המייל הזו. נראה שעדיין אין לך חשבון באתר.',
  createAccountNow: 'פתח חשבון חדש עכשיו',
  wrongPassword: 'הסיסמה שגויה. נא לנסות שוב.',
  myProfile: 'הפרופיל שלי',
  art: 'אומנות',
  lecture: 'הרצאה',
  trip: 'טיול',
  reading: 'קריאה',
  fitness: 'כושר',
  music: 'מוסיקה',
  default: 'כללי',
  languageName: 'עברית',
  changeLanguageHint: 'לחצו להחלפת שפה',
  daysHebrew: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  aboutThisPage: 'הסבר על הדף',
  whatsNew: 'מה חדש באתר - הדרכות',
  whatsNewSubtitle: 'התחדשנו! ריכזנו עבורכם מספר הדרכות קצרות וברורות, כדי שתוכלו ליהנות מהאתר החדש בקלות ובנוחות.',
  stepLabel: 'שלב',
  stepOf: 'מתוך',
  nextStep: 'הבא',
  previousStep: 'חזור',
  imagePlaceholder: 'מקום לתמונה',
  catActivities: 'מערכת פעילויות',
  catLogin: 'התחברות',
  catCalendar: 'היומן שלי',
  whatsNewSteps: {
    activities: [
      { title: 'מערכת פעילויות - שלב 1', description: 'לחיצה על הכפתור תוביל אותנו למרכז הפעילויות.\nכאן נוכל לראות את מגוון הפעילויות אליהם נוכל להירשם.' },
      { title: 'מערכת פעילויות - שלב 2', description: 'חתך "הרצאות וחוגים"\nכאן נוכל לראות את כל ההרצאות והחוגים שמתקיימים באופן קבוע כל שבוע, מסודר בלוח שבועי לפי שעות.' },
      { title: 'הרצאות וחוגים - לוח שבועי', description: 'בלוח השבועי נוכל לראות את ההרצאות והחוגים החוזרות במשך השבוע בשעות השונות של היום.' },
      { title: 'הרצאות וחוגים - חלון מידע', description: 'לחיצה על כל פעילות בלוח השבועי תפתח לנו את חלון המידע.\nכאן נוכל לראות מידע אודות הפעילות כגון מיקום ושעה.' },
      { title: 'הרצאות וחוגים - מקרא', description: 'מתחת ללוח השבועי נוכל לראות את המקרא.\nכאן נראה לפי צבעים את החלוקה של כלל החוגים וההרצאות לנושאים שונים.' },
      { title: 'חתך "מועדון בריאות וכושר"', description: 'החתך השני הוא מועדון בריאות וכושר.\nכאן נוכל לראות את כלל פעילויות הספורט הקבועות שמתרחשות מדי שבוע.' },
      { title: 'מועדון בריאות וכושר - לוח שבועי', description: 'בלוח השבועי נוכל לראות את פעילויות הספורט החוזרות במשך השבוע בשעות השונות של היום.' },
      { title: 'מועדון בריאות וכושר - חלון מידע', description: 'לחיצה על כל פעילות בלוח השבועי תפתח לנו את חלון המידע.\nכאן נוכל לראות מידע אודות הפעילות כגון מיקום ושעה.' },
      { title: 'מועדון בריאות וכושר - מקרא', description: 'מתחת ללוח השבועי נוכל לראות את המקרא.\nכאן נראה לפי צבעים את החלוקה של כלל הפעילויות לנושאים שונים.' },
      { title: 'חתך "הרצאות, קונצרטים וסרטים קרובים"', description: 'החתך השלישי הוא הרצאות, קונצרטים וסרטים קרובים.\nכאן נוכל לראות פעילויות חד פעמיות, שאינן מתקיימות באופן מחזורי כל שבוע.' },
      { title: 'הרצאות, קונצרטים וסרטים קרובים - פעילויות', description: 'בחלקו העליון של חתך זה, נראה ברשימה את כלל הפעילויות הרלוונטיות מסודרות לפי תאריך הפעילות.\nתחת כל אירוע נוכל לראות את הפרטים שלו.' },
      { title: 'הרצאות, קונצרטים וסרטים קרובים - לוח אירועים', description: 'כאשר נגלול למטה במסך נגיע ללוח האירועים.\nכאן נוכל לראות את אותן פעילויות שבחלקו העליון של המסך, מסודרות בלוח שנה.\nבתחתית הלוח נוכל לראות מקרא בדומה לחתכים האחרים.' },
      { title: 'הרצאות, קונצרטים וסרטים קרובים - חלון מידע', description: 'לחיצה על כל פעילות (בין אם ברשימת הפעילויות או בלוח האירועים) תמרכז את המידע על הפעילות שבחרנו ותפתח את חלון המידע.\nכאן נוכל לראות את פרטי האירוע:\n• קטגוריה\n• תאריך\n• שעה\n• הסבר מילולי\n• מקומות פנויים - במידה ויש יופיע גם קישור לרכישת כרטיס.' },
    ],
    login: [
      { title: 'התחברות - כפתור התחברות', description: 'לחיצה על כפתור ההתחברות תאפשר לנו להירשם ולהתחבר לאתר, ולפתוח גישה ליומן אישי.' },
      { title: 'התחברות והרשמה', description: 'במידה וקיים משתמש, נזין את האימייל והסיסמא שלנו כדי להתחבר לאתר.\nאם עדיין לא הקמנו חשבון, נלחץ על הכפתור להרשמה, שנמצא מתחת לכפתור "כניסה".' },
      { title: 'התחברות - הרשמה', description: 'לחיצה על כפתור ההרשמה תוביל למסך ההרשמה, כאן נזין את הפרטים שלנו כדי להיכנס למערכת:\nשם, אימייל וסיסמה.' },
      { title: 'התחברות - משתמש פעיל', description: 'כאשר התחברנו לאתר, נוכל לראות את שם המשתמש בצד ימין למעלה.\nבמידה ונרצה לצאת מהמשתמש שלנו נלחץ על הכפתור "התנתק".' },
    ],
    calendar: [
      { title: 'היומן שלי - כניסה', description: 'כדי לפתוח את היומן האישי נלחץ על הכפתור "היומן שלי" בצד ימין למעלה של המסך.\nביומן נוכל לראות את כלל הפעילויות אליהן נרשמנו או מעוניינים להשתתף בהם.' },
      { title: 'היומן שלי - מסך יומן', description: 'במסך זה נוכל לראות את היומן האישי שלנו, לפי שבועות.\nמעל לוח היומן, נוכל להפעיל מסננים כדי לחפש אירועים ספציפיים או לראות את כולם.' },
      { title: 'היומן שלי - לוח יומן', description: 'בלוח היומן נראה את הפעילויות שלנו מסודרים בלוח שבועי, לפי שעה ויום בשבוע.\nהצבעים מראים לנו את הקטגוריה אליה משוייכת הפעילות.' },
      { title: 'היומן שלי - חלון מידע', description: 'לחיצה על פעילות בלוח היומן תפתח את חלון המידע, כאן נוכל לראות את כל המידע הרלוונטי לגבי הפעילות שבחרנו.' },
      { title: 'היומן שלי - הפעילויות שלי', description: 'כאן נוכל לראות את הפעילויות באופן מרוכז ברשימה.\nהקטגוריה מופיעה בצד ימין למעלה עם הצבע.\nבמידה ומופיע ריבוע כחול עם חץ, מדובר בפעילות שבועית.\nלחיצה על פעילות ברשימה תפתח את חלון המידע.' },
      { title: 'היומן שלי - אירועים נוספים', description: 'לחיצה על כפתור "אירועים נוספים" תציג לנו בלוח השבועי פעילויות שנוכל להירשם אליהם, בשעות הפנויות ביומן.' },
      { title: 'היומן שלי - אירועים נוספים ביומן', description: 'לאחר שנלחץ על אירועים נוספים, יופיעו לנו מלבנים ביומן שמייצגים פעילויות חדשות שנוכל להירשם אליהם, בזמנים שהיומן פנוי.\nהם יופיעו בצבע בהיר יותר עם מסגרת מקווקוות.' },
    ],
  },
  heroTitle: 'ברוכים הבאים לאתר הבית של שלהב״ת',
  heroSubtitle: 'לקידום איכות חיים מיטבית ומשמעותית, ומתן שירותים מגוונים לצרכי האוכלוסייה המבוגרת בקריית טבעון והסביבה',
  ctaToActivities: 'למערכת הפעילויות ❯',
  ctaToUpcoming: 'לאירועים הקרובים ❯',
  ctaToPayment: 'לתשלום ❯',
  secondaryTitle: 'תרבות ופנאי לקהל הרחב',
  secondarySubtitle: 'מרכז יום רב תחומי, קהילה תומכת, מועדון המפגש',
  brandName: 'שלהב״ת',
  activityCenterTitle: 'מרכז פעילויות',
  tabClickInstruction: '👆 לחצו על הכפתורים למעבר בין סוגי הפעילויות',
  tabLectures: 'הרצאות וחוגים',
  tabHealth: 'מועדון בריאות וכושר',
  tabUpcoming: 'הרצאות, קונצרטים וסרטים קרובים',
  weeklyActivitiesIntro: 'פעילויות קבועות שחוזרות מדי שבוע - מבט על כל השבוע',
  healthAndFitness: 'בריאות וכושר',
  healthIntro: 'פעילויות בריאות וכושר קבועות - מבט על כל השבוע',
  legend: 'מקרא',
  clickActivityForDetails: 'לחצו על פעילות לצפייה בפרטים',
  upcomingEventsIntro: 'הרצאות, קונצרטים והקרנות סרטים קרובים',
  clickEventForDetails: 'לחצו על אירוע לצפייה בפרטים ולרכישת כרטיסים',
  eventCalendar: 'לוח אירועים',
  calendarPickHint: '📅 ניתן לבחור תאריך בלוח להצגת אירועים',
  seatsAvailable: 'יש מקומות פנויים',
  eventFull: 'האירוע מלא',
  eventFullLong: 'האירוע מלא - אין מקומות פנויים',
  timeColon: 'שעה:',
  dateLabel: 'תאריך',
  timeLabel: 'שעה',
  instructorLabel: 'מדריך/ה',
  locationLabel: 'מיקום',
  weeklyRecurringNote: 'פעילות זו חוזרת מדי שבוע באותו זמן.',
  purchaseTickets: 'לרכישת כרטיסים',
  purchaseSoon: 'אפשרות רכישה בקרוב!',
  contactCenterNote: 'למידע נוסף, פנו למרכז הפעילויות.',
  lectureLabel: 'הרצאה',
  concertLabel: 'קונצרט',
  movieLabel: 'סרט',
  previousMonth: 'חודש קודם',
  nextMonth: 'חודש הבא',
  noActivitiesThisWeek: 'אין פעילויות השבוע',
  recurringEvent: 'אירוע קבוע',
  to: 'עד',

  homeUpcomingTitle: 'הרצאות, קונצרטים וסרטים קרובים',
  homeUpcomingViewAll: 'לכל האירועים הקרובים ❯',
  homeNewsTitle: 'חדש בשלהב״ת',
  homeNewsCardTitle: 'חדש בשלהב״ת! כל הפרטים להשכרת מקום לאירוע',
  homeNewsCardCta: 'לפרטים נוספים ❯',
  homeNewsCard2Title: 'לצפייה בכל הפעילויות בשלהב״ת לשנת 25-26',
  homeNewsCard2Cta: 'לצפייה ❯',
  homeAboutTitle: 'אודות',
  homeAboutBody: 'שלהב״ת היא בית שמקדם איכות חיים מיטבית ומשמעותית ומהווה מרכז המתכנן, מפתח ומספק מענה, מידע, תוכן ושירותים מגוונים לצרכי האוכלוסייה המבוגרת בקריית טבעון והסביבה. שלהב״ת היא בית שוקק חיים, מזמין, נגיש, נעים ומכבד לכל מבוגר. כל אדם יוכל למצוא בבית זה אוזן קשבת, פעילות מתאימה והזדמנות להפגת בדידות ויצירת איכות חיים מיטבית ומשמעותית.',
  homeAboutReadMore: 'להמשך קריאה ❯',
  homeDonationsTitle: 'תרומות',
  homeDonationsBody: 'עמותת שלהב״ת ממשיכה לתת שירות איכותי לאזרחים הוותיקים בקריית טבעון. על מנת שנוכל להמשיך לתת שירות לאורך זמן, אנו זקוקים לתרומות כספיות. לעמותה אישור על מתן תרומות לצורך ניכוי מס.',
  homeDonationsCta: 'לתרומה ❯',
  homeContactTitle: 'יצירת קשר',
  homeContactAddress: 'סימטת הלבנה 2, מיקוד 3601602, קריית טבעון',
  homeContactPhone: '04-9535750',
  homeContactEmail: 'shalhevet01@gmail.com',
  homeContactFacebook: 'לכניסה לדף הפייסבוק שלנו',
  homeHeroPrimaryCta: 'מרכז יום רב תחומי, קהילה תומכת, מועדון המפגש ❯',
  homeNoUpcoming: 'בקרוב יפורסמו אירועים חדשים',
  homeAtHour: 'בשעה',
};

const englishTranslations: Translations = {
  home: 'Home',
  about: 'About',
  multiCenter: 'Services',
  activities: 'Activities',
  sparks: 'Sparks',
  discounts: 'Discounts',
  donations: 'Donations',
  contact: 'Contact',
  login: 'Login',
  logout: 'Logout',
  welcome: 'Welcome,',
  myCalendar: 'My Calendar',
  calendarTitle: 'My Calendar',
  calendarSubtitle: 'Here you can view all activities you have registered for',
  prevWeek: 'Previous Week',
  nextWeek: 'Next Week',
  today: 'Today',
  hour: 'Hour',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  day: '',
  allEvents: 'All Events',
  recurring: 'Recurring Events',
  oneTime: 'One-Time Events',
  sport: 'Sport',
  culture: 'Culture',
  social: 'Social',
  filterInstruction: 'Click a filter to show or hide activities',
  myActivities: 'My Activities',
  clickToViewDetails: 'Click on an event to view details',
  moreEvents: 'More events',
  eventInstructions: 'Event Instructions',
  notifications: 'Updates & Notifications',
  participants: 'participants',
  close: 'Close',
  noNotifications: 'No new updates',
  clickToPurchase: 'Click to purchase',
  registerForActivity: 'Register for activity',
  unregisterFromActivity: 'Cancel registration',
  registeredSuccess: 'Successfully registered',
  unregisteredSuccess: 'Registration cancelled',
  totalActivities: 'Total',
  thisWeek: 'activities this week',
  footerText: 'Shalhevet - Services for the Elderly Population in Kiryat Tivon and Surrounding Area',
  allRightsReserved: 'All rights reserved',
  loginTitle: 'Login to Site',
  signupTitle: 'Create Account',
  welcomeToSite: 'Welcome to Shalhevet',
  nameOrId: 'First Name / ID Number',
  enterNameOrId: 'Enter your name or ID number',
  email: 'Email',
  enterEmail: 'Enter your email',
  fullName: 'Full Name',
  enterFullName: 'Enter your full name',
  password: 'Password',
  enterPassword: 'Enter password',
  loginButton: 'Login',
  signupButton: 'Sign Up',
  loggingIn: 'Logging in...',
  forgotPassword: 'Forgot password? Contact the Shalhevet office for help',
  enterFirstName: 'Please enter first name or ID number',
  passwordMin: 'Password must contain at least 4 characters',
  passwordMinSix: 'Password must be at least 6 characters',
  loginError: 'Login error. Please try again.',
  signupSuccess: 'Account created! Please check your email to verify.',
  alreadyHaveAccount: 'Already have an account? Login',
  noAccount: "Don't have an account? Sign Up",
  noUserFound: "We couldn't find an account with this email. It looks like you don't have an account yet.",
  createAccountNow: 'Create a new account now',
  wrongPassword: 'Incorrect password. Please try again.',
  myProfile: 'My Profile',
  art: 'Art',
  lecture: 'Lecture',
  trip: 'Trip',
  reading: 'Reading',
  fitness: 'Fitness',
  music: 'Music',
  default: 'General',
  languageName: 'English',
  changeLanguageHint: 'Click to change language',
  daysHebrew: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  aboutThisPage: 'About this page',
  whatsNew: "What's New on the Site - Guides",
  whatsNewSubtitle: 'We have refreshed the website! We put together a few short, clear guides so you can enjoy the new site with ease.',
  stepLabel: 'Step',
  stepOf: 'of',
  nextStep: 'Next',
  previousStep: 'Back',
  imagePlaceholder: 'English screenshot coming soon',
  catActivities: 'Activity Center',
  catLogin: 'Login',
  catCalendar: 'My Calendar',
  whatsNewSteps: {
    activities: [
      { title: 'Activity Center - Step 1', description: 'Clicking the button takes you to the Activity Center.\nHere you can see the variety of activities you can register for.' },
      { title: 'Activity Center - Step 2', description: '"Lectures & Classes" tab\nHere you can see all the lectures and classes that take place every week, organized in a weekly schedule by hour.' },
      { title: 'Lectures & Classes - Weekly Schedule', description: 'In the weekly schedule you can see the recurring lectures and classes throughout the week at different hours of the day.' },
      { title: 'Lectures & Classes - Info Window', description: 'Clicking any activity in the weekly schedule opens the info window.\nHere you can see information about the activity such as location and time.' },
      { title: 'Lectures & Classes - Legend', description: 'Below the weekly schedule you can see the legend.\nThe colors show how all classes and lectures are divided into different topics.' },
      { title: '"Health & Fitness Club" Tab', description: 'The second tab is the Health & Fitness Club.\nHere you can see all the regular sport activities that take place every week.' },
      { title: 'Health & Fitness Club - Weekly Schedule', description: 'In the weekly schedule you can see the recurring sport activities throughout the week at different hours of the day.' },
      { title: 'Health & Fitness Club - Info Window', description: 'Clicking any activity in the weekly schedule opens the info window.\nHere you can see information about the activity such as location and time.' },
      { title: 'Health & Fitness Club - Legend', description: 'Below the weekly schedule you can see the legend.\nThe colors show how all activities are divided into different topics.' },
      { title: '"Upcoming Lectures, Concerts & Movies" Tab', description: 'The third tab is upcoming lectures, concerts and movies.\nHere you can see one-time activities that do not take place on a recurring weekly basis.' },
      { title: 'Upcoming Events - Activities List', description: 'In the upper part of this tab you can see all the relevant activities listed by date.\nUnder each event you can see its details.' },
      { title: 'Upcoming Events - Calendar Board', description: 'When you scroll down you reach the events calendar.\nHere you can see the same activities from the top of the screen, organized in a year calendar.\nAt the bottom of the calendar you can see a legend similar to other tabs.' },
      { title: 'Upcoming Events - Info Window', description: 'Clicking any activity (either in the activity list or the calendar board) focuses the info on your selection and opens the info window.\nHere you can see the event details:\n• Category\n• Date\n• Time\n• Description\n• Available seats - if there are any, a link to purchase a ticket will also appear.' },
    ],
    login: [
      { title: 'Login - Login Button', description: 'Clicking the login button lets you sign up and log in to the site, opening access to your personal calendar.' },
      { title: 'Login & Sign Up', description: 'If you already have an account, enter your email and password to log in.\nIf you don\'t have an account yet, click the sign up button located below the "Login" button.' },
      { title: 'Login - Sign Up', description: 'Clicking the sign up button takes you to the sign up screen, where you enter your details to access the system:\nname, email and password.' },
      { title: 'Login - Active User', description: 'Once you are logged in, you can see your username at the top right.\nIf you want to log out, click the "Logout" button.' },
    ],
    calendar: [
      { title: 'My Calendar - Entry', description: 'To open your personal calendar, click the "My Calendar" button at the top right of the screen.\nIn the calendar you can see all activities you registered for or are interested in attending.' },
      { title: 'My Calendar - Calendar Screen', description: 'On this screen you can see your personal calendar, by week.\nAbove the calendar grid you can apply filters to find specific events or see all of them.' },
      { title: 'My Calendar - Calendar Grid', description: 'In the calendar grid you can see your activities arranged in a weekly schedule, by hour and day of week.\nThe colors show the category each activity belongs to.' },
      { title: 'My Calendar - Info Window', description: 'Clicking an activity in the calendar grid opens the info window, where you can see all relevant information about the selected activity.' },
      { title: 'My Calendar - My Activities', description: 'Here you can see your activities in a centralized list.\nThe category appears at the top right with its color.\nIf a blue square with an arrow appears, this is a weekly recurring activity.\nClicking an activity in the list opens the info window.' },
      { title: 'My Calendar - More Events', description: 'Clicking the "More Events" button shows you, in the weekly schedule, activities you can register for, in the available time slots in your calendar.' },
      { title: 'My Calendar - More Events in Calendar', description: 'After clicking More Events, rectangles will appear in your calendar representing new activities you can register for, in your available time slots.\nThey will appear in a lighter color with a dashed border.' },
    ],
  },
  heroTitle: 'Welcome to the Shalhevet Home Site',
  heroSubtitle: 'Promoting an optimal and meaningful quality of life, providing diverse services for the elderly population in Kiryat Tivon and the surrounding area',
  ctaToActivities: 'To Activities ❯',
  ctaToUpcoming: 'Upcoming Events ❯',
  ctaToPayment: 'Payment ❯',
  secondaryTitle: 'Culture and Leisure for the General Public',
  secondarySubtitle: 'Multi-purpose day center, supportive community, social club',
  brandName: 'Shalhevet',
  activityCenterTitle: 'Activity Center',
  tabClickInstruction: '👆 Click the buttons below to switch between activity types',
  tabLectures: 'Lectures & Classes',
  tabHealth: 'Health & Fitness Club',
  tabUpcoming: 'Upcoming Lectures, Concerts & Movies',
  weeklyActivitiesIntro: 'Weekly recurring activities - full week view',
  healthAndFitness: 'Health & Fitness',
  healthIntro: 'Weekly health and fitness activities - full week view',
  legend: 'Legend',
  clickActivityForDetails: 'Click on any activity to see details',
  upcomingEventsIntro: 'Upcoming lectures, concerts, and movie screenings',
  clickEventForDetails: 'Click on any event to view details and purchase tickets',
  eventCalendar: 'Event Calendar',
  calendarPickHint: '📅 Click on a date with events to view details',
  seatsAvailable: 'Seats Available',
  eventFull: 'Event Full',
  eventFullLong: 'Event Full - No seats available',
  timeColon: 'Time:',
  dateLabel: 'Date',
  timeLabel: 'Time',
  instructorLabel: 'Instructor',
  locationLabel: 'Location',
  weeklyRecurringNote: 'This activity repeats weekly at the same time.',
  purchaseTickets: 'Purchase Tickets',
  purchaseSoon: 'Purchase feature coming soon!',
  contactCenterNote: 'For more information, contact the activity center.',
  lectureLabel: 'Lecture',
  concertLabel: 'Concert',
  movieLabel: 'Movie',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  noActivitiesThisWeek: 'No activities this week',
  recurringEvent: 'Recurring',
  to: 'to',

  homeUpcomingTitle: 'Upcoming Lectures, Concerts & Movies',
  homeUpcomingViewAll: 'View all upcoming events ❯',
  homeNewsTitle: "What's New at Shalhevet",
  homeNewsCardTitle: 'New at Shalhevet! All the details for renting a venue for an event',
  homeNewsCardCta: 'More details ❯',
  homeNewsCard2Title: 'Browse all Shalhevet activities for the 25-26 year',
  homeNewsCard2Cta: 'View ❯',
  homeAboutTitle: 'About',
  homeAboutBody: 'Shalhevet is a home that promotes optimal and meaningful quality of life and serves as a center that plans, develops, and provides answers, information, content, and diverse services for the elderly population in Kiryat Tivon and the surrounding area. Shalhevet is a vibrant, welcoming, accessible, pleasant, and respectful home for every adult. Anyone can find here a listening ear, a suitable activity, and an opportunity to ease loneliness and create a meaningful quality of life.',
  homeAboutReadMore: 'Read more ❯',
  homeDonationsTitle: 'Donations',
  homeDonationsBody: 'The Shalhevet association continues to provide quality service to senior citizens in Kiryat Tivon. To continue providing service over time, we need monetary donations. The association has approval for tax-deductible donations.',
  homeDonationsCta: 'Donate ❯',
  homeContactTitle: 'Contact Us',
  homeContactAddress: '2 Halivne St., 3601602, Kiryat Tivon',
  homeContactPhone: '04-9535750',
  homeContactEmail: 'shalhevet01@gmail.com',
  homeContactFacebook: 'Visit our Facebook page',
  homeHeroPrimaryCta: 'Multi-purpose day center, supportive community, social club ❯',
  homeNoUpcoming: 'New events coming soon',
  homeAtHour: 'at',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getTranslations = (lang: Language): Translations => {
  switch (lang) {
    case 'he': return hebrewTranslations;
    case 'en': return englishTranslations;
    default: return hebrewTranslations;
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('he');

  const t = getTranslations(language);

  const cycleLanguage = () => {
    setLanguage((prev) => (prev === 'he' ? 'en' : 'he'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, cycleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
