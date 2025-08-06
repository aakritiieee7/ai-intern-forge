import { storageService } from '@/lib/storage';

export const matchMentorsBySkills = (internSkills: string[]) => {
  const mentors = storageService.getMentorUsers();

  return mentors
    .map((mentor) => {
      const overlap = mentor.skills.filter((skill: string) =>
        internSkills.includes(skill)
      );
      return {
        ...mentor,
        matchedSkills: overlap,
        matchCount: overlap.length,
      };
    })
    .sort((a, b) => b.matchCount - a.matchCount);
};
