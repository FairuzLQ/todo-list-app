import axios from "axios";

const API = axios.create({
  baseURL: "http://94.74.86.174:8080/api",  // Use your actual API base URL
  headers: {
    "Content-Type": "application/json",  // Ensure the content type is set
  },
});

// Add token to header if available (for subsequent requests)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Adding token to headers:", token); // Log token being added
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage");  // Log if no token found
  }
  return config;
});

export default API;
