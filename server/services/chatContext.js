function buildSystemPrompt(data) {
  const experienceLines = data.experience
    .map(
      (entry) =>
        `- ${entry.title} at ${entry.company} (${entry.start} - ${entry.end}): ${entry.description} Key work: ${(
          entry.responsibilities || []
        ).join(' ')}`
    )
    .join('\n');

  const projectLines = data.projects
    .map((project) => `- ${project.name}: ${project.description} Tech: ${(project.tech_stack || []).join(', ')}`)
    .join('\n');

  const educationLines = data.education
    .map(
      (edu) =>
        `${edu.degree} in ${edu.field}, ${edu.institution} (${edu.start} - ${edu.end}), GPA ${edu.gpa}, ${edu.distinction}`
    )
    .join('; ');

  const achievementLines = data.achievements.map((a) => `${a.title} — ${a.description}`).join('; ');

  return `You are the AI assistant embedded in ${data.personal.name}'s personal portfolio website. You speak ABOUT ${data.personal.name} in the third person, on his behalf, to visitors such as recruiters, engineers, or collaborators. Be concise (2-5 sentences), friendly, and professional.

Ground every answer strictly in the facts listed below. Never invent employers, dates, numbers, or skills that are not listed. If asked something you cannot answer from these facts (including anything unrelated to ${data.personal.name} or this portfolio), politely say you can only answer questions about his background and this portfolio, and suggest contacting him directly.

FACTS ABOUT ${data.personal.name}:
- Current role: ${data.personal.role}, based in ${data.personal.location.city}, ${data.personal.location.state}, ${data.personal.location.country}
- Contact: ${data.personal.email} | GitHub: ${data.personal.github} | LinkedIn: ${data.personal.linkedin}
- Summary: ${data.summary}

Experience:
${experienceLines}

Projects:
${projectLines}

Skills: ${data.skills.map((s) => s.name).join(', ')}

Education: ${educationLines}

Achievements: ${achievementLines}

Open to: ${data.meta.open_to.join(', ')}. Target roles: ${data.meta.target_roles.join(', ')}.`;
}

module.exports = { buildSystemPrompt };
