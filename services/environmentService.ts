
import { EnvironmentData, ChronicLog } from "../types";

// Mock implementation as we don't have actual external API keys here
// In a real app, this would call OpenWeatherMap or AirVisual
export const getEnvironmentData = async (): Promise<EnvironmentData> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Simulate real-time variation based on coordinates
        const lat = pos.coords.latitude;
        resolve({
          aqi: 150 + Math.floor(lat % 50), // Typical high AQI in many Indian metros
          temp: 32,
          humidity: 85,
          mainPollutant: "PM 2.5",
          location: "South Delhi Metropolitan",
          timestamp: new Date().toISOString()
        });
      },
      () => {
        resolve({
          aqi: 142,
          temp: 28,
          humidity: 78,
          mainPollutant: "PM 2.5",
          location: "Bengaluru East",
          timestamp: new Date().toISOString()
        });
      }
    );
  });
};

export const checkEnvironmentalCorrelations = (
  currentEnv: EnvironmentData,
  history: ChronicLog[]
): string | null => {
  // Logic: Check if current humidity > 80% and if user has logged respiratory issues in high humidity before
  if (currentEnv.humidity > 80) {
    const previousRespiratoryIssues = history.filter(
      log => (log.symptom === 'Shortness of Breath' || log.symptom === 'Wheezing') && 
              log.envContext && (log.envContext.humidity ?? 0) > 75
    );

    if (previousRespiratoryIssues.length > 0) {
      return `High Correlation Detected: Your records show ${previousRespiratoryIssues.length} respiratory episodes when humidity exceeds 75%. Humidity is currently ${currentEnv.humidity}%. Proactive advisory: Use a dehumidifier and keep inhalers accessible.`;
    }
  }

  if (currentEnv.aqi > 150) {
    return "AQI critical in your sovereign zone (150+). Minimise outdoor exposure for telomere protection.";
  }

  return null;
};
