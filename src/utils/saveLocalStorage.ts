export const saveLocalStorage = (key: string, data: string) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  }
  localStorage.setItem(key, data);
};

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};