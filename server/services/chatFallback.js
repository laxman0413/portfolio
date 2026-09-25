function getFallbackReply(message, data) {
  const name = data?.personal?.name?.split(' ')[0] || 'the site owner';

  try {
    const q = message.toLowerCase();

    if (/^\s*(hi|hello|hey|yo)\b/.test(q) && q.length < 25) {
      return `Hey! I'm ${name}'s portfolio assistant. Ask me about his experience, projects, skills, or how to reach him.`;
    }

    if (/(contact|email|reach|hire|linkedin|github)/.test(q)) {
      return `You can reach ${name} at ${data.personal.email}, or find him on GitHub (${data.personal.github}) and LinkedIn (${data.personal.linkedin}). There's also a contact form further down this page.`;
    }

    if (/(experience|work|job|company|career|role)/.test(q)) {
      const current = data.experience?.[0];
      const previous = data.experience?.[1];
      if (!current) {
        return `I don't have ${name}'s work experience loaded right now — the contact form further down this page is the best way to ask him directly.`;
      }
      return `${name} is currently a ${current.title} at ${current.company} (${current.start} - ${current.end}). ${current.description}${
        previous ? ` Before that, he was a ${previous.title} at ${previous.company}, ${previous.description.toLowerCase()}` : ''
      }`;
    }

    if (/(project)/.test(q)) {
      const names = (data.projects || []).slice(0, 4).map((p) => p.name);
      return names.length
        ? `Some of ${name}'s notable projects: ${names.join(', ')}. Ask me about any one of them for more detail.`
        : `I don't have project details loaded right now — check the Projects section further down this page.`;
    }

    if (/(skill|stack|tech|language|framework)/.test(q)) {
      const skillNames = (data.skills || []).map((s) => s.name);
      return skillNames.length
        ? `${name}'s core stack: ${skillNames.join(', ')}.`
        : `Check the Skills section further down this page for ${name}'s full tech stack.`;
    }

    if (/(education|college|degree|university|cgpa|gpa)/.test(q)) {
      const edu = data.education?.[0];
      return edu
        ? `${name} holds a ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.start} - ${edu.end}), GPA ${edu.gpa} — ${edu.distinction}.`
        : `I don't have education details loaded right now — feel free to ask ${name} directly.`;
    }

    if (/(achievement|award|leetcode|codechef|hackerrank|rank|rating)/.test(q)) {
      const achievements = data.achievements || [];
      return achievements.length
        ? achievements.map((a) => `${a.title}: ${a.description}`).join(' ')
        : `I don't have achievements loaded right now — check the Achievements section further down this page.`;
    }

    if (/(resume|cv)/.test(q)) {
      return `You can download ${name}'s resume using the "Resume" button at the top of this page.`;
    }

    return `I can share details about ${name}'s experience, projects, skills, education, or how to contact him — what would you like to know?`;
  } catch (error) {
    console.error('Fallback responder failed:', error.message);
    return `I'm having trouble answering that right now — please use the contact form further down this page to reach ${name} directly.`;
  }
}

module.exports = { getFallbackReply };
