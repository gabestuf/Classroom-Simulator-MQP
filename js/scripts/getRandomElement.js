module.exports = (arr) => {
  const randomElement = arr[Math.floor(Math.random() * arr.length)]
  return randomElement;
};
