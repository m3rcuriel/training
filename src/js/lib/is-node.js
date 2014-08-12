var isNode = module.exports = function isNode () {
  return (typeof document === 'undefined' || typeof window === 'undefined');
}
