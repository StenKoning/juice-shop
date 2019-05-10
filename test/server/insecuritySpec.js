const chai = require('chai')
const expect = chai.expect

describe('insecurity', () => {
  const insecurity = require('../../lib/insecurity')

  describe('cutOffPoisonNullByte', () => {
    it('returns string unchanged if it contains no null byte', () => {
      expect(insecurity.cutOffPoisonNullByte('file.exe.pdf')).to.equal('file.exe.pdf')
    })

    it('returns string up to null byte', () => {
      expect(insecurity.cutOffPoisonNullByte('file.exe%00.pdf')).to.equal('file.exe')
    })
  })

  describe('userEmailFrom', () => {
    it('returns content of "x-user-email" header if present', () => {
      expect(insecurity.userEmailFrom({ headers: { 'x-user-email': 'test@bla.blubb' } })).to.equal('test@bla.blubb')
    })

    it('returns undefined if header "x-user-email" is not present', () => {
      expect(insecurity.userEmailFrom({ headers: {} })).to.equal(undefined)
      expect(insecurity.userEmailFrom({})).to.equal(undefined)
    })
  })

  describe('generateCoupon', () => {
    const z85 = require('z85')

    it('returns base85-encoded month, year and discount as coupon code', () => {
      const coupon = insecurity.generateCoupon(20, new Date('1980-01-01'))
      expect(coupon).to.equal('n<MiifFb4l')
      expect(z85.decode(coupon).toString()).to.equal('JAN80-20')
    })

    it('uses current month and year if not specified', () => {
      const coupon = insecurity.generateCoupon(20)
      expect(coupon).to.equal(insecurity.generateCoupon(20, new Date()))
    })

    it('does not encode day of month or time into coupon code', () => {
      const coupon = insecurity.generateCoupon(10, new Date('December 01, 1999'))
      expect(coupon).to.equal(insecurity.generateCoupon(10, new Date('December 01, 1999 01:00:00')))
      expect(coupon).to.equal(insecurity.generateCoupon(10, new Date('December 02, 1999')))
      expect(coupon).to.equal(insecurity.generateCoupon(10, new Date('December 31, 1999 23:59:59')))
    })
  })

  describe('discountFromCoupon', () => {
    const z85 = require('z85')

    it('returns undefined when not passing in a coupon code', () => {
      expect(insecurity.discountFromCoupon(undefined)).to.equal(undefined)
      expect(insecurity.discountFromCoupon(null)).to.equal(undefined)
    })

    it('returns undefined for malformed coupon code', () => {
      expect(insecurity.discountFromCoupon('')).to.equal(undefined)
      expect(insecurity.discountFromCoupon('x')).to.equal(undefined)
      expect(insecurity.discountFromCoupon('___')).to.equal(undefined)
    })

    it('returns undefined for coupon code not according to expected pattern', () => {
      expect(insecurity.discountFromCoupon(z85.encode('Test'))).to.equal(undefined)
      expect(insecurity.discountFromCoupon(z85.encode('XXX00-10'))).to.equal(undefined)
      expect(insecurity.discountFromCoupon(z85.encode('DEC18-999'))).to.equal(undefined)
      expect(insecurity.discountFromCoupon(z85.encode('DEC18-1'))).to.equal(undefined)
      expect(insecurity.discountFromCoupon(z85.encode('DEC2018-10'))).to.equal(undefined)
    })

    it('returns undefined for expired coupon code', () => {
      expect(insecurity.discountFromCoupon(z85.encode('SEP14-50'))).to.equal(undefined)
    })

    it('returns discount from valid coupon code', () => {
      expect(insecurity.discountFromCoupon(insecurity.generateCoupon('05'))).to.equal(5)
      expect(insecurity.discountFromCoupon(insecurity.generateCoupon(10))).to.equal(10)
      expect(insecurity.discountFromCoupon(insecurity.generateCoupon(99))).to.equal(99)
    })
  })

  describe('authenticatedUsers', () => {
    it('returns user by associated token', () => {
      insecurity.authenticatedUsers.put('11111', { data: { id: 1 } })

      expect(insecurity.authenticatedUsers.get('11111')).to.deep.equal({ data: { id: 1 } })
    })

    it('returns undefined if no token is passed in', () => {
      expect(insecurity.authenticatedUsers.get(undefined)).to.equal(undefined)
      expect(insecurity.authenticatedUsers.get(null)).to.equal(undefined)
    })

    it('returns token by associated user', () => {
      insecurity.authenticatedUsers.put('11111', { data: { id: 1 } })

      expect(insecurity.authenticatedUsers.tokenOf({ id: 1 })).to.equal('11111')
    })

    it('returns undefined if no user is passed in', () => {
      expect(insecurity.authenticatedUsers.tokenOf(undefined)).to.equal(undefined)
      expect(insecurity.authenticatedUsers.tokenOf(null)).to.equal(undefined)
    })

    it('returns user by associated token from request', () => {
      insecurity.authenticatedUsers.put('11111', { data: { id: 1 } })

      expect(insecurity.authenticatedUsers.from({ headers: { authorization: 'Bearer 11111' } })).to.deep.equal({ data: { id: 1 } })
    })

    it('returns undefined if no token is present in request', () => {
      expect(insecurity.authenticatedUsers.from({ headers: {} })).to.equal(undefined)
      expect(insecurity.authenticatedUsers.from({})).to.equal(undefined)
    })

    it('removes a user from the authenticated users list', () => {
      insecurity.authenticatedUsers.put('11111', { data: { id: 1 } })
      const user = insecurity.authenticatedUsers.get('11111')
      expect(user).to.deep.equal({ data: { id: 1 } })
      insecurity.authenticatedUsers.remove(user)
      expect(insecurity.authenticatedUsers.get('11111')).to.equal(undefined)
    })
  })

  describe('sanitizeHtml', () => {
    it('handles empty inputs by returning their string representation', () => {
      expect(insecurity.sanitizeHtml()).to.equal('undefined')
      expect(insecurity.sanitizeHtml(undefined)).to.equal('undefined')
      expect(insecurity.sanitizeHtml(null)).to.equal('null')
      expect(insecurity.sanitizeHtml('')).to.equal('')
    })

    it('returns input unchanged for plain text input', () => {
      expect(insecurity.sanitizeHtml('This application is horrible!')).to.equal('This application is horrible!')
    })

    it('returns input unchanged for HTML input with only harmless text formatting', () => {
      expect(insecurity.sanitizeHtml('<strong>This</strong> application <em>is horrible</em>!')).to.equal('<strong>This</strong> application <em>is horrible</em>!')
    })

    it('returns input unchanged for HTML input with only harmless links', () => {
      expect(insecurity.sanitizeHtml('<a href="bla.blubb">Please see here for details!</a>')).to.equal('<a href="bla.blubb">Please see here for details!</a>')
    })

    it('removes all Javascript from HTML input', () => {
      expect(insecurity.sanitizeHtml('Sani<script>alert("ScriptXSS")</script>tizedScript')).to.equal('SanitizedScript')
      expect(insecurity.sanitizeHtml('Sani<img src="alert("ImageXSS")"/>tizedImage')).to.equal('SanitizedImage')
      expect(insecurity.sanitizeHtml('Sani<iframe src="alert("IFrameXSS")"></iframe>tizedIFrame')).to.equal('SanitizedIFrame')
    })

    it('can be bypassed by exploiting lack of recursive sanitization', () => {
      expect(insecurity.sanitizeHtml('<<script>Foo</script>iframe src="javascript:alert(`xss`)">')).to.equal('<iframe src="javascript:alert(`xss`)">')
    })
  })

  describe('sanitizeLegacy', () => {
    it('returns empty string for undefined input', () => {
      expect(insecurity.sanitizeLegacy()).to.equal('')
      expect(insecurity.sanitizeLegacy(undefined)).to.equal('')
    })

    it('returns input unchanged for plain text input', () => {
      expect(insecurity.sanitizeLegacy('bkimminich')).to.equal('bkimminich')
      expect(insecurity.sanitizeLegacy('Kosh III.')).to.equal('Kosh III.')
    })

    it('removes all opening tags and subsequent character from HTML input', () => {
      expect(insecurity.sanitizeLegacy('<h1>Hello</h1>')).to.equal('ello</h1>')
      expect(insecurity.sanitizeLegacy('<img src="test">')).to.equal('rc="test">')
    })

    it('can be bypassed to allow working HTML payload to be returned', () => {
      expect(insecurity.sanitizeLegacy('<<a|ascript>alert(`xss`)</script>')).to.equal('<script>alert(`xss`)</script>')
    })
  })
})
