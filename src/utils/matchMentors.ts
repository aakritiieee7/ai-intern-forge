// utils/matchMentors.ts
import { storageService } from '@/lib/storage';
import { User } from '@/lib/storage';

export function getMentorMatchScores(internSkills: string[]): Array<User & { score: number }> {
  const mentors = storageService.getMentorUsers();
  const internSkillsSet = new Set(internSkills.map(skill => skill.toLowerCase().trim()));

  return mentors
    .map(mentor => {
      const mentorSkills = (mentor.skills || []) as string[];
      const mentorSkillsSet = new Set(mentorSkills.map(s => s.toLowerCase().trim()));
      const matched = [...internSkillsSet].filter(skill => mentorSkillsSet.has(skill));
      const score = matched.length;
      return { ...mentor, score };
    })
    .sort((a, b) => b.score - a.score); // highest score first
}
