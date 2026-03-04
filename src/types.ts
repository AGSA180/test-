export type Section = 'كمي' | 'لفظي';

export type Skill = 
  | 'الحساب' 
  | 'الهندسة' 
  | 'الجبر' 
  | 'الإحصاء' 
  | 'التناظر اللفظي' 
  | 'إكمال الجمل' 
  | 'الخطأ السياقي' 
  | 'استيعاب المقروء'
  | 'المفردة الشاذة';

export interface Question {
  id: string;
  section: Section;
  skill: Skill;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  isRepeated: boolean;
  strength: number; // نسبة قوة السؤال (0-100)
  source: string; // مصدر السؤال (المعاصر، إيهاب، قياس، إلخ)
}

export interface AnswerRecord {
  question: Question;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface ModelProgress {
  answers: AnswerRecord[];
  currentIndex: number;
  timeLeft: number;
  isCompleted: boolean;
}
