export const setUser = (user) => {
  localStorage.setItem("taskmate_user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("taskmate_user");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem("taskmate_user");
};

export const isLoggedIn = () => {
  return !!getUser();
};
