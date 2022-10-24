//get random array element

module.exports = (arr) => {
  // check to make sure it's an array
  if (typeof arr === "string") {
    return arr;
  }

  const randomElement = arr[Math.floor(Math.random() * arr.length)];
  return randomElement;
};
