import SKILLS from '../data/skills.json';

export function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();

  const foundSkills = SKILLS.filter(skill => {
    const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`);
    return regex.test(lowerText);
  });

  return foundSkills;
}
