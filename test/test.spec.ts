import { expect } from 'chai'
const { sum } = require('../src/funcs')

describe('Calculator', () => {
  describe('Add test', () => {
    it('Should return 3 when a = 1 and b = 2', () => {
      const result = sum(1, 4)

      expect(result).to.equal(5)
    })
  })
})
