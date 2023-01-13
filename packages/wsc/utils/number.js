/**
 * getNumber
 * stripping all non numeric character but reserve negativity number and decimal precisions
 * and returns a number ( Integer by default, but you can disable rounding, it will return float )
 *
 * getNumber('-1,234.435')      // -1234.435
 * getNumber('-12.54')          // -13
 * getNumber('1,234.445', true) // 1234
 *
 * @param   {string|number} data        input string or number
 * @param   {boolean} [isRound = false] option if you want the number rounded or raw float
 * @returns  {number}
 */
function getNumber(data, isRound = false) {
  let number = parseFloat(String(data).replace(/(?!^-)[^(\d|.)]/g, ''))
  number = Number.isNaN(number) ? 0 : number

  return isRound ? Math.round(number) : number
}
/**
 * Format given data with comma
 *
 * @param {number} data
 * @returns {number}
 */
function commaNumber(data) {
  return data.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

/**
 * Get specific value with given range
 *
 * @param {number} data
 * @param {number} capMin
 * @param {number} capMax
 * @returns {number}
 */
function capNumber(data, capMin, capMax) {
  return Math.min(getNumber(capMax), Math.max(getNumber(data), getNumber(capMin)))
}

/**
 * Format given number with comma
 * @param {number} number
 * @returns {string}
 */
function numberFormat(number) {
  const numberParts = String(getNumber(number)).split('.')
  numberParts[0] = commaNumber(numberParts[0])
  return numberParts.join('.')
}

/**
 * Format given price with comma and decimal
 * @param {price} price
 * @returns {string}
 */
function priceFormat(price) {
  //Check integer type of price then substring the decimal
  const priceString = !Number.isInteger(price)
    ? price.toString().substring(0, price.toString().indexOf('.') + 3)
    : (price += '.00')

  const priceParts = String(priceString).split('.')
  priceParts[0] = commaNumber(priceParts[0])

  //Check a length of the decimal if there is 1 then add 0 for display
  if (priceParts[1]) {
    priceParts[1] = priceParts[1].length === 1 ? (priceParts[1] += '0') : priceParts[1]
  }

  return priceParts.join('.')
}

// TODO : Refactor frontend code to import this file from wild sky components
module.exports = {
  numberFormat,
  priceFormat,
  capNumber,
  commaNumber,
  getNumber,
}
