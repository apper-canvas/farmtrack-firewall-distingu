import { getApperClient } from "@/services/apperClient";

export const weatherService = {
  async getCurrentWeather() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('weather_forecast_c', {
        fields: [
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "wind_speed_c"}},
          {"field": {"Name": "visibility_c"}},
          {"field": {"Name": "advice_c"}}
        ],
        pagingInfo: { limit: 1, offset: 0 },
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success || !response.data?.length) {
        // Return default weather if no data
        return {
          temperature: 72,
          condition: "partly cloudy",
          humidity: 65,
          windSpeed: 8,
          visibility: 10,
          agriculturalAdvice: "Good conditions for most farm activities"
        };
      }

      const weatherData = response.data[0];
      return {
        temperature: weatherData.temperature_c || 72,
        condition: weatherData.condition_c || "partly cloudy",
        humidity: weatherData.humidity_c || 65,
        windSpeed: weatherData.wind_speed_c || 8,
        visibility: weatherData.visibility_c || 10,
        agriculturalAdvice: weatherData.advice_c || "Good conditions for most farm activities"
      };
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      // Return default weather on error
      return {
        temperature: 72,
        condition: "partly cloudy",
        humidity: 65,
        windSpeed: 8,
        visibility: 10,
        agriculturalAdvice: "Good conditions for most farm activities"
      };
    }
  },

  async getForecast() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('weather_forecast_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "high_temperature_c"}},
          {"field": {"Name": "low_temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        pagingInfo: { limit: 7, offset: 0 },
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      });

      if (!response.success || !response.data?.length) {
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        date: item.date_c,
        high: item.high_temperature_c || 75,
        low: item.low_temperature_c || 55,
        condition: item.condition_c || "partly cloudy",
        precipitation: item.precipitation_c || 20
      }));
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getWeatherAlerts() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('weather_alert_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "severity_c"}},
          {"field": {"Name": "valid_until_c"}}
        ],
        pagingInfo: { limit: 10, offset: 0 },
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success || !response.data?.length) {
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        severity: item.severity_c,
        validUntil: item.valid_until_c
      }));
    } catch (error) {
      console.error("Error fetching weather alerts:", error?.response?.data?.message || error);
      return [];
    }
  }
};