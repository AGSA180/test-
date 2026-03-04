import React, { useState, useMemo, useEffect } from 'react';
import { getRandomQuestions, generateModelQuestions, generateCustomQuestions } from './data/questions';
import { studyMaterials } from './data/studyMaterial';
import { Question, AnswerRecord, Skill, Section, ModelProgress } from './types';
import { Brain, CheckCircle, XCircle, Printer, RefreshCw, ChevronLeft, BookOpen, Calculator, Target, Lightbulb, BarChart3, Clock, Play, FileText, AlertCircle, ArrowRight, GraduationCap, Flame, Tag, Repeat, Save, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Markdown from 'react-markdown';

type ScreenState = 'start' | 'study' | 'models' | 'custom' | 'test' | 'result';

const TEST_DURATION_SECONDS = 120 * 60; // 120 minutes for 100 questions
const LETTERS = ['أ', 'ب', 'ج', 'د'];

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Models state
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screen === 'test' && timeLeft > 0 && !showExplanation) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && screen === 'test' && !showExplanation) {
      // Auto-submit if time runs out
      submitAnswer(true);
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft, showExplanation]);

  const goToStudy = () => {
    setScreen('study');
  };

  const goToModels = (section: Section) => {
    setSelectedSection(section);
    setScreen('models');
  };

  const startTest = (modelNumber?: number, section?: Section, forceRestart: boolean = false) => {
    if (modelNumber && section) {
      setSelectedModel(modelNumber);
      setSelectedSection(section);
      
      const modelId = `model_${section}_${modelNumber}`;
      
      if (forceRestart) {
        localStorage.removeItem(modelId);
      }
      
      const savedProgress = localStorage.getItem(modelId);
      
      const generatedQuestions = generateModelQuestions(section, modelNumber, 100);
      setQuestions(generatedQuestions);
      
      if (savedProgress) {
        const progress: ModelProgress = JSON.parse(savedProgress);
        if (progress.isCompleted) {
          setAnswers(progress.answers);
          setScreen('result');
          return;
        } else {
          setAnswers(progress.answers);
          setCurrentIndex(progress.currentIndex);
          setTimeLeft(progress.timeLeft);
          setSelectedOption(null);
          setShowExplanation(false);
          setQuestionStartTime(Date.now());
          setScreen('test');
          return;
        }
      }
      
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setShowExplanation(false);
      setTimeLeft(TEST_DURATION_SECONDS);
      setQuestionStartTime(Date.now());
      setScreen('test');
    } else {
      // Random comprehensive test
      setSelectedModel(null);
      setSelectedSection(null);
      setQuestions(getRandomQuestions(100)); // 100 questions for comprehensive too
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setShowExplanation(false);
      setTimeLeft(TEST_DURATION_SECONDS);
      setQuestionStartTime(Date.now());
      setScreen('test');
    }
  };

  const startCustomTest = (count: number, sections: Section[], skills: Skill[], generatedQuestions?: Question[]) => {
    setSelectedModel(null);
    setSelectedSection(null);
    setQuestions(generatedQuestions || generateCustomQuestions(count, sections, skills));
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowExplanation(false);
    setTimeLeft(Math.floor(count * 60 * 1.2)); // 1.2 minutes per question
    setQuestionStartTime(Date.now());
    setScreen('test');
  };

  const saveProgress = (newAnswers: AnswerRecord[], newIndex: number, isCompleted: boolean) => {
    if (selectedModel && selectedSection) {
      const modelId = `model_${selectedSection}_${selectedModel}`;
      const progress: ModelProgress = {
        answers: newAnswers,
        currentIndex: newIndex,
        timeLeft,
        isCompleted
      };
      localStorage.setItem(modelId, JSON.stringify(progress));
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  const submitAnswer = (timeOut = false) => {
    if (selectedOption === null && !timeOut) return;
    
    const currentQ = questions[currentIndex];
    const isCorrect = !timeOut && selectedOption === currentQ.correctAnswerIndex;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    const newAnswers = [...answers, {
      question: currentQ,
      selectedAnswerIndex: timeOut ? -1 : selectedOption!,
      isCorrect,
      timeSpent
    }];
    
    setAnswers(newAnswers);
    setShowExplanation(true);
    
    // Save progress after answering
    saveProgress(newAnswers, currentIndex, false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedOption(null);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      saveProgress(answers, newIndex, false);
    } else {
      saveProgress(answers, currentIndex, true);
      setScreen('result');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-slate-900 font-sans selection:bg-yellow-200 selection:text-yellow-900">
      <header className="bg-yellow-50/80 backdrop-blur-md border-b border-yellow-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">قدرات</h1>
          </div>
          {screen === 'test' && (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm font-semibold transition-colors ${timeLeft < 60 ? 'bg-rose-100 text-rose-700' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {screen === 'start' && <StartScreen onStart={() => startTest()} onStartModel={(model, section) => startTest(model, section)} onStudy={goToStudy} onCustom={() => setScreen('custom')} key="start" />}
          {screen === 'study' && <StudyScreen onStartTest={() => startTest()} onBack={() => setScreen('start')} key="study" />}
          {screen === 'models' && selectedSection && (
            <ModelsScreen 
              section={selectedSection} 
              onStartModel={(modelNumber) => startTest(modelNumber, selectedSection)} 
              onBack={() => setScreen('start')} 
              key="models" 
            />
          )}
          {screen === 'custom' && (
            <CustomTestScreen 
              onStart={startCustomTest}
              onBack={() => setScreen('start')}
              key="custom"
            />
          )}
          {screen === 'test' && (
            <TestScreen 
              key="test"
              question={questions[currentIndex]}
              currentIndex={currentIndex}
              total={questions.length}
              selectedOption={selectedOption}
              showExplanation={showExplanation}
              onOptionSelect={handleOptionSelect}
              onSubmit={() => submitAnswer(false)}
              onNext={nextQuestion}
              onExit={() => setScreen('start')}
            />
          )}
          {screen === 'result' && (
            <ResultScreen 
              key="result"
              answers={answers}
              onRestart={() => selectedModel && selectedSection ? startTest(selectedModel, selectedSection, true) : startTest()}
              onHome={() => setScreen('start')}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-500 font-medium border-t border-yellow-200 mt-auto">
        تصميم وتطوير: <span className="text-amber-600 font-bold">عبدالله الشهري</span>
      </footer>
    </div>
  );
}

function StartScreen({ onStart, onStartModel, onStudy, onCustom }: { onStart: () => void, onStartModel: (model: number, section: Section) => void, onStudy: () => void, onCustom: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold border border-amber-100">
            <Target className="w-4 h-4" />
            <span>الإصدار التجريبي 2026 - +4000 سؤال</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            استعد لاختبار القدرات <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">باحترافية وذكاء</span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            منصة متطورة تقدم لك محاكاة دقيقة لاختبار القدرات العامة (الكمي واللفظي)، مع تحليل ذكي لأدائك وتحديد دقيق لنقاط القوة والضعف.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-amber-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>اختبار شامل (عشوائي)</span>
            </button>
            <button 
              onClick={onStudy}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>المادة التأسيسية</span>
            </button>
          </div>
          
          <div className="flex justify-center sm:justify-start">
            <button 
              onClick={onCustom}
              className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
              <span>تخصيص اختبار مخصص</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FeatureCard 
            icon={<Calculator className="w-6 h-6 text-fuchsia-500" />}
            bg="bg-fuchsia-50"
            title="القسم الكمي"
            desc="أكثر من 2000 سؤال في الحساب والهندسة والجبر."
            onClick={() => {
              document.getElementById('models-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-rose-500" />}
            bg="bg-rose-50"
            title="القسم اللفظي"
            desc="أكثر من 2000 سؤال في التناظر وإكمال الجمل."
            onClick={() => {
              document.getElementById('models-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6 text-pink-500" />}
            bg="bg-pink-50"
            title="تحليل الأداء"
            desc="تقارير مفصلة ورسوم بيانية توضح مستواك."
          />
          <FeatureCard 
            icon={<Printer className="w-6 h-6 text-purple-500" />}
            bg="bg-purple-50"
            title="طباعة الاختبارات"
            desc="إمكانية طباعة الأسئلة والشرح للمراجعة الورقية."
          />
        </div>
      </div>

      <div id="models-section" className="pt-8 border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">نماذج الاختبارات</h2>
          <p className="text-lg text-slate-600">اختر النموذج للبدء أو إكمال الاختبار. كل نموذج يحتوي على 100 سؤال.</p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-fuchsia-500" />
              نماذج القسم الكمي
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => i + 1).map(modelNumber => (
                <ModelCard key={`quant-${modelNumber}`} section="كمي" modelNumber={modelNumber} onStart={() => onStartModel(modelNumber, 'كمي')} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-rose-500" />
              نماذج القسم اللفظي
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => i + 1).map(modelNumber => (
                <ModelCard key={`verbal-${modelNumber}`} section="لفظي" modelNumber={modelNumber} onStart={() => onStartModel(modelNumber, 'لفظي')} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ModelCard({ section, modelNumber, onStart }: { section: Section, modelNumber: number, onStart: () => void }) {
  const modelId = `model_${section}_${modelNumber}`;
  const savedProgress = localStorage.getItem(modelId);
  let progress: ModelProgress | null = null;
  if (savedProgress) {
    progress = JSON.parse(savedProgress);
  }

  const isCompleted = progress?.isCompleted;
  const answeredCount = progress?.answers.length || 0;
  const hasStarted = answeredCount > 0;

  const getDifficulty = (num: number) => {
    if (num <= 2) return { label: 'سهل', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (num <= 4) return { label: 'متوسط', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'صعب', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };
  const difficulty = getDifficulty(modelNumber);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-all hover:border-amber-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl">
          {modelNumber}
        </div>
        <div className="flex flex-col gap-2 items-end">
          {isCompleted ? (
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> مكتمل
            </span>
          ) : hasStarted ? (
            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> قيد التقدم
            </span>
          ) : (
            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
              جديد
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${difficulty.color}`}>
            {difficulty.label}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2">النموذج {modelNumber}</h3>
      
      <div className="mt-auto pt-4">
        {hasStarted && !isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>التقدم</span>
              <span>{answeredCount} / 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(answeredCount / 100) * 100}%` }}></div>
            </div>
          </div>
        )}

        <button
          onClick={onStart}
          className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isCompleted 
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
              : hasStarted 
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {isCompleted ? (
            <>
              <BarChart3 className="w-4 h-4" />
              <span>عرض النتيجة</span>
            </>
          ) : hasStarted ? (
            <>
              <Play className="w-4 h-4" />
              <span>إكمال الاختبار</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>بدء الاختبار</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StudyScreen({ onStartTest, onBack }: { onStartTest: () => void, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'quant' | 'verbal'>('quant');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">المادة التأسيسية</h2>
          <p className="text-slate-600">راجع أهم القواعد والاستراتيجيات قبل بدء الاختبار المحاكي</p>
        </div>
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="flex border-b border-pink-100">
          <button
            onClick={() => setActiveTab('quant')}
            className={`flex-1 py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'quant' ? 'bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-500' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calculator className="w-5 h-5" />
            القسم الكمي
          </button>
          <button
            onClick={() => setActiveTab('verbal')}
            className={`flex-1 py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'verbal' ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BookOpen className="w-5 h-5" />
            القسم اللفظي
          </button>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {studyMaterials.map((material) => (
              material.id === activeTab && (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${activeTab === 'quant' ? 'text-fuchsia-700' : 'text-rose-700'}`}>
                      {material.title}
                    </h3>
                    <p className="text-slate-600">{material.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {material.topics.map((topic, index) => (
                      <div key={index} className={`p-5 rounded-2xl border ${activeTab === 'quant' ? 'bg-fuchsia-50/50 border-fuchsia-100' : 'bg-rose-50/50 border-rose-100'}`}>
                        <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${activeTab === 'quant' ? 'text-fuchsia-700' : 'text-rose-700'}`}>
                          <Lightbulb className="w-5 h-5" />
                          {topic.name}
                        </h4>
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {topic.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onStartTest}
          className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>بدء الاختبار المحاكي</span>
        </button>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, bg, title, desc, onClick }: { icon: React.ReactNode, bg: string, title: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-pink-300 hover:-translate-y-1' : ''}`}
    >
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestScreen({ 
  question, 
  currentIndex, 
  total, 
  selectedOption, 
  showExplanation, 
  onOptionSelect, 
  onSubmit, 
  onNext,
  onExit
}: {
  question: Question;
  currentIndex: number;
  total: number;
  selectedOption: number | null;
  showExplanation: boolean;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const isCorrect = selectedOption === question.correctAnswerIndex;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between mb-4 print:hidden">
        <button 
          onClick={onExit}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ وخروج</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة السؤال</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 print:hidden">
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">السؤال</span>
            <div className="text-2xl font-extrabold text-slate-800">
              {currentIndex + 1} <span className="text-slate-400 text-lg font-medium">/ {total}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold border border-pink-100 flex items-center gap-1">
              <Tag className="w-3 h-3" /> {question.section} - {question.skill}
            </span>
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold border border-purple-100 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {question.source}
            </span>
            <span className={`${question.isRepeated ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1`}>
              <Repeat className="w-3 h-3" /> {question.isRepeated ? 'متكرر' : 'جديد'}
            </span>
            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-semibold border border-rose-100 flex items-center gap-1">
              <Flame className="w-3 h-3" /> قوة السؤال: {question.strength}%
            </span>
          </div>
        </div>
        <div className="w-full bg-pink-100 rounded-full h-1.5" dir="ltr">
          <div 
            className="bg-pink-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-10 leading-relaxed whitespace-pre-wrap">
          {question.text}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            let optionStyles = "border-slate-200 hover:border-pink-300 hover:bg-pink-50/50 text-slate-700 cursor-pointer";
            let letterStyles = "bg-slate-100 text-slate-600";
            
            if (selectedOption === index) {
              optionStyles = "border-pink-500 bg-pink-50 text-pink-900 ring-1 ring-pink-500 shadow-sm";
              letterStyles = "bg-pink-500 text-white";
            }

            if (showExplanation) {
              if (index === question.correctAnswerIndex) {
                optionStyles = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 shadow-sm";
                letterStyles = "bg-emerald-500 text-white";
              } else if (selectedOption === index) {
                optionStyles = "border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500 shadow-sm";
                letterStyles = "bg-rose-500 text-white";
              } else {
                optionStyles = "border-slate-200 opacity-50 text-slate-500 cursor-default";
              }
            }

            return (
              <button
                key={index}
                onClick={() => onOptionSelect(index)}
                disabled={showExplanation}
                className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${optionStyles}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors ${letterStyles}`}>
                  {LETTERS[index]}
                </div>
                <span className="text-lg font-medium flex-1">{option}</span>
                {showExplanation && index === question.correctAnswerIndex && (
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                )}
                {showExplanation && selectedOption === index && index !== question.correctAnswerIndex && (
                  <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Actions */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className={`p-6 rounded-3xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {isCorrect ? 'إجابة صحيحة، أحسنت!' : 'إجابة خاطئة، لا بأس!'}
                  </h4>
                  <div className="bg-white/60 rounded-xl p-4 mt-3 border border-white/40">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      <span className="text-pink-600 font-bold flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4" /> فكرة الحل:
                      </span>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end print:hidden">
        {!showExplanation ? (
          <button
            onClick={onSubmit}
            disabled={selectedOption === null}
            className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-md cursor-pointer"
          >
            تأكيد الإجابة
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-md shadow-pink-200 flex items-center gap-2 cursor-pointer"
          >
            <span>{currentIndex === total - 1 ? 'عرض التقرير الشامل' : 'السؤال التالي'}</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ResultScreen({ answers, onRestart, onHome }: { answers: AnswerRecord[], onRestart: () => void, onHome: () => void }) {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const percentage = Math.round((correctCount / total) * 100);
  const totalTime = answers.reduce((acc, curr) => acc + curr.timeSpent, 0);
  const avgTime = Math.round(totalTime / total);

  const [aiStudyPlan, setAiStudyPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState<Record<number, boolean>>({});

  const getSectionStats = (sectionAnswers: AnswerRecord[]) => {
    if (sectionAnswers.length === 0) return null;
    const correct = sectionAnswers.filter(a => a.isCorrect).length;
    const secTotal = sectionAnswers.length;
    const secPercentage = Math.round((correct / secTotal) * 100);
    const time = sectionAnswers.reduce((acc, curr) => acc + curr.timeSpent, 0);
    
    const skills: Record<string, { total: number; correct: number; percentage: number }> = {};
    sectionAnswers.forEach(a => {
      if (!skills[a.question.skill]) {
        skills[a.question.skill] = { total: 0, correct: 0, percentage: 0 };
      }
      skills[a.question.skill].total += 1;
      if (a.isCorrect) {
        skills[a.question.skill].correct += 1;
      }
    });

    Object.keys(skills).forEach(key => {
      skills[key].percentage = Math.round((skills[key].correct / skills[key].total) * 100);
    });

    const weakSkills = Object.entries(skills)
      .filter(([_, data]) => (data.correct / data.total) < 0.7)
      .map(([skill]) => skill as Skill);

    let level = '';
    let color = '';
    if (secPercentage >= 80) { level = 'متميز'; color = 'text-emerald-700 bg-emerald-50 border-emerald-200'; }
    else if (secPercentage >= 65) { level = 'جيد'; color = 'text-amber-700 bg-amber-50 border-amber-200'; }
    else { level = 'يحتاج تطوير'; color = 'text-rose-700 bg-rose-50 border-rose-200'; }

    return { correct, total: secTotal, percentage: secPercentage, time, skills, weakSkills, level, color };
  };

  const quantStats = getSectionStats(answers.filter(a => a.question.section === 'كمي'));
  const verbalStats = getSectionStats(answers.filter(a => a.question.section === 'لفظي'));

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const { generateStudyPlan } = await import('./services/ai');
      const weakSkills = [
        ...(quantStats?.weakSkills || []),
        ...(verbalStats?.weakSkills || [])
      ];
      const plan = await generateStudyPlan(weakSkills, quantStats?.percentage || 0, verbalStats?.percentage || 0);
      setAiStudyPlan(plan);
    } catch (error) {
      console.error(error);
      setAiStudyPlan("حدث خطأ أثناء توليد الخطة الدراسية.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleGenerateExplanation = async (index: number, answer: AnswerRecord) => {
    setIsGeneratingExplanation(prev => ({ ...prev, [index]: true }));
    try {
      const { generateExplanation } = await import('./services/ai');
      const explanation = await generateExplanation(
        answer.question.text,
        answer.question.options,
        answer.question.correctAnswerIndex,
        answer.selectedAnswerIndex === -1 ? null : answer.selectedAnswerIndex
      );
      setAiExplanations(prev => ({ ...prev, [index]: explanation }));
    } catch (error) {
      console.error(error);
      setAiExplanations(prev => ({ ...prev, [index]: "حدث خطأ أثناء توليد الشرح." }));
    } finally {
      setIsGeneratingExplanation(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto print:max-w-full"
    >
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h2 className="text-3xl font-extrabold text-slate-900">تقرير الأداء الشامل</h2>
        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة التقرير</span>
          </button>
          <button
            onClick={onRestart}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">إعادة المحاولة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 print:block print:space-y-6">
        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center lg:col-span-1">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className={`${percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-800">{percentage}%</span>
              <span className="text-sm font-medium text-slate-500 mt-1">{correctCount} من {total} إجابات صحيحة</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {percentage >= 80 ? 'مستوى متميز!' : percentage >= 60 ? 'مستوى جيد' : 'تحتاج للمزيد من التدريب'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            {percentage >= 80 
              ? 'أداؤك يعكس استعداداً عالياً لاختبار القدرات.' 
              : 'قمنا بتحديد نقاط الضعف لتركز عليها في دراستك القادمة.'}
          </p>
        </div>

        {/* Stats & Section Analysis */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">متوسط وقت الإجابة</p>
                <p className="text-2xl font-bold text-slate-800">{avgTime} ثانية / سؤال</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">إجمالي الوقت المستغرق</p>
                <p className="text-2xl font-bold text-slate-800">{Math.floor(totalTime / 60)}د {totalTime % 60}ث</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {quantStats && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <Calculator className="w-6 h-6 text-fuchsia-500" />
                    القسم الكمي
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${quantStats.color}`}>
                    {quantStats.level} ({quantStats.percentage}%)
                  </span>
                </div>
                
                <div className="mb-4 flex-1">
                  <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                    <span>الإجابات الصحيحة</span>
                    <span>{quantStats.correct} من {quantStats.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-fuchsia-500 h-2.5 rounded-full" style={{ width: `${quantStats.percentage}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  {quantStats.weakSkills.length > 0 ? (
                    <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                      <p className="text-sm text-rose-800 font-bold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> مهارات تحتاج لتطوير:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {quantStats.weakSkills.map(s => (
                          <span key={s} className="text-xs font-bold bg-white text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm text-emerald-800 font-bold">أداء ممتاز في جميع مهارات القسم الكمي!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {verbalStats && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <BookOpen className="w-6 h-6 text-rose-500" />
                    القسم اللفظي
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${verbalStats.color}`}>
                    {verbalStats.level} ({verbalStats.percentage}%)
                  </span>
                </div>
                
                <div className="mb-4 flex-1">
                  <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                    <span>الإجابات الصحيحة</span>
                    <span>{verbalStats.correct} من {verbalStats.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${verbalStats.percentage}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  {verbalStats.weakSkills.length > 0 ? (
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                      <p className="text-sm text-amber-800 font-bold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> مهارات تحتاج لتطوير:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {verbalStats.weakSkills.map(s => (
                          <span key={s} className="text-xs font-bold bg-white text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm text-emerald-800 font-bold">أداء ممتاز في جميع مهارات القسم اللفظي!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Study Plan */}
      <div className="bg-amber-50 rounded-3xl border border-amber-200 p-8 mb-6 print:hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              المستشار الذكي
            </h3>
            <p className="text-amber-800">احصل على خطة دراسية مخصصة لك بناءً على نقاط ضعفك باستخدام الذكاء الاصطناعي.</p>
          </div>
          <button
            onClick={handleGenerateStudyPlan}
            disabled={isGeneratingPlan}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isGeneratingPlan ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            <span>توليد خطة دراسية</span>
          </button>
        </div>
        
        {aiStudyPlan && (
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm prose prose-amber max-w-none text-slate-800" dir="rtl">
            <Markdown>{aiStudyPlan}</Markdown>
          </div>
        )}
      </div>

      {/* Detailed Review */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 print:break-before-page">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-pink-500" />
          المراجعة التفصيلية
        </h3>
        <div className="space-y-6">
          {answers.map((answer, index) => (
            <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white mt-1 ${answer.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {answer.question.section} - {answer.question.skill}
                      </span>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {answer.question.source}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${answer.question.isRepeated ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Repeat className="w-3 h-3" /> {answer.question.isRepeated ? 'متكرر' : 'جديد'}
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <Flame className="w-3 h-3" /> قوة: {answer.question.strength}%
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {answer.timeSpent}ث
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-3 leading-relaxed whitespace-pre-wrap">
                    {answer.question.text}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {answer.question.options.map((opt, i) => {
                      const isSelected = answer.selectedAnswerIndex === i;
                      const isCorrect = answer.question.correctAnswerIndex === i;
                      
                      let style = "bg-slate-50 border-slate-200 text-slate-600";
                      if (isCorrect) style = "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold";
                      else if (isSelected && !isCorrect) style = "bg-rose-50 border-rose-200 text-rose-800 line-through opacity-70";

                      return (
                        <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${style}`}>
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-emerald-200 text-emerald-900' : isSelected ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'}`}>
                            {LETTERS[i]}
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {!answer.isCorrect && (
                    <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-4 mt-2 mb-4">
                      <p className="text-sm text-pink-900 leading-relaxed">
                        <span className="font-bold flex items-center gap-1 mb-1">
                          <Lightbulb className="w-4 h-4" /> الشرح:
                        </span>
                        {answer.question.explanation}
                      </p>
                    </div>
                  )}

                  {/* AI Tutor Button */}
                  <div className="mt-4 print:hidden">
                    <button
                      onClick={() => handleGenerateExplanation(index, answer)}
                      disabled={isGeneratingExplanation[index]}
                      className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {isGeneratingExplanation[index] ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                      <span>المعلم الذكي: اطلب شرحاً تفصيلياً</span>
                    </button>
                    
                    {aiExplanations[index] && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-3">
                        <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                          {aiExplanations[index]}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CustomTestScreen({ onStart, onBack }: { onStart: (count: number, sections: Section[], skills: Skill[], generatedQuestions?: Question[]) => void, onBack: () => void }) {
  const [count, setCount] = useState(20);
  const [sections, setSections] = useState<Section[]>(['كمي', 'لفظي']);
  const [skills, setSkills] = useState<Skill[]>([
    'الحساب', 'الهندسة', 'الجبر', 'الإحصاء',
    'التناظر اللفظي', 'إكمال الجمل', 'الخطأ السياقي', 'استيعاب المقروء', 'المفردة الشاذة'
  ]);
  const [useAI, setUseAI] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const allSkills: { section: Section, skills: Skill[] }[] = [
    { section: 'كمي', skills: ['الحساب', 'الهندسة', 'الجبر', 'الإحصاء'] },
    { section: 'لفظي', skills: ['التناظر اللفظي', 'إكمال الجمل', 'الخطأ السياقي', 'استيعاب المقروء', 'المفردة الشاذة'] }
  ];

  const toggleSection = (section: Section) => {
    setSections(prev => {
      if (prev.includes(section)) {
        if (prev.length === 1) return prev; // Don't allow empty sections
        // Remove skills associated with this section
        const sectionSkills = allSkills.find(s => s.section === section)?.skills || [];
        setSkills(prevSkills => prevSkills.filter(s => !sectionSkills.includes(s)));
        return prev.filter(s => s !== section);
      } else {
        // Add skills associated with this section
        const sectionSkills = allSkills.find(s => s.section === section)?.skills || [];
        setSkills(prevSkills => [...new Set([...prevSkills, ...sectionSkills])]);
        return [...prev, section];
      }
    });
  };

  const toggleSkill = (skill: Skill) => {
    setSkills(prev => {
      if (prev.includes(skill)) {
        if (prev.length === 1) return prev; // Don't allow empty skills
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleStart = async () => {
    if (sections.length > 0 && skills.length > 0) {
      if (useAI) {
        setIsGenerating(true);
        try {
          const { generateQuestions } = await import('./services/ai');
          const generatedQuestions = await generateQuestions(count, sections, skills);
          if (generatedQuestions && generatedQuestions.length > 0) {
            onStart(count, sections, skills, generatedQuestions);
          } else {
            alert("حدث خطأ أثناء توليد الأسئلة. سيتم استخدام بنك الأسئلة بدلاً من ذلك.");
            onStart(count, sections, skills);
          }
        } catch (error) {
          console.error(error);
          alert("حدث خطأ أثناء توليد الأسئلة. سيتم استخدام بنك الأسئلة بدلاً من ذلك.");
          onStart(count, sections, skills);
        } finally {
          setIsGenerating(false);
        }
      } else {
        onStart(count, sections, skills);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">تخصيص اختبار مخصص</h2>
          <p className="text-slate-600">اختر الأقسام والمهارات وعدد الأسئلة لإنشاء اختبار يناسب احتياجاتك.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Number of Questions */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-500" />
            عدد الأسئلة
          </h3>
          <div className="flex gap-4">
            {[10, 20, 50, 100].map(num => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                  count === num 
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {num} سؤال
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-fuchsia-500" />
            الأقسام
          </h3>
          <div className="flex gap-4">
            {(['كمي', 'لفظي'] as Section[]).map(section => (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  sections.includes(section)
                    ? 'bg-fuchsia-500 text-white shadow-md shadow-fuchsia-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sections.includes(section) && <CheckCircle className="w-4 h-4" />}
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            المهارات
          </h3>
          <div className="space-y-6">
            {allSkills.filter(s => sections.includes(s.section)).map(sectionGroup => (
              <div key={sectionGroup.section}>
                <h4 className="text-sm font-bold text-slate-500 mb-3">{sectionGroup.section}</h4>
                <div className="flex flex-wrap gap-3">
                  {sectionGroup.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        skills.includes(skill)
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {skills.includes(skill) && <CheckCircle className="w-3 h-3" />}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Toggle */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-amber-900 mb-1">توليد أسئلة بالذكاء الاصطناعي</h4>
            <p className="text-amber-700 text-sm mb-4">قم بتوليد أسئلة جديدة وحصرية لاختبارك المخصص باستخدام الذكاء الاصطناعي بدلاً من بنك الأسئلة المعتاد.</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ms-3 text-sm font-bold text-amber-900">{useAI ? 'مفعل' : 'غير مفعل'}</span>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleStart}
            disabled={sections.length === 0 || skills.length === 0 || isGenerating}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري توليد الأسئلة...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>بدء الاختبار المخصص ({count} سؤال)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ModelsScreen({ section, onStartModel, onBack }: { section: Section, onStartModel: (modelNumber: number) => void, onBack: () => void }) {
  const models = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">نماذج القسم {section}</h2>
          <p className="text-slate-600">اختر النموذج للبدء أو إكمال الاختبار. كل نموذج يحتوي على 100 سؤال.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(modelNumber => {
          const modelId = `model_${section}_${modelNumber}`;
          const savedProgress = localStorage.getItem(modelId);
          let progress: ModelProgress | null = null;
          if (savedProgress) {
            progress = JSON.parse(savedProgress);
          }

          const isCompleted = progress?.isCompleted;
          const answeredCount = progress?.answers.length || 0;
          const hasStarted = answeredCount > 0;

          const getDifficulty = (num: number) => {
            if (num <= 2) return { label: 'سهل', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
            if (num <= 4) return { label: 'متوسط', color: 'text-amber-600 bg-amber-50 border-amber-200' };
            return { label: 'صعب', color: 'text-rose-600 bg-rose-50 border-rose-200' };
          };
          const difficulty = getDifficulty(modelNumber);

          return (
            <div key={modelNumber} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-all hover:border-amber-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl">
                  {modelNumber}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {isCompleted ? (
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> مكتمل
                    </span>
                  ) : hasStarted ? (
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> قيد التقدم
                    </span>
                  ) : (
                    <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                      جديد
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">النموذج {modelNumber}</h3>
              
              <div className="mt-auto pt-4">
                {hasStarted && !isCompleted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>التقدم</span>
                      <span>{answeredCount} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(answeredCount / 100) * 100}%` }}></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onStartModel(modelNumber)}
                  className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                      : hasStarted 
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      <span>عرض النتيجة</span>
                    </>
                  ) : hasStarted ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span>إكمال الاختبار</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>بدء الاختبار</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
