
import { GoogleGenAI, Type } from "@google/genai";
import { MedicalReport, EnvironmentData, ChronicLog, FoodScanResult } from "../types";

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

const foodScanSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    brand: { type: Type.STRING },
    servingSize: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        saturatedFat: { type: Type.NUMBER },
        sodium: { type: Type.NUMBER },
        fiber: { type: Type.NUMBER },
        cholesterol: { type: Type.NUMBER }
      }
    },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    novaScore: { type: Type.INTEGER, description: "1-4 (Ultra processed is 4)" },
    healthGrade: { type: Type.STRING, enum: ['A', 'B', 'C', 'D', 'E'] },
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['ALLERGEN', 'HEALTH', 'ADDITIVE'] },
          message: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
        }
      }
    }
  },
  required: ['productName', 'nutrition', 'ingredients', 'novaScore', 'healthGrade']
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

export const analyzeFoodLabel = async (imageBase64: string, userContext?: string): Promise<FoodScanResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: `Analyze this food nutrition label. Extract macronutrients and ingredients. Categorize processing level (NOVA). Provide health grades. Specifically look for allergens or chronic condition conflicts based on this context: ${userContext || 'None'}. Output valid JSON.` },
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: foodScanSchema
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      } as FoodScanResult;
    }
    return null;
  } catch (error) {
    console.error("Food Label Scan Error:", error);
    return null;
  }
};

export const analyzeDiagnosticImage = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          parts: [
            { text: `You are the Medical Sentinel Vision system. Analyze this image carefully based on the following user prompt: "${prompt}". Provide a clinical-grade but accessible brief. Include observations, potential risks, and recommended actions. ALWAYS include a disclaimer that you are an AI and not a substitute for professional medical advice. Use high-end, precise terminology.` },
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/jpeg' } }
          ]
        }
      ],
    });

    return response.text || "Diagnostic analysis failed to generate a response.";
  } catch (error) {
    console.error("Diagnostic Vision Error:", error);
    return "The Sentinel Vision system encountered an error during neural processing.";
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
