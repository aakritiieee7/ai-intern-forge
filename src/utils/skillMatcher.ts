// src/utils/skillMatcher.ts
import SKILLS from '@/data/skills.json';

export function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  return SKILLS.filter(skill => lowerText.includes(skill.toLowerCase()));
}

export function matchScore(internSkills: string[], mentorSkills: string[]): number {
  const matched = internSkills.filter(skill => mentorSkills.includes(skill));
  return Math.round((matched.length / mentorSkills.length) * 100);
}
