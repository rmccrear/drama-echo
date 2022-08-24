import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 1000,
});

const setupEchoDialogAuth = ({ token }) => {
  apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const getApiFetcher = () => {
  return apiInstance;
};

export { setupEchoDialogAuth, getApiFetcher };
