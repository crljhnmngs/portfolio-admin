module.exports = new Proxy({}, {
  get: () => () => ({ className: '' })
}); 