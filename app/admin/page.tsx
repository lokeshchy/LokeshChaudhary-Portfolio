'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    experience: 0,
    skills: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogsRes, projectsRes, experienceRes, skillsRes] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/projects'),
        fetch('/api/experience'),
        fetch('/api/skills'),
      ])

      const blogs = await blogsRes.json()
      const projects = await projectsRes.json()
      const experience = await experienceRes.json()
      const skills = await skillsRes.json()

      setStats({
        blogs: blogs.data?.length || 0,
        projects: projects.data?.length || 0,
        experience: experience.data?.length || 0,
        skills: skills.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h3 className="text-sm text-muted mb-2">Blogs</h3>
          <p className="text-3xl font-bold text-foreground">{stats.blogs}</p>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h3 className="text-sm text-muted mb-2">Projects</h3>
          <p className="text-3xl font-bold text-foreground">{stats.projects}</p>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h3 className="text-sm text-muted mb-2">Experience</h3>
          <p className="text-3xl font-bold text-foreground">{stats.experience}</p>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h3 className="text-sm text-muted mb-2">Skills</h3>
          <p className="text-3xl font-bold text-foreground">{stats.skills}</p>
        </div>
      </div>
    </div>
  )
}
