import axios from 'axios';
import Cookies from 'js-cookie'; // 👉 не забудь установить: npm install js-cookie
import { API_BASE_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
  },
});

export default axiosInstance;