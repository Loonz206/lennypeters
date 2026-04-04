import { certifications } from '@/data/certifications'

describe('certifications array', () => {
  it('contains at least one certification resource', () => {
    expect(certifications.length).toBeGreaterThan(0)
  })

  it.each(certifications.map((certification, index) => [index, certification] as const))(
    'resource %i has title, issuer, and href',
    (_index, certification) => {
      expect(certification.title).toBeTruthy()
      expect(certification.issuer).toBe('LinkedIn')
      expect(certification.href).toMatch(/^https:\/\//)
    }
  )
})
