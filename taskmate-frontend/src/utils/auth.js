// Save token
export const setToken = (token) => {
  localStorage.setItem("taskmate_token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("taskmate_token");
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem("taskmate_token");
};

// Check login
export const isLoggedIn = () => {
  return !!getToken();
};
