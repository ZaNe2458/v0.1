import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.205.137.59:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
