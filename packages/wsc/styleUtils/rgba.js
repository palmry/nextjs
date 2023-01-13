const hexToRGBA = (hex, a) => {
  hex = hex.replace('#', '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const rgba = (color, op) => hexToRGBA(color, op)
