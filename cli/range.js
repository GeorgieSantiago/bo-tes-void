let numbers = process.argv.slice(2)
const arr = []
numbers = [...numbers].forEach(num => {
    if(num != 0) {
        arr.push(num)
    }
})
console.log(`Min: ${Math.min(...arr)} Max: ${Math.max(...arr)}`)