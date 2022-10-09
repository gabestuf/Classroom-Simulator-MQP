module.exports = (obj) => {
    let i = 0
    for (const key in obj) {
        i++
    }
    return i
}
