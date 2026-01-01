
import { GoogleGenAI, Type } from "@google/genai";
import { MedicalReport, HealthStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    labName: { type: Type.STRING },
    date: { type: Type.STRING },
    type: { type: Type.STRING },
    summary: { type: Type.STRING },
    markers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.NUMBER },
          unit: { type: Type.STRING },
          referenceRange: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['OPTIMAL', 'STABLE', 'WARNING', 'CRITICAL'] }
        },
        required: ['name', 'value', 'unit']
      }
    }
  },
  required: ['labName', 'date', 'markers']
};

export const shredMedicalReport = async (imageBase64: string): Promise<MedicalReport | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "You are an elite medical OCR engine. Extract all laboratory data from this Indian lab report (e.g., Apollo, Dr. Lal PathLabs). Map all markers to a structured JSON format. Infer the status based on standard clinical ranges. Be extremely precise." },
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      } as MedicalReport;
    }
    return null;
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};

export const getGuardianBrief = async (history: MedicalReport[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this longitudinal health history and provide a high-end, concise "Sentinel" brief. Look for multi-year trends, potential drug conflicts, and proactive suggestions. History: ${JSON.stringify(history)}`,
      config: {
        systemInstruction: "You are the Medical Sentinel, a sophisticated proactive health guardian. Tone: Clinical, authoritative, efficient. Use markdown.",
      }
    });
    return response.text || "No insights detected.";
  } catch (error) {
    return "Error generating guardian brief.";
  }
};
