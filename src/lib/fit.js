import clamp from './clamp'

const fit = (current, in_min, in_max, out_min, out_max) => {
  const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  return clamp(mapped, out_min, out_max)
}

export default fit