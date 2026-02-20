const API_URL = "http://localhost:5000/api";

/* ========================================
   🔥 COMMON FETCH OPTIONS
======================================== */
const defaultOptions = {
  credentials: "include", // ✅ CRITICAL for cookies
  headers: {
    "Content-Type": "application/json",
  },
};

/* =========================
   AUTH APIs
========================= */

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    ...defaultOptions,
    method: "POST",
  });
};

/* =========================
   CLIENT APIs
========================= */

export const postTask = async (data) => {
  const res = await fetch(`${API_URL}/tasks`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getClientTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/client`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const completeTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
    ...defaultOptions,
    method: "PUT",
  });
  return res.json();
};

/* =========================
   VOLUNTEER APIs
========================= */

export const getOpenTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const acceptTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}/accept`, {
    ...defaultOptions,
    method: "PUT",
  });
  return res.json();
};

export const getVolunteerTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/volunteer`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const submitTask = async (id, note) => {
  const res = await fetch(`${API_URL}/tasks/${id}/submit`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify({ note }),
  });
  return res.json();
};

export const requestUnblock = async () => {
  const res = await fetch(`${API_URL}/tasks/request-unblock`, {
    ...defaultOptions,
    method: "PUT",
  });
  return res.json();
};

/* =========================
   TASK DETAIL
========================= */

export const getTaskById = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    ...defaultOptions,
    method: "GET",
    cache: "no-store", // 🔥 prevents stale cache
  });

  return res.json();
};

/* =========================
   ADMIN APIs
========================= */

export const getAdminStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/admin/users`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const unblockUser = async (id) => {
  const res = await fetch(`${API_URL}/admin/unblock/${id}`, {
    ...defaultOptions,
    method: "PUT",
  });
  return res.json();
};

export const getAllTasksAdmin = async () => {
  const res = await fetch(`${API_URL}/admin/tasks`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const rateTask = async (id, rating, review) => {
  const res = await fetch(`${API_URL}/tasks/${id}/rate`, {
    ...defaultOptions,
    method: "PUT",
    body: JSON.stringify({ rating, review }),
  });
  return res.json();
};

/* =========================
   CHAT APIs
========================= */

export const getChatMessages = async (taskId) => {
  const res = await fetch(`${API_URL}/chat/${taskId}`, {
    ...defaultOptions,
    cache: "no-store",
  });
  return res.json();
};

export const sendChatMessage = async (data) => {
  const res = await fetch(`${API_URL}/chat`, {
    ...defaultOptions,
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const uploadChatFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/chat/upload`, {
    method: "POST",
    credentials: "include", // 🔥 must stay
    body: formData,
  });

  return res.json();
};