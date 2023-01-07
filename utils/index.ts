import * as Device from 'expo-device'

export function ellipsis(
  str: string | undefined,
  head: number,
  tail: number = 0
) {
  if (!str) {
    return ''
  }
  if (str.length <= head + tail) {
    return str
  }
  return str.slice(0, head) + '...' + str.slice(-tail)
}

export const hasDynamicIsland = () => {
  return ['iPhone15,2', 'iPhone15,3'].includes(Device.modelId)
}
