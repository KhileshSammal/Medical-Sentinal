
import { GoogleGenAI, Type } from "@google/genai";
import { MedicalReport, EnvironmentData, ChronicLog } from "../types";

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

export const getGuardianBrief = async (
  history: MedicalReport[], 
  env?: EnvironmentData, 
  logs?: ChronicLog[]
): Promise<string> => {
  try {
    const envString = env ? `Current Environment: AQI ${env.aqi}, Temp ${env.temp}C, Humidity ${env.humidity}%.` : '';
    const logsString = logs ? `Recent Symptom Logs: ${JSON.stringify(logs.slice(-5))}` : '';
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this longitudinal health history and environmental data to provide a high-end, concise "Sentinel" brief. Look for correlations between environment and symptoms. History: ${JSON.stringify(history)}. ${envString} ${logsString}`,
      config: {
        systemInstruction: "You are the Medical Sentinel, a sophisticated proactive health guardian. Tone: Clinical, authoritative, efficient. Specifically look for environmental triggers based on the user's location and history. Use markdown.",
      }
    });
    return response.text || "No insights detected.";
  } catch (error) {
    return "Error generating guardian brief.";
  }
};
