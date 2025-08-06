import React, { useState } from 'react';
import { extractTextFromPDF, extractSkillsFromText } from '@/utils/resumeParser';
import { matchMentorsBySkills } from '@/services/matching';
import { Button } from '@/components/ui/button';

const ResumeMatcher = () => {
  const [results, setResults] = useState<any[]>([]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await extractTextFromPDF(file);
    const skills = extractSkillsFromText(text);
    const matches = matchMentorsBySkills(skills);

    setResults(matches);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Upload Resume to Match with Mentors</h2>
      <input type="file" accept=".pdf" onChange={handleResumeUpload} />
      
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Top Mentor Matches:</h3>
          <ul className="space-y-2">
            {results.map((mentor, i) => (
              <li key={i} className="p-2 border rounded">
                <strong>{mentor.username}</strong> – Skills matched: {mentor.matchCount}
                <br />
                Matched Skills: {mentor.matchedSkills.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeMatcher;
