module.exports = function read (string) {
  let pos = 0, line = 1, col = 0

  return {
    next,
    peek,
    eof,
    raise
  }
  function next () {
    const ch = string.charAt(pos++)
    if (ch === '\n') {
      line++
      col = 0
      return ch
    }
    col++
    return ch
  }
  function peek () {
    return string.charAt(pos)
  }
  function eof () {
    return peek() === ''
  }
  function raise (err) {
    throw new Error(err, { line, col })
  }
}
