import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";

/* =========================
   AUTH HEADER
========================= */
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

/* =========================
   AUTH APIs
========================= */

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* =========================
   CLIENT APIs
========================= */

export const postTask = async (data) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getClientTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/client`, {
    headers: authHeader(),
  });
  return res.json();
};

/* =========================
   VOLUNTEER APIs
========================= */

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: authHeader(),
  });
  return res.json();
};

export const acceptTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}/accept`, {
    method: "PUT",
    headers: authHeader(),
  });
  return res.json();
};

export const getVolunteerTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/volunteer`, {
    headers: authHeader(),
  });
  return res.json();
};
export const getTaskById = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    headers: authHeader(),
  });
  return res.json();
};
