import * as Random from 'expo-random'

if (typeof crypto === 'undefined') {
  global.crypto = {
    web: {
      getRandomBytes: Random.getRandomBytes,
    },
  }
}
