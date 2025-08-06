
import * as pdfjsLib from 'pdfjs-dist';
import SKILLS from '@/data/skills.json';

// Load pdfjs worker (important)

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str).join(' ');
    text += strings + '\n';
  }

  return text;
};

export const extractSkillsFromText = (text: string): string[] => {
  const normalizedText = text.toLowerCase();
  const matchedSkills: Set<string> = new Set();

  SKILLS.forEach((skill) => {
    const lowerSkill = skill.toLowerCase();
    if (normalizedText.includes(lowerSkill)) {
      matchedSkills.add(skill);
    }
  });

  return Array.from(matchedSkills);
};
