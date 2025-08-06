export function computeMatch(internSkills: string[], mentorSkills: string[]) {
    const matchedSkills = internSkills.filter(skill => mentorSkills.includes(skill));
    const score = (matchedSkills.length / mentorSkills.length) * 100;
  
    return {
      score: Math.round(score),
      matched: matchedSkills,
      explanation: matchedSkills.length
        ? `Matched skills: ${matchedSkills.join(', ')}`
        : `No matching skills found.`
    };
  }
  