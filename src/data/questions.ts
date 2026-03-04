import { Question, Section } from '../types';

const sources = ['تجميعات المعاصر', 'تجميعات إيهاب', 'أسئلة قياس'];

// Base questions with new metadata
export const baseQuestions: Question[] = [
  // ================= القسم الكمي =================
  {
    id: 'q1',
    section: 'كمي',
    skill: 'الحساب',
    text: 'إذا كان ثمن 3 أقلام 12 ريالاً، فكم ثمن 5 أقلام من نفس النوع؟',
    options: ['15', '18', '20', '24'],
    correctAnswerIndex: 2,
    explanation: 'ثمن القلم الواحد = 12 ÷ 3 = 4 ريالات. إذن ثمن 5 أقلام = 5 × 4 = 20 ريالاً.',
    isRepeated: true,
    strength: 85,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'q2',
    section: 'كمي',
    skill: 'الهندسة',
    text: 'مثلث مساحته 24 سم مربع وطول قاعدته 8 سم، فكم يبلغ ارتفاعه؟',
    options: ['3', '4', '6', '8'],
    correctAnswerIndex: 2,
    explanation: 'مساحة المثلث = (القاعدة × الارتفاع) ÷ 2. إذن 24 = (8 × الارتفاع) ÷ 2. ومنه 4 × الارتفاع = 24، إذن الارتفاع = 6 سم.',
    isRepeated: false,
    strength: 70,
    source: 'أسئلة قياس'
  },
  {
    id: 'q3',
    section: 'كمي',
    skill: 'الجبر',
    text: 'إذا كان س + 3 = 8، فما قيمة 2س؟',
    options: ['5', '10', '16', '20'],
    correctAnswerIndex: 1,
    explanation: 'بحل المعادلة: س = 8 - 3 = 5. إذن قيمة 2س = 2 × 5 = 10.',
    isRepeated: true,
    strength: 60,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'q4',
    section: 'كمي',
    skill: 'الإحصاء',
    text: 'متوسط 3 أعداد هو 15، فما مجموع هذه الأعداد؟',
    options: ['5', '15', '30', '45'],
    correctAnswerIndex: 3,
    explanation: 'المجموع = المتوسط × العدد. المجموع = 15 × 3 = 45.',
    isRepeated: true,
    strength: 90,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'q5',
    section: 'كمي',
    skill: 'الحساب',
    text: 'ما هو العدد الذي إذا ضرب في 4 ثم طرحنا من الناتج 5 أصبح الباقي 15؟',
    options: ['4', '5', '6', '7'],
    correctAnswerIndex: 1,
    explanation: 'نحل عكسياً: 15 + 5 = 20. ثم نقسم على 4: 20 ÷ 4 = 5.',
    isRepeated: false,
    strength: 75,
    source: 'أسئلة قياس'
  },
  {
    id: 'q6',
    section: 'كمي',
    skill: 'الهندسة',
    text: 'مربع طول ضلعه 5 سم، ما هي مساحته؟',
    options: ['10', '20', '25', '30'],
    correctAnswerIndex: 2,
    explanation: 'مساحة المربع = طول الضلع × نفسه. إذن 5 × 5 = 25 سم مربع.',
    isRepeated: true,
    strength: 50,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'q7',
    section: 'كمي',
    skill: 'الجبر',
    text: 'إذا كان 20% من عدد يساوي 40، فما هو هذا العدد؟',
    options: ['100', '150', '200', '250'],
    correctAnswerIndex: 2,
    explanation: '20% تعني الخمس (1/5). إذا كان الخمس يساوي 40، فإن العدد كاملاً = 40 × 5 = 200.',
    isRepeated: true,
    strength: 80,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'q8',
    section: 'كمي',
    skill: 'الحساب',
    text: 'إذا كان مع سارة 60 ريالاً، وأرادت شراء دفاتر سعر الدفتر 4 ريالات، فكم دفتراً يمكنها أن تشتري؟',
    options: ['10', '12', '15', '20'],
    correctAnswerIndex: 2,
    explanation: 'نقسم المبلغ الكلي على سعر الدفتر الواحد: 60 ÷ 4 = 15 دفتراً.',
    isRepeated: false,
    strength: 65,
    source: 'أسئلة قياس'
  },
  {
    id: 'q9',
    section: 'كمي',
    skill: 'الإحصاء',
    text: 'إذا كان متوسط 4 أعداد هو 20، ومجموع 3 منها هو 50، فما هو العدد الرابع؟',
    options: ['10', '20', '30', '40'],
    correctAnswerIndex: 2,
    explanation: 'مجموع الأعداد الأربعة = 4 × 20 = 80. العدد الرابع = 80 - 50 = 30.',
    isRepeated: true,
    strength: 88,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'q10',
    section: 'كمي',
    skill: 'الهندسة',
    text: 'إذا كانت مساحة دائرة 314 سم مربع، فما طول نصف قطرها تقريباً؟ (اعتبر ط = 3.14)',
    options: ['5', '10', '50', '100'],
    correctAnswerIndex: 1,
    explanation: 'مساحة الدائرة = ط × نق². إذن 314 = 3.14 × نق². نق² = 100، إذن نق = 10.',
    isRepeated: true,
    strength: 92,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'q11',
    section: 'كمي',
    skill: 'الجبر',
    text: 'عمر أب 4 أضعاف عمر ابنه، ومجموع عمريهما 50 سنة. فكم عمر الابن؟',
    options: ['10', '15', '20', '40'],
    correctAnswerIndex: 0,
    explanation: 'نفرض عمر الابن س، وعمر الأب 4س. إذن س + 4س = 50. 5س = 50، ومنه س = 10 سنوات.',
    isRepeated: false,
    strength: 85,
    source: 'أسئلة قياس'
  },
  {
    id: 'q12',
    section: 'كمي',
    skill: 'الحساب',
    text: 'قطار يقطع مسافة 240 كم في 3 ساعات، فما هي سرعته؟',
    options: ['60 كم/س', '70 كم/س', '80 كم/س', '90 كم/س'],
    correctAnswerIndex: 2,
    explanation: 'السرعة = المسافة ÷ الزمن. السرعة = 240 ÷ 3 = 80 كم/س.',
    isRepeated: true,
    strength: 78,
    source: 'تجميعات إيهاب'
  },

  // ================= القسم اللفظي =================
  {
    id: 'v1',
    section: 'لفظي',
    skill: 'التناظر اللفظي',
    text: 'سيف : غمد',
    options: ['خنجر : حزام', 'ميت : قبر', 'قلم : ورقة', 'كتاب : مكتبة'],
    correctAnswerIndex: 1,
    explanation: 'العلاقة مكانية (الشيء ومكان حفظه). السيف يحفظ في الغمد، والميت يوضع في القبر.',
    isRepeated: true,
    strength: 95,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'v2',
    section: 'لفظي',
    skill: 'إكمال الجمل',
    text: 'حسن الخلق يذيب الخطايا كما تذيب الشمس .....',
    options: ['الجليد', 'الظلام', 'الغيوم', 'النهار'],
    correctAnswerIndex: 0,
    explanation: 'الشمس تذيب الجليد، وهذا يتناسب مع معنى "يذيب" في بداية الجملة.',
    isRepeated: false,
    strength: 82,
    source: 'أسئلة قياس'
  },
  {
    id: 'v3',
    section: 'لفظي',
    skill: 'الخطأ السياقي',
    text: 'من زاد حياؤه ذهب سروره.',
    options: ['زاد', 'حياؤه', 'ذهب', 'سروره'],
    correctAnswerIndex: 3,
    explanation: 'الكلمة الخاطئة هي "سروره"، والصواب "وقاره" أو أن الجملة الأصلية "من قل حياؤه قل ورعه". الحياء صفة محمودة لا تذهب السرور.',
    isRepeated: true,
    strength: 88,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'v4',
    section: 'لفظي',
    skill: 'استيعاب المقروء',
    text: 'تعتبر الشعاب المرجانية من أهم البيئات البحرية وأكثرها تنوعاً، ولكنها تتعرض لخطر التبييض بسبب ارتفاع درجة حرارة المحيطات. \n\nيفهم من النص أن السبب الرئيسي لتبييض الشعاب المرجانية هو:',
    options: ['التلوث البحري', 'الصيد الجائر', 'الاحتباس الحراري', 'نقص الأكسجين'],
    correctAnswerIndex: 2,
    explanation: 'النص يذكر أن السبب هو "ارتفاع درجة حرارة المحيطات"، وهو ما يرتبط بمفهوم الاحتباس الحراري.',
    isRepeated: true,
    strength: 75,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'v5',
    section: 'لفظي',
    skill: 'التناظر اللفظي',
    text: 'طبيب : مستشفى',
    options: ['معلم : مدرسة', 'مهندس : خوذة', 'نجار : خشب', 'فلاح : زراعة'],
    correctAnswerIndex: 0,
    explanation: 'العلاقة مكانية (الشخص ومكان عمله). الطبيب يعمل في المستشفى، والمعلم يعمل في المدرسة.',
    isRepeated: false,
    strength: 60,
    source: 'أسئلة قياس'
  },
  {
    id: 'v6',
    section: 'لفظي',
    skill: 'المفردة الشاذة',
    text: 'أي الكلمات التالية تعتبر شاذة؟',
    options: ['أسد', 'نمر', 'فهد', 'ذئب'],
    correctAnswerIndex: 3,
    explanation: 'الأسد والنمر والفهد من فصيلة السنوريات (القططيات)، بينما الذئب من فصيلة الكلبيات.',
    isRepeated: true,
    strength: 85,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'v7',
    section: 'لفظي',
    skill: 'إكمال الجمل',
    text: 'لا يمكن تحقيق ..... إلا بالعمل الجاد و ..... المستمر.',
    options: ['النجاح - التكاسل', 'الفشل - الاجتهاد', 'النجاح - الكفاح', 'التطور - التراجع'],
    correctAnswerIndex: 2,
    explanation: 'النجاح يتطلب العمل الجاد والكفاح المستمر، وهي الكلمات الوحيدة التي تستقيم مع المعنى الإيجابي للجملة.',
    isRepeated: true,
    strength: 90,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'v8',
    section: 'لفظي',
    skill: 'التناظر اللفظي',
    text: 'شجرة : غابة',
    options: ['نجمة : سماء', 'مدرسة : فصل', 'يوم : شهر', 'سيارة : شارع'],
    correctAnswerIndex: 2,
    explanation: 'العلاقة (جزء من كل). الشجرة جزء من الغابة، واليوم جزء من الشهر.',
    isRepeated: false,
    strength: 70,
    source: 'أسئلة قياس'
  },
  {
    id: 'v9',
    section: 'لفظي',
    skill: 'الخطأ السياقي',
    text: 'الصديق الحقيقي هو من يقف بجانبك وقت الفرح ويتخلى عنك وقت الضيق.',
    options: ['الحقيقي', 'يقف', 'الفرح', 'يتخلى'],
    correctAnswerIndex: 3,
    explanation: 'الكلمة الخاطئة هي "يتخلى"، والصواب "يساندك" أو "يساعدك"، لأن الصديق الحقيقي لا يتخلى عن صديقه وقت الضيق.',
    isRepeated: true,
    strength: 80,
    source: 'تجميعات إيهاب'
  },
  {
    id: 'v10',
    section: 'لفظي',
    skill: 'المفردة الشاذة',
    text: 'أي الكلمات التالية تعتبر شاذة؟',
    options: ['تفاح', 'برتقال', 'موز', 'جزر'],
    correctAnswerIndex: 3,
    explanation: 'التفاح والبرتقال والموز من الفواكه، بينما الجزر من الخضروات.',
    isRepeated: true,
    strength: 65,
    source: 'تجميعات المعاصر'
  },
  {
    id: 'v11',
    section: 'لفظي',
    skill: 'إكمال الجمل',
    text: 'النجاح لا يحتاج إلى أقدام بل إلى .....',
    options: ['إقدام', 'أحلام', 'أقلام', 'أوهام'],
    correctAnswerIndex: 0,
    explanation: 'الجملة تعتمد على الجناس الناقص بين "أقدام" و"إقدام" (الشجاعة والمبادرة)، وهو المعنى المقصود لتحقيق النجاح.',
    isRepeated: false,
    strength: 88,
    source: 'أسئلة قياس'
  }
];

// Generator function to dynamically create deterministic questions for models
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const generateModelQuestions = (section: Section, modelNumber: number, count: number = 100): Question[] => {
  const random = createSeededRandom(modelNumber + (section === 'كمي' ? 1000 : 2000));
  const generated: Question[] = [];
  
  const pick = <T>(arr: T[]) => arr[Math.floor(random() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
  const randBool = () => random() > 0.5;

  if (section === 'كمي') {
    for (let i = 1; i <= count; i++) {
      const type = randInt(0, 7);
      const source = pick(sources);
      const isRepeated = randBool();
      const strength = randInt(60, 100);

      if (type === 0) {
        const a = randInt(2, 9);
        const b = a * randInt(2, 6);
        const c = randInt(2, 6);
        const ans = (b / a) * c;
        const options = [(ans - c).toString(), (ans + c).toString(), ans.toString(), (ans * 2).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الحساب',
          text: `إذا كان ثمن ${a} أقلام ${b} ريالاً، فكم ثمن ${c} أقلام من نفس النوع؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
          explanation: `ثمن القلم الواحد = ${b} ÷ ${a} = ${b/a} ريالات. إذن ثمن ${c} أقلام = ${c} × ${b/a} = ${ans} ريالاً.`,
          isRepeated, strength, source
        });
      } else if (type === 1) {
        const x = randInt(1, 20);
        const y = randInt(2, 16);
        const m = randInt(2, 5);
        const sum = x + y;
        const ans = y * m;
        const options = [(ans - m).toString(), ans.toString(), (ans + m).toString(), (ans * 2).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الجبر',
          text: `إذا كان س + ${x} = ${sum}، فما قيمة ${m}س؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
          explanation: `بحل المعادلة: س = ${sum} - ${x} = ${y}. إذن قيمة ${m}س = ${m} × ${y} = ${ans}.`,
          isRepeated, strength, source
        });
      } else if (type === 2) {
        const a = randInt(3, 14);
        const ans = a * a;
        const options = [(a * 2).toString(), (a * 4).toString(), ans.toString(), (ans + a).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الهندسة',
          text: `مربع طول ضلعه ${a} سم، ما هي مساحته؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
          explanation: `مساحة المربع = طول الضلع × نفسه = ${a} × ${a} = ${ans} سم مربع.`,
          isRepeated, strength, source
        });
      } else if (type === 3) {
        const w = randInt(3, 12);
        const h = randInt(w + 1, w + 10);
        const ans = w * h;
        const options = [(w + h).toString(), ((w + h) * 2).toString(), ans.toString(), (ans + w).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الهندسة',
          text: `مستطيل طوله ${h} سم وعرضه ${w} سم، ما مساحته؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
          explanation: `مساحة المستطيل = الطول × العرض = ${h} × ${w} = ${ans} سم مربع.`,
          isRepeated, strength, source
        });
      } else if (type === 4) {
        const p = randInt(1, 4) * 10;
        const val = randInt(2, 21) * 10;
        const ans = (val * 100) / p;
        if (Number.isInteger(ans)) {
          const options = [(ans / 2).toString(), ans.toString(), (ans * 2).toString(), (ans + 50).toString()].sort(() => random() - 0.5);
          generated.push({
            id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الحساب',
            text: `إذا كان ${p}% من عدد يساوي ${val}، فما هو هذا العدد؟`,
            options,
            get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
            explanation: `العدد = (${val} × 100) ÷ ${p} = ${ans}.`,
            isRepeated, strength, source
          });
        } else { i--; }
      } else if (type === 5) {
        const count = randInt(3, 7);
        const avg = randInt(10, 39);
        const ans = count * avg;
        const options = [ans.toString(), (ans - avg).toString(), (ans + avg).toString(), (avg * 2).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الإحصاء',
          text: `متوسط ${count} أعداد هو ${avg}، فما مجموع هذه الأعداد؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
          explanation: `المجموع = المتوسط × العدد = ${avg} × ${count} = ${ans}.`,
          isRepeated, strength, source
        });
      } else if (type === 6) {
        const t = randInt(2, 5);
        const v = randInt(6, 11) * 10;
        const d = t * v;
        const options = [(v - 10).toString(), v.toString(), (v + 10).toString(), (v + 20).toString()].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الحساب',
          text: `سيارة تقطع مسافة ${d} كم في ${t} ساعات، فما هي سرعتها؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(v.toString()); },
          explanation: `السرعة = المسافة ÷ الزمن = ${d} ÷ ${t} = ${v} كم/س.`,
          isRepeated, strength, source
        });
      } else {
        const b = randInt(4, 13);
        const h = randInt(4, 13);
        const ans = (b * h) / 2;
        if (Number.isInteger(ans)) {
          const options = [ans.toString(), (ans * 2).toString(), (b + h).toString(), (ans + b).toString()].sort(() => random() - 0.5);
          generated.push({
            id: `m${modelNumber}_q_${i}`, section: 'كمي', skill: 'الهندسة',
            text: `مثلث طول قاعدته ${b} سم وارتفاعه ${h} سم، فما مساحته؟`,
            options,
            get correctAnswerIndex() { return this.options.indexOf(ans.toString()); },
            explanation: `مساحة المثلث = (القاعدة × الارتفاع) ÷ 2 = (${b} × ${h}) ÷ 2 = ${ans} سم مربع.`,
            isRepeated, strength, source
          });
        } else { i--; }
      }
    }
  } else {
    const verbalPairs = [
      { w1: 'أسد', w2: 'عرين', rel: 'مكانية', w3: 'طير', w4: 'عش', w5: 'سمك', w6: 'بحر', w7: 'نحل', w8: 'خلية' },
      { w1: 'طبيب', w2: 'مستشفى', rel: 'مكانية', w3: 'معلم', w4: 'مدرسة', w5: 'نجار', w6: 'منجرة', w7: 'فلاح', w8: 'مزرعة' },
      { w1: 'سيف', w2: 'غمد', rel: 'مكانية', w3: 'ميت', w4: 'قبر', w5: 'قلم', w6: 'مقلمة', w7: 'نقود', w8: 'محفظة' },
      { w1: 'ليل', w2: 'نهار', rel: 'تضاد', w3: 'طويل', w4: 'قصير', w5: 'أبيض', w6: 'أسود', w7: 'غني', w8: 'فقير' },
      { w1: 'شجرة', w2: 'غابة', rel: 'جزء من كل', w3: 'يوم', w4: 'شهر', w5: 'فصل', w6: 'مدرسة', w7: 'غرفة', w8: 'فندق' },
      { w1: 'عين', w2: 'رؤية', rel: 'وظيفة', w3: 'أذن', w4: 'سمع', w5: 'أنف', w6: 'شم', w7: 'عقل', w8: 'تفكير' },
      { w1: 'نار', w2: 'رماد', rel: 'ينتج عنه', w3: 'سحاب', w4: 'مطر', w5: 'اجتهاد', w6: 'نجاح', w7: 'إهمال', w8: 'فشل' },
      { w1: 'جنين', w2: 'طفل', rel: 'مرحلية', w3: 'بذرة', w4: 'شجرة', w5: 'هلال', w6: 'بدر', w7: 'عجين', w8: 'خبز' }
    ];

    const oddWords = [
      { words: ['أسد', 'نمر', 'فهد', 'ذئب'], correct: 'ذئب', exp: 'البقية من فصيلة القططيات.' },
      { words: ['تفاح', 'برتقال', 'موز', 'جزر'], correct: 'جزر', exp: 'البقية من الفواكه.' },
      { words: ['سيارة', 'قطار', 'طائرة', 'دراجة'], correct: 'طائرة', exp: 'البقية وسائل نقل برية.' },
      { words: ['خشب', 'حديد', 'نحاس', 'ألمنيوم'], correct: 'خشب', exp: 'البقية من المعادن.' },
      { words: ['عين', 'أذن', 'أنف', 'قلب'], correct: 'قلب', exp: 'البقية من حواس الإنسان الظاهرة.' }
    ];

    for (let i = 1; i <= count; i++) {
      const source = pick(sources);
      const isRepeated = randBool();
      const strength = randInt(60, 100);
      const type = randInt(0, 1);

      if (type === 0) {
        const pair = pick(verbalPairs);
        const isFirstSet = randBool();
        const qW1 = isFirstSet ? pair.w1 : pair.w3;
        const qW2 = isFirstSet ? pair.w2 : pair.w4;
        const correctStr = isFirstSet ? `${pair.w5} : ${pair.w6}` : `${pair.w7} : ${pair.w8}`;
        const wrong1 = `${pair.w2} : ${pair.w1}`;
        const wrong2 = `${pair.w6} : ${pair.w5}`;
        const wrong3 = `كتاب : مكتبة`;
        
        const options = [correctStr, wrong1, wrong2, wrong3].sort(() => random() - 0.5);
        
        generated.push({
          id: `m${modelNumber}_v_${i}`, section: 'لفظي', skill: 'التناظر اللفظي',
          text: `${qW1} : ${qW2}`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(correctStr); },
          explanation: `العلاقة (${pair.rel}). ${qW1} يرتبط بـ ${qW2} بنفس الطريقة.`,
          isRepeated, strength, source
        });
      } else {
        const odd = pick(oddWords);
        const options = [...odd.words].sort(() => random() - 0.5);
        generated.push({
          id: `m${modelNumber}_v_${i}`, section: 'لفظي', skill: 'المفردة الشاذة',
          text: `أي الكلمات التالية تعتبر شاذة؟`,
          options,
          get correctAnswerIndex() { return this.options.indexOf(odd.correct); },
          explanation: odd.exp,
          isRepeated, strength, source
        });
      }
    }
  }

  return generated;
};

// We can still keep the old functions for backward compatibility or just remove them.
export const questionsBank: Question[] = []; // Empty since we use models now

export const getRandomQuestions = (count: number, section?: Section): Question[] => {
  return generateModelQuestions(section || 'كمي', Math.floor(Math.random() * 1000), count);
};

export const generateCustomQuestions = (
  count: number,
  sections: Section[],
  skills: Skill[]
): Question[] => {
  const pool: Question[] = [];
  
  // Generate a large pool to ensure we have enough questions of the selected skills
  if (sections.includes('كمي')) {
    pool.push(...generateModelQuestions('كمي', Math.floor(Math.random() * 1000), 500));
  }
  if (sections.includes('لفظي')) {
    pool.push(...generateModelQuestions('لفظي', Math.floor(Math.random() * 1000), 500));
  }
  
  // Filter by selected skills
  const filtered = pool.filter(q => skills.includes(q.skill));
  
  // Shuffle
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  
  // Return the requested count (or all if we don't have enough)
  return shuffled.slice(0, count);
};
