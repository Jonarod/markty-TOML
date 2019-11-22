import { expect } from 'chai'
import Encryptio from '../src'

describe('encryptio()', () => {
	describe('Simple', () => {
    it('encryption and decryption works', () => {
      var safe = new Encryptio('0123456789!@#$%^&*()qwertyuiopMN')
      var text = 'Hello World'
      safe.encrypt(text).then( encText => {
        safe.decrypt(encText).then( decText => {
          expect(decText).to.deep.equal(text)
        })
      })
    })
  })
})
