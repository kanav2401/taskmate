const API_URL = "http://localhost:5000/api";

/* =========================
   AUTH APIs
========================= */

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

/* =========================
   CLIENT APIs
========================= */

export const postTask = async (data) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getClientTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/client`, {
    credentials: "include",
  });
  return res.json();
};

export const completeTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};

/* =========================
   VOLUNTEER APIs
========================= */

export const getOpenTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    credentials: "include",
  });
  return res.json();
};

export const acceptTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}/accept`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};

export const getVolunteerTasks = async () => {
  const res = await fetch(`${API_URL}/tasks/volunteer`, {
    credentials: "include",
  });
  return res.json();
};

export const submitTask = async (id, note) => {
  const res = await fetch(`${API_URL}/tasks/${id}/submit`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  return res.json();
};

export const requestUnblock = async () => {
  const res = await fetch(`${API_URL}/tasks/request-unblock`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};

/* =========================
   TASK DETAIL
========================= */

export const getTaskById = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store", // 🔥 prevents 304 caching
  });

  return res.json();
};


/* =========================
   ADMIN APIs
========================= */

export const getAdminStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    credentials: "include",
  });
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/admin/users`, {
    credentials: "include",
  });
  return res.json();
};

export const unblockUser = async (id) => {
  const res = await fetch(`${API_URL}/admin/unblock/${id}`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};

export const getAllTasksAdmin = async () => {
  const res = await fetch(`${API_URL}/admin/tasks`, {
    credentials: "include",
  });
  return res.json();
};

export const rateTask = async (id, rating, review) => {
  const res = await fetch(`${API_URL}/tasks/${id}/rate`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, review }),
  });
  return res.json();
};
/* =========================
   CHAT APIs
========================= */

export const getChatMessages = async (taskId) => {
  const res = await fetch(`${API_URL}/chat/${taskId}`, {
    credentials: "include",
  });
  return res.json();
};

export const sendChatMessage = async (data) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
