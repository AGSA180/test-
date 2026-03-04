import { GoogleGenAI, Type } from "@google/genai";
import { Question, Section, Skill } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generateExplanation(questionText: string, options: string[], correctAnswerIndex: number, studentAnswerIndex: number | null): Promise<string> {
    const prompt = `
    أنت معلم خبير في اختبار القدرات السعودية (قياس).
    السؤال: ${questionText}
    الخيارات: ${options.join("، ")}
    الإجابة الصحيحة هي: ${options[correctAnswerIndex]}
    إجابة الطالب كانت: ${studentAnswerIndex !== null ? options[studentAnswerIndex] : 'لم يجب'}

    اشرح للطالب خطوة بخطوة لماذا الإجابة الصحيحة هي الصحيحة، وكيف يمكنه التفكير في مثل هذا السؤال مستقبلاً. إذا كانت إجابة الطالب خاطئة، وضح له الخطأ الشائع الذي ربما وقع فيه. استخدم لغة مشجعة وواضحة.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || "عذراً، لم أتمكن من توليد الشرح في الوقت الحالي.";
    } catch (error) {
        console.error("Error generating explanation:", error);
        return "عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي.";
    }
}

export async function generateStudyPlan(weakSkills: string[], quantScore: number, verbalScore: number): Promise<string> {
    const prompt = `
    أنت مستشار أكاديمي لاختبار القدرات (قياس).
    درجة الطالب في القسم الكمي: ${quantScore}%
    درجة الطالب في القسم اللفظي: ${verbalScore}%
    نقاط الضعف (المهارات التي تحتاج تطوير): ${weakSkills.join("، ")}

    اكتب خطة دراسية مخصصة وعملية لهذا الطالب لتحسين درجاته. قسم الخطة إلى خطوات يومية أو أسبوعية، وقدم نصائح محددة لكل مهارة ضعيفة. استخدم تنسيق Markdown لترتيب الخطة بشكل جميل (عناوين، قوائم نقطية، عريض).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || "عذراً، لم أتمكن من توليد الخطة في الوقت الحالي.";
    } catch (error) {
        console.error("Error generating study plan:", error);
        return "عذراً، حدث خطأ أثناء توليد الخطة الدراسية.";
    }
}

export async function generateQuestions(count: number, sections: Section[], skills: Skill[]): Promise<Question[]> {
    const prompt = `
    قم بتوليد ${count} أسئلة لاختبار القدرات السعودية (قياس) للأقسام التالية: ${sections.join(" و ")}.
    ركز على المهارات التالية: ${skills.join("، ")}.
    يجب أن تكون الأسئلة دقيقة، واقعية، وتشبه أسئلة قياس الفعلية.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Unique ID like q_ai_1" },
                            text: { type: Type.STRING, description: "The question text" },
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Exactly 4 options"
                            },
                            correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                            explanation: { type: Type.STRING, description: "Short explanation of the answer" },
                            section: { type: Type.STRING, description: "كمي or لفظي" },
                            skill: { type: Type.STRING, description: "The specific skill tested" },
                            difficulty: { type: Type.NUMBER, description: "Difficulty from 1 to 5" },
                            source: { type: Type.STRING, description: "Put 'توليد الذكاء الاصطناعي'" },
                            isRepeated: { type: Type.BOOLEAN, description: "Always false" },
                            strength: { type: Type.NUMBER, description: "Random number between 70 and 99" }
                        },
                        required: ["id", "text", "options", "correctAnswerIndex", "explanation", "section", "skill", "difficulty", "source", "isRepeated", "strength"]
                    }
                }
            }
        });

        const jsonStr = response.text || "[]";
        const questions: Question[] = JSON.parse(jsonStr);
        return questions;
    } catch (error) {
        console.error("Failed to generate AI questions", error);
        return [];
    }
}
