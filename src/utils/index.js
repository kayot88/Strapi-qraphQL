const CART_KEY = 'cart';
const TOKEN_KEY = 'jwt';
export const calcPrice = items => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const setItem = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    return localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const getItem = (cartKey = CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey));
  }
  return [];
};

export const setToken = (value, tokenKey=TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenKey, JSON.stringify(value))
  }
  console.error('Noting was saved')
}
