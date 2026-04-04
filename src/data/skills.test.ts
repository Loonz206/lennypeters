import { skillGroups } from '@/data/skills'
import type { SkillGroup } from '@/data/skills'

describe('skillGroups array', () => {
  it('contains exactly 4 groups', () => {
    expect(skillGroups).toHaveLength(4)
  })

  it('has the expected group labels in order', () => {
    const labels = skillGroups.map(g => g.label)
    expect(labels).toEqual(['Languages', 'Frameworks & Libraries', 'Tooling', 'Practices'])
  })

  it.each(skillGroups.map((g, i) => [i, g] as const))(
    'group %i has a label and a non-empty skills array',
    (_index, group) => {
      expect(group.label).toBeTruthy()
      expect(Array.isArray(group.skills)).toBe(true)
      expect(group.skills.length).toBeGreaterThan(0)
    }
  )

  it('Languages group contains Responsive Web Development', () => {
    const languages = skillGroups.find(g => g.label === 'Languages') as SkillGroup
    expect(languages.skills).toContain('Responsive Web Development')
  })

  it('Frameworks & Libraries group contains React and NextJS', () => {
    const frameworks = skillGroups.find(g => g.label === 'Frameworks & Libraries') as SkillGroup
    expect(frameworks.skills).toContain('React')
    expect(frameworks.skills).toContain('NextJS')
  })

  it('Tooling group contains Playwright/Cypress', () => {
    const tooling = skillGroups.find(g => g.label === 'Tooling') as SkillGroup
    expect(tooling.skills).toContain('Playwright/Cypress')
  })

  it('Practices group contains a11y', () => {
    const practices = skillGroups.find(g => g.label === 'Practices') as SkillGroup
    expect(practices.skills).toContain('a11y')
  })

  it('each skill within each group is a non-empty string', () => {
    skillGroups.forEach(group => {
      group.skills.forEach(skill => {
        expect(typeof skill).toBe('string')
        expect(skill.length).toBeGreaterThan(0)
      })
    })
  })
})
