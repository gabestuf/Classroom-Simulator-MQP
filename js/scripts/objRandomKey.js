module.exports = (obj) => {
    let keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0]
}
