const fs = require('fs')
const read = require('./read')
const tokenizer = require('./tokenizer')
const parser = require('./parsser')

const file = fs.readFileSync('./test.id', 'utf8')
const sourceInput = read(file)
const tokenizedInput = tokenizer(sourceInput)
const parsedInput = parser(tokenizedInput)

console.log(JSON.stringify(parsedInput))
