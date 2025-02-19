import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_API_VERSION ||
  "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

const API_KEY = import.meta.env.VITE_APP_API_KEY;

apiClient.interceptors.request.use((config) => {
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "application/json";
  config.headers["X-API-KEY"] = API_KEY;

  return config;
});

export const sendMessage = async (message, sessionId, conversationId) => {
  const PROPERTY_ID = import.meta.env.VITE_APP_PROPERTY_ID;

  const payload = {
    message,
    source: "website_add_on",
    conversationType: "info",
    propertyId: Number(PROPERTY_ID),
    ...(sessionId && { sessionId }),
    ...(conversationId && { conversationId }), // remains a number
  };

  try {
    const response = await apiClient.post("/message/send", payload);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const fetchSingleArticle = async (articleId) => {
  try {
    const response = await apiClient.get(
      `/articles/fetch-single?articleId=${articleId}`
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const storeEvent = async (data) => {
  try {
    const response = await apiClient.post("/event/store", { ...data });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getProperty = async (id) => {
  try {
    const response = await apiClient.get(
      `/property/fetch-single?propertyId=${id}`
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};
