import { projects } from '@/data/projects'
import type { Project } from '@/data/projects'

describe('projects array', () => {
  it('contains exactly 3 projects', () => {
    expect(projects).toHaveLength(3)
  })

  it('first project has id PRJ_001', () => {
    expect(projects[0].id).toBe('PRJ_001')
  })

  it('second project has id PRJ_002', () => {
    expect(projects[1].id).toBe('PRJ_002')
  })

  it('third project has id PRJ_003', () => {
    expect(projects[2].id).toBe('PRJ_003')
  })

  it.each(projects.map((p, i) => [i, p] as const))(
    'project %i has all required fields',
    (_index, project) => {
      expect(project.id).toBeTruthy()
      expect(project.title).toBeTruthy()
      expect(project.description).toBeTruthy()
      expect(Array.isArray(project.tags)).toBe(true)
      expect(project.tags.length).toBeGreaterThan(0)
      expect(project.buttonLabel).toBeTruthy()
      expect(project.href).toBeTruthy()
    }
  )

  it('image is optional and undefined for all current projects', () => {
    projects.forEach(project => {
      expect(project.image).toBeUndefined()
    })
  })

  it('first project is videos-hooks', () => {
    expect(projects[0].title).toBe('videos-hooks')
    expect(projects[0].tags).toContain('react')
    expect(projects[0].tags).toContain('hooks')
  })

  it('second project is lennypeters', () => {
    expect(projects[1].title).toBe('lennypeters')
    expect(projects[1].tags).toContain('nextjs')
    expect(projects[1].tags).toContain('blogging')
  })

  it('third project is the-next-ferry', () => {
    expect(projects[2].title).toBe('the-next-ferry')
    expect(projects[2].tags).toContain('nextjs')
    expect(projects[2].tags).toContain('react')
    expect(projects[2].href).toBe('https://github.com/Loonz206/the-next-ferry')
  })

  it('satisfies the Project interface shape', () => {
    const requiredKeys: (keyof Project)[] = [
      'id',
      'title',
      'description',
      'tags',
      'buttonLabel',
      'href',
    ]
    projects.forEach(project => {
      requiredKeys.forEach(key => {
        expect(project).toHaveProperty(key)
      })
    })
  })
})
