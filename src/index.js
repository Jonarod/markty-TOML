var crypto = require("crypto")

class encryptio {
  constructor(password, options){
    this.key = password
    this.iv_length = ((options && options.iv_length) && options.iv_length) || 16
    this.algorithm = ((options && options.iv_length) && options.algorithm) || 'aes-256-cbc'
    this.encoding = ((options && options.iv_length) && options.encoding) || 'base64'
  }
  encrypt(text){
    return new Promise( (resolve) => {
      const iv = crypto.randomBytes(this.iv_length)
      let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv)
      var result = cipher.update(text, "utf8", this.encoding)
      result += cipher.final(this.encoding)
      resolve(iv.toString(this.encoding) + ':' + result)
    })
  }
  decrypt(text){
    return new Promise( (resolve) => {
      let textParts = text.split(':')
      let iv = Buffer.from(textParts.shift(), this.encoding)
      let encryptedText = Buffer.from(textParts.join(':'), this.encoding)
      let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv)
      var result = decipher.update(encryptedText, this.encoding)
      result += decipher.final()
      resolve(result)
    })
  }
}

module.exports = encryptio