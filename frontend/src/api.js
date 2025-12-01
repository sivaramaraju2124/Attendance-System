import axios from "axios";

const api = axios.create({
  baseURL: "https://attendance-system-spsv.onrender.com"
});

export default api;
