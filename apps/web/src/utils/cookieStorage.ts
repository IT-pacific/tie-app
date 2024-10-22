import Cookies from "js-cookie";

const setItem = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes
) => {
  return Cookies.set(key, value, { ...options });
};

const getItem = (key: string) => {
  return Cookies.get(key);
};

const removeItem = (key: string) => {
  return Cookies.remove(key);
};

export default {
  setItem,
  getItem,
  removeItem,
};
