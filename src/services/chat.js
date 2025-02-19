import axios from "axios"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_API_VERSION ||
  "http://localhost:8000/api/v1"

const apiClient = axios.create({
  baseURL: BASE_URL,
})

const API_KEY = import.meta.env.VITE_APP_API_KEY
const PROPERTY_ID = parseInt(import.meta.env.VITE_APP_PROPERTY_ID, 10)

apiClient.interceptors.request.use(config => {
  config.headers.Accept = "application/json"
  config.headers["Content-Type"] = "application/json"
  config.headers["X-API-KEY"] = API_KEY

  // Add propertyId to all GET requests in URL
  if (config.method === 'get') {
    const separator = config.url.includes('?') ? '&' : '?'

    config.url = `${config.url}${separator}propertyId=${PROPERTY_ID}`
  }
  
  // Add propertyId to all POST requests in body
  if (config.method === 'post') {
    config.data = {
      ...config.data,
      propertyId: PROPERTY_ID,
    }
  }

  return config
})

export const sendMessage = async (message, sessionId, conversationId) => {
  const PROPERTY_ID = import.meta.env.VITE_APP_PROPERTY_ID;

  const payload = {
    message,
    source: "website_add_on",
    conversationType: "info",
    propertyId: Number(PROPERTY_ID),
    ...(sessionId && { sessionId }),
    ...(conversationId && { conversationId }),
  }

  try {
    return await apiClient.post("/message/send", payload)
  } catch (error) {
    console.error(error)
  }
}

export const fetchSingleArticle = async articleId => {
  try {
    return await apiClient.get(
      `/articles/fetch-single?articleId=${articleId}`,
    )
  } catch (error) {
    console.error(error)
  }
}

export const storeEvent = async data => {
  try {
    return await apiClient.post("/event/store", { ...data })
  } catch (error) {
    console.error(error)
  }
}

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
