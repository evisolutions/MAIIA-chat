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

  config.params = {
    translateLanguage: localStorage.getItem("locale"),
  };

  return config;
});

export const sendMessage = async (
  message,
  sessionId,
  conversationId,
  conversationType = "info",
  propertyId = null
) => {
  const payload = {
    message,
    source: "website_add_on",
    conversationType: conversationType,
    propertyId: Number(propertyId),
    ...(sessionId && { sessionId }),
    ...(conversationId && { conversationId }),
  };

  try {
    return await apiClient.post("/message/send", payload);
  } catch (error) {
    console.error(error);
  }
};

export const fetchSingleArticle = async (articleId) => {
  try {
    return await apiClient.get(`/articles/fetch-single?articleId=${articleId}`);
  } catch (error) {
    console.error(error);
  }
};

export const storeEvent = async (data) => {
  try {
    return await apiClient.post("/event/store", { ...data });
  } catch (error) {
    console.error(error);
  }
};

export const getProperty = async (id) => {
  try {
    return await apiClient.get(`/property/fetch-single?propertyId=${id}`);
  } catch (error) {
    console.error(error);
  }
};
