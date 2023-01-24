

function sRandom(seed: number) {
  return function () {
    var t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function seededRandom(seed: number) {
  const genRandom = sRandom(seed) 
  return genRandom()
}

// const generateRandomNumber = seededRandom(2)
// const generateRandomNumber() => 0.7342509443406016
export default seededRandom;