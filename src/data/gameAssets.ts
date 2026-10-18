import { Achievement, InventoryItem, Chapter } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_secret',
    title: 'أول سر',
    description: 'اكتشفتما أول شظية لغز معاً في منتصف الليل',
    iconName: 'Sparkles',
  },
  {
    id: 'detective_eye',
    title: 'عين المحقق',
    description: 'كشفتما سر المكتبة والموقف الغريب بروح فكاهية',
    iconName: 'Search',
  },
  {
    id: 'two_minds',
    title: 'عقلان في لغز',
    description: 'تعاون ثنائي متكامل لفك شفرة مدينة الاحتمالات دون تسرع',
    iconName: 'Compass',
  },
  {
    id: 'heart_whisper',
    title: 'همسة قلب',
    description: 'تبادلتما رسالة حقيقية صادقة كشفت ما وراء الأقنعة',
    iconName: 'HeartHandshake',
  },
  {
    id: 'key_of_story',
    title: 'مفتاح الحكاية',
    description: 'جمعتما 5 قطع أثرية ورموز سحرية في صندوق المغامرة',
    iconName: 'Key',
  },
  {
    id: 'secret_of_mashaer',
    title: 'سرّ الحكاية',
    description: 'أتممتما الحكاية كاملة ووصلتما للنهاية الخاصة بحكايتكما',
    iconName: 'Crown',
  },
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'brass_key',
    title: 'مفتاح نحاسي عتيق',
    description: 'مفتاح قديم بلمعة دافئة خُتم برمز قلب صغير وُجد داخل الظرف المغلق.',
    iconName: 'Key',
    chapter: 1,
  },
  {
    id: 'torn_letter',
    title: 'رسالة نصف مقطوعة',
    description: 'ورقة دافئة بخط مألوف: "فيه كلام مش بيتقال بالصوت، بس العيون بتفهمه."',
    iconName: 'Scroll',
    chapter: 2,
  },
  {
    id: 'silver_moon',
    title: 'رمز القمر الفضي',
    description: 'تميمة صغيرة تعكس ضوء الشمع والنجوم وتهدي الحائرين في مفترق الطرق.',
    iconName: 'Moon',
    chapter: 3,
  },
  {
    id: 'star_map',
    title: 'خريطة النجوم المفقودة',
    description: 'خريطة دقيقة تُرسم مساراتها كلما تلاقت اختيارات بسنت وعمرو.',
    iconName: 'Map',
    chapter: 3,
  },
  {
    id: 'whisper_quill',
    title: 'ريشة البوح الدافئ',
    description: 'ريشة كُتبت بها الصراحة والمشاعر الحقيقية دون خوف من المسافات.',
    iconName: 'Feather',
    chapter: 4,
  },
  {
    id: 'golden_cipher',
    title: 'شفرة المشاعر الذهبية',
    description: 'القرص المكتمل الذي يفك اللغز الأعظم ويفتح الصندوق السري الأخير.',
    iconName: 'ShieldCheck',
    chapter: 5,
  },
];

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    numberArabic: 'الفصل الأول',
    title: 'الرسالة المجهولة',
    subtitle: 'سر في منتصف الليل',
    description: 'ظرف مختوم بالشمع الأحمر يصل في ساعة متأخرة، ومفتاح يبحث عن بابه الأول.',
    icon: 'Mail',
    sceneIds: ['c1_s1', 'c1_s2', 'c1_s3', 'c1_s4', 'c1_s5'],
  },
  {
    id: 2,
    numberArabic: 'الفصل الثاني',
    title: 'مكتبة الحاجات اللي ما اتقالتش',
    subtitle: 'بين السطور والضحكات',
    description: 'رفوف لا نهائية من الذكريات والمواقف اليومية، ومحقق خيالي يحقق في قضية غريبة!',
    icon: 'BookOpen',
    sceneIds: ['c2_s1', 'c2_s2', 'c2_s3', 'c2_s4', 'c2_s5'],
  },
  {
    id: 3,
    numberArabic: 'الفصل الثالث',
    title: 'مدينة الاحتمالات',
    subtitle: 'كل باب يفتح سبيلاً',
    description: 'شوارع مضاءة بفوانيس النجوم، ولغز تعاوني يحمل كل منكما نصف شفرته.',
    icon: 'Compass',
    sceneIds: ['c3_s1', 'c3_s2', 'c3_s3', 'c3_s4', 'c3_s5'],
  },
  {
    id: 4,
    numberArabic: 'الفصل الرابع',
    title: 'ما وراء الأقنعة',
    subtitle: 'دفء الصدق والأمان',
    description: 'جلسة هادئة تحت ظلال الحديقة المسحورة، حيث تسقط الكلمات الرسمية وتنبض القلوب.',
    icon: 'Heart',
    sceneIds: ['c4_s1', 'c4_s2', 'c4_s3', 'c4_s4', 'c4_s5'],
  },
  {
    id: 5,
    numberArabic: 'الفصل الخامس',
    title: 'سرّ الحكاية',
    subtitle: 'النهاية التي لا يعرفها أحد',
    description: 'جمع الشظايا، حل اللغز الكبير، والكشف عن السر الحقيقي الذي بدأ به كل شيء.',
    icon: 'Crown',
    sceneIds: ['c5_s1', 'c5_s2', 'c5_s3', 'c5_s4', 'c5_s5'],
  },
];
