// src/components/MentorSuggestion.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MentorSuggestionProps {
  mentor: {
    username: string;
    email: string;
    department: string;
    skills: string[];
  };
  matchScore: number;
  onAssign: () => void;
  isAssigned?: boolean;
}

const getBadgeColor = (score: number) => {
  if (score >= 80) return 'bg-green-500 text-white';
  if (score >= 50) return 'bg-yellow-500 text-black';
  return 'bg-red-500 text-white';
};

const MentorSuggestion: React.FC<MentorSuggestionProps> = ({
  mentor,
  matchScore,
  onAssign,
  isAssigned = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md shadow-sm bg-muted mb-2">
      <div>
        <div className="font-medium">{mentor.username}</div>
        <div className="text-sm text-muted-foreground">{mentor.email}</div>
        <div className="text-sm text-muted-foreground">Dept: {mentor.department}</div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Badge className={getBadgeColor(matchScore)}>
          {matchScore}% Match
        </Badge>
        <Button
          size="sm"
          disabled={isAssigned}
          onClick={onAssign}
          variant={isAssigned ? 'secondary' : 'default'}
        >
          {isAssigned ? 'Assigned' : 'Assign'}
        </Button>
      </div>
    </div>
  );
};

export default MentorSuggestion;
