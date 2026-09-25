function getFallbackReply(message, data) {
  const q = message.toLowerCase();
  const name = data.personal.name.split(' ')[0];

  if (/^\s*(hi|hello|hey|yo)\b/.test(q) && q.length < 25) {
    return `Hey! I'm ${name}'s portfolio assistant. Ask me about his experience, projects, skills, or how to reach him.`;
  }

  if (/(contact|email|reach|hire|linkedin|github)/.test(q)) {
    return `You can reach ${name} at ${data.personal.email}, or find him on GitHub (${data.personal.github}) and LinkedIn (${data.personal.linkedin}). There's also a contact form further down this page.`;
  }

  if (/(experience|work|job|company|career|role)/.test(q)) {
    const current = data.experience[0];
    const previous = data.experience[1];
    return `${name} is currently a ${current.title} at ${current.company} (${current.start} - ${current.end}). ${current.description}${
      previous ? ` Before that, he was a ${previous.title} at ${previous.company}, ${previous.description.toLowerCase()}` : ''
    }`;
  }

  if (/(project)/.test(q)) {
    const names = data.projects.slice(0, 4).map((p) => p.name);
    return `Some of ${name}'s notable projects: ${names.join(', ')}. Ask me about any one of them for more detail.`;
  }

  if (/(skill|stack|tech|language|framework)/.test(q)) {
    return `${name}'s core stack: ${data.skills.map((s) => s.name).join(', ')}.`;
  }

  if (/(education|college|degree|university|cgpa|gpa)/.test(q)) {
    const edu = data.education[0];
    return `${name} holds a ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.start} - ${edu.end}), GPA ${edu.gpa} — ${edu.distinction}.`;
  }

  if (/(achievement|award|leetcode|codechef|hackerrank|rank|rating)/.test(q)) {
    return data.achievements.map((a) => `${a.title}: ${a.description}`).join(' ');
  }

  if (/(resume|cv)/.test(q)) {
    return `You can download ${name}'s resume using the "Resume" button at the top of this page.`;
  }

  return `I can share details about ${name}'s experience, projects, skills, education, or how to contact him — what would you like to know?`;
}

module.exports = { getFallbackReply };
