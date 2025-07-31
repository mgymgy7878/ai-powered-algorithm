// Simple test to verify crypto-js import works
import CryptoJS from 'crypto-js'

export const testCrypto = () => {
  try {
    const message = 'test message'
    const secret = 'test secret'
    const signature = CryptoJS.HmacSHA256(message, secret).toString()
    console.log('Crypto test başarılı, imza:', signature)
    return true
  } catch (error) {
    console.error('Crypto test başarısız:', error)
    return false
  }
}