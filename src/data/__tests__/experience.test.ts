import { experience, formatDateRange } from '@/data/experience'

function localFormat(d: string): string {
  const [year, month] = d.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })
}

describe('formatDateRange', () => {
  it('formats a range with a Present end date', () => {
    expect(formatDateRange('2021-01', 'Present')).toBe(`${localFormat('2021-01')} – Present`)
  })

  it('formats a range with a concrete end date', () => {
    expect(formatDateRange('2018-06', '2020-12')).toBe(
      `${localFormat('2018-06')} – ${localFormat('2020-12')}`
    )
  })

  it('contains the en-dash separator', () => {
    expect(formatDateRange('2020-03', 'Present')).toContain(' – ')
  })

  it('ends with "Present" when end is the literal string Present', () => {
    expect(formatDateRange('2020-03', 'Present').endsWith('Present')).toBe(true)
  })

  it('does not end with "Present" when a concrete end date is supplied', () => {
    expect(formatDateRange('2016-01', '2018-05').endsWith('Present')).toBe(false)
  })
})

describe('experience array', () => {
  it('contains exactly 3 entries', () => {
    expect(experience).toHaveLength(3)
  })

  it.each(experience.map((e, i) => [i, e] as const))(
    'entry %i has all required fields populated',
    (_index, entry) => {
      expect(entry.role).toBeTruthy()
      expect(entry.company).toBeTruthy()
      expect(entry.location).toBeTruthy()
      expect(entry.startDate).toBeTruthy()
      expect(entry.endDate).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(Array.isArray(entry.highlights)).toBe(true)
      expect(entry.highlights.length).toBeGreaterThan(0)
    }
  )

  it('first entry is the most recent role', () => {
    expect(experience[0].role).toBe('Senior Web Engineer')
    expect(experience[0].company).toBe('lululemon')
    expect(experience[0].endDate).toBe('Present')
  })

  it('second entry is the freelance/agency role', () => {
    expect(experience[1].role).toBe('Web Engineer')
    expect(experience[1].company).toBe('Freelance & Agency Work')
  })

  it('third entry is the earliest role', () => {
    expect(experience[2].role).toBe('Front-End Developer')
    expect(experience[2].company).toBe('Early Career')
  })

  it('each highlights array contains only non-empty strings', () => {
    experience.forEach(entry => {
      entry.highlights.forEach(highlight => {
        expect(typeof highlight).toBe('string')
        expect(highlight.length).toBeGreaterThan(0)
      })
    })
  })
})
