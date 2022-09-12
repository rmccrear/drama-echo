import axios from "axios";
import axiosRetry from "axios-retry";

const baseURL = `${process.env.REACT_APP_API_PREFIX}`;
const apiInstance = axios.create({
  baseURL: baseURL, // "http://localhost:5000/api/v1",
  timeout: 2000,
  timeoutErrorMessage: "timeout", // use this for timeone message to distinguish between it and canceled requests.
});

const isNetworkError = (error) => error?.message === "Network Error";
//error && // just to make sure
//!error.response && // if there is a response, it reached the server and not a network error
//error.code !== "ECONNABORTED"; // check that it isn't a timeout

const retryCondition = (error) => {
  console.log("check retry condition", error);
  return (
    isNetworkError(error) || // my custom check
    error?.message === "timeout" || // if the server has a cold start, we can retry it
    axiosRetry.isIdempotentRequestError(error)
  );
};

axiosRetry(apiInstance, {
  retries: 10,
  shouldResetTimeout: true,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  onRetry: function onRetry(retryCount, error) {
    console.log("axios retry", retryCount, error);
  },
  retryCondition: retryCondition,
});

const setupEchoDialogAuth = ({ token }) => {
  apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const getApiFetcher = () => {
  return apiInstance;
};
const wakeUpServer = () => {
  axios.get(baseURL);
};

export { setupEchoDialogAuth, getApiFetcher, wakeUpServer };
