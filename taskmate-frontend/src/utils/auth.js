// TOKEN
export const setToken = (token) => {
  localStorage.setItem("taskmate_token", token);
};

export const getToken = () => {
  return localStorage.getItem("taskmate_token");
};

export const removeToken = () => {
  localStorage.removeItem("taskmate_token");
  localStorage.removeItem("taskmate_user");
};

// USER
export const setUser = (user) => {
  localStorage.setItem("taskmate_user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("taskmate_user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return !!getToken();
};
