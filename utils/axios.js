import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://appchats-bleach.carloshakim.online"
      : "http://localhost:3000",
});

export default instance;
