import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import axios from 'axios';
import { Progress } from '../../components/ui/progress';

interface Intern {
    _id: string;
    name: string;
    email: string;
    skills: string[];
}

interface MatchResult {
    intern: Intern;
    confidenceScore: number;
    explanation: string;
}

const AIMatchIntern = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [matchingInterns, setMatchingInterns] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        setMatchingInterns([]);

        if (!resumeFile) {
            setError('Please upload a resume file.');
            setLoading(false);
            return;
        }

        if (!projectDescription.trim()) {
            setError('Please provide a project description.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('projectDescription', projectDescription);

        try {
            // Send the resume and description to the backend AI service
            const response = await axios.post('/ai/match-intern', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMatchingInterns(response.data.matches);
            setMessage(response.data.message);
        } catch (err: any) {
            console.error('AI Matching error:', err);
            setError(err.response?.data?.message || 'Failed to match interns. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>AI-Powered Intern Matching</CardTitle>
                    <CardDescription>Upload a resume and provide a project description to find the best-matched interns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Resume</label>
                            <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            {resumeFile && <p className="text-xs text-muted-foreground">Selected file: {resumeFile.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Description</label>
                            <Textarea
                                placeholder="Describe the project and required skills..."
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Matching...' : 'Match Interns'}
                        </Button>
                    </form>

                    {loading && (
                        <div className="mt-8">
                            <p className="text-sm text-center text-gray-500">Processing resume and matching interns...</p>
                            <Progress value={50} className="mt-2 w-full" />
                        </div>
                    )}
                    {error && (
                        <div className="mt-6 text-red-500 text-center">{error}</div>
                    )}
                    {message && (
                        <div className="mt-6 text-green-500 text-center">{message}</div>
                    )}

                    {matchingInterns.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-semibold">Top Matching Interns:</h3>
                            {matchingInterns.map((match) => (
                                <Card key={match.intern._id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-md font-semibold">{match.intern.name}</h4>
                                                <p className="text-sm text-muted-foreground">{match.intern.email}</p>
                                                <p className="text-xs mt-1">Skills: {match.intern.skills.join(', ')}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-blue-600">
                                                    {Math.round(match.confidenceScore * 100)}%
                                                </span>
                                                <p className="text-xs text-muted-foreground">Confidence</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">{match.explanation}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AIMatchIntern;