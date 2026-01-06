
import { GoogleGenAI, Type } from "@google/genai";
import { OutlineItem, SEOResult } from '../types';

// Use process.env.API_KEY directly for client initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const slugify = (s: string): string => {
    return (s || "ndgroup").toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const generateOutline = async (bookTitle: string, chaptersCount: number, durationMin: number): Promise<Omit<OutlineItem, 'index'>[]> => {
    const prompt = `Dựa trên tên sách "${bookTitle}", hãy tạo dàn ý kịch bản cho một video YouTube theo phong cách audiobook "nhân văn hóa" dài ${durationMin} phút. Dàn ý cần có khoảng ${chaptersCount} chương nội dung chính. Cấu trúc phải bao gồm: 1. Hook (Móc nối), 2. Intro + POV của người dẫn chuyện, 3. Các chương chính (đặt tiêu đề theo chủ đề có thể có của sách), 4. Kế hoạch hành động 7 ngày, 5. Tóm tắt 3 điểm chính, và 6. Kêu gọi hành động (CTA). Với mỗi mục trong dàn ý, hãy cung cấp 'title' (tiêu đề), 'focus' (nội dung chính của phần đó), và một danh sách 3-4 'actions' (các điểm chính cần nói). Trả lời bằng tiếng Việt.`;

    // Updated to 'gemini-3-pro-preview' for complex reasoning/structuring task
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        focus: { type: Type.STRING },
                        actions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["title", "focus", "actions"]
                }
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateSEO = async (bookTitle: string, durationMin: number): Promise<SEOResult> => {
    const prompt = `Tạo nội dung SEO cho một video YouTube về cuốn sách "${bookTitle}". Video này là một bài phân tích theo phong cách audiobook dài ${durationMin} phút. Hãy cung cấp: 8 tiêu đề hấp dẫn, một danh sách các hashtag liên quan, một danh sách từ khóa, và một phần mô tả video hấp dẫn. Trả lời bằng tiếng Việt.`;

    // Updated to 'gemini-3-pro-preview' for complex reasoning task
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING }
                },
                required: ["titles", "hashtags", "keywords", "description"]
            }
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateScriptBlock = async (item: OutlineItem, bookTitle: string, targetChars: number): Promise<string> => {
    const prompt = `Bạn là một người viết kịch bản cho kênh YouTube nổi tiếng. Phong cách của bạn là một người dẫn chuyện tự nhiên, đàm thoại cho audiobook, kết hợp với góc nhìn cá nhân. Hãy viết kịch bản cho phần có tiêu đề "${item.title}" trong một video về cuốn sách "${bookTitle}". Mục tiêu của phần này là: "${item.focus}". Các điểm chính cần nói là: ${item.actions.join(', ')}. Kịch bản nên dài khoảng ${targetChars} ký tự. Viết bằng giọng văn tự nhiên, hấp dẫn, phù hợp để thu âm. Trả lời bằng tiếng Việt.`;
    
    // Updated to 'gemini-3-flash-preview' for basic text generation task
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
};

export const generateVideoPrompts = async (bookTitle: string, frameRatio: string): Promise<string[]> => {
    const prompt = `Generate 5 cinematic, photorealistic video prompts for background visuals in a YouTube video about the book "${bookTitle}". The prompts should be inspired by the book's main themes (e.g., if about stoicism, think calm nature, ancient architecture; if sci-fi, think cosmic visuals). Each prompt MUST be for the aspect ratio ${frameRatio}. The style should be beautiful, subtle, and non-distracting. Do not include any text or logos. Respond with a JSON array of strings.`;
    
    // Updated to 'gemini-3-flash-preview' for basic text generation task
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateThumbIdeas = async (bookTitle: string, durationMin: number): Promise<string[]> => {
    const durationStr = `${Math.floor(durationMin / 60)}H${(durationMin % 60).toString().padStart(2, "0")}M`;
    const prompt = `Cho một video YouTube về cuốn sách "${bookTitle}", hãy đề xuất 5 ý tưởng văn bản ngắn gọn, có tác động mạnh cho thumbnail. Văn bản phải hấp dẫn và bằng tiếng Việt. Một ý tưởng phải bao gồm thời lượng: ${durationStr}.`;
    
    // Updated to 'gemini-3-flash-preview' for basic text generation task
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
         config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};
