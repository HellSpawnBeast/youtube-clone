import axios from "axios";

import { mockRequest } from "./mock/mockApi";

const apiKey = import.meta.env.VITE_YT_API_KEY;

const request = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
  params: {
    key: apiKey,
  },
});

// Without an API key every YouTube request would return 403. Serve local mock
// data instead so the UI can be exercised; a configured key uses the real API.
if (!apiKey) {
  request.defaults.adapter = async (config) => ({
    data: await mockRequest(config.url, config.params || {}),
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });
}

export default request;
