module.exports = function tokenizer (input) {
  let current = null
  const keywords = ' if then else true false '
  const comparators = '?!-<>=0123456789'
  const operators = '+-*/%=&|<>!'
  return {
    next,
    peek,
    eof,
    raise: input.raise
  }

  function isKeyword (x) {
    return keywords.indexOf(' ' + x + ' ') >= 0
  }
  function isDigit (ch) {
    return /[0-9]/i.test(ch)
  }
  function isIdStart (ch) {
    return /[a-z_]/i.test(ch)
  }
  function isId (ch) {
    return isIdStart(ch) || comparators.indexOf(ch) >= 0
  }
  function isOpChar (ch) {
    return operators.indexOf(ch) >= 0
  }
  function isPunc (ch) {
    return ',;(){}[]'.indexOf(ch) >= 0
  }
  function isWhitespace (ch) {
    return ' \t\n'.indexOf(ch) >= 0
  }
  function readWhile (predicate) {
    let str = ''
    while (!input.eof() && predicate(input.peek()))
      str += input.next()
    return str
  }
  function readNumber () {
    let hasDot = false
    let number = readWhile(function(ch) {
      if (ch === '.') {
        if (hasDot) return false
        hasDot = true
        return true
      }
      return isDigit(ch)
    })
    return { type: 'num', value: parseFloat(number) }
  }
  function readIndent () {
    let id = readWhile(isId)
    return {
      type: isKeyword(id) ? 'kw' : 'var',
      value: id
    }
  }
  function readEscaped (end) {
    let escaped = false, str = ''
    input.next()
    while (!input.eof()) {
      let ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      }
      else if (ch === '\\') {
        escaped = true
      }
      else if (ch === end) {
        break
      }
      else {
        str += ch
      }
    }
    return str
  }
  function readString () {
    return { type: 'str', value: readEscaped('"') }
  }
  function skipComment () {
    readWhile(function (ch) {
      return ch !== '\n'
    })
    input.next()
  }
  function readNext () {
    readWhile(isWhitespace)
    if (input.eof()) return null
    let ch = input.peek()
    if (ch === '#') {
      skipComment()
      return readNext()
    }
    if (ch === '"') return readString()
    if (isDigit(ch)) return readNumber()
    if (isIdStart(ch)) return readIndent()
    if (isPunc(ch)) return {
      type: 'punc',
      value: input.next()
    }
    if (isOpChar(ch)) return {
      type: 'op',
      value: readWhile(isOpChar)
    }
    input.raise('Unable to parse character ', ch)
  }
  function peek () {
    return current || (current = readNext())
  }
  function next () {
    let tok = current
    current = null
    return tok || readNext()
  }
  function eof () {
    return peek() === null
  }
}
