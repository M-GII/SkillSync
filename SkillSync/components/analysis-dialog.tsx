"use client";

import { useState, useEffect } from "react";
import { JobApplication } from "@/lib/models/models.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProfile } from "@/lib/actions/profile";
import { getJobAnalysis, saveJobAnalysis } from "@/lib/actions/analysis";

interface AnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    job: JobApplication;
}

interface AnalysisResult {
    overallMatch: number;
    keywordMatch: number;
    semanticScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
    updatedAt?: string;
}

export default function AnalysisDialog({ open, onOpenChange, job }: AnalysisDialogProps) {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const jobId = String(job._id);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setChecking(true);
        setError("");

        getJobAnalysis(jobId)
            .then((result) => {
                if (cancelled) return;
                if (result.error) {
                    setError(result.error);
                } else {
                    setAnalysis(result.data);
                }
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Failed to check for saved analysis:", err);
                setError("Failed to check for saved analysis");
            })
            .finally(() => {
                if (!cancelled) setChecking(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, jobId]);

    async function handleAnalyze() {
        setLoading(true);
        setError("");

        try {
            const profileResult = await getProfile();

            if (profileResult.error || !profileResult.profile) {
                setError("Failed to get profile");
                return;
            }

            const response = await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_text: `${job.tags?.join(" ") || ""} ${job.description || ""}`.trim(),
                    user_skills: profileResult.profile.skills || [],
                    profile_summary: profileResult.profile.summary || "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze job");
            }

            const data = await response.json();

            const mapped: AnalysisResult = {
                overallMatch: data.overall_match,
                keywordMatch: data.keyword_match,
                semanticScore: data.semantic_score,
                matchedSkills: data.matched_skills,
                missingSkills: data.missing_skills,
                explanation: data.explanation,
            };

            setAnalysis(mapped);

            const saveResult = await saveJobAnalysis(jobId, mapped);
            if (saveResult.error) {
                console.error("Analysis succeeded but failed to save:", saveResult.error);
            }
        } catch (err) {
            console.error("Failed to analyze job:", err);
            setError(err instanceof Error ? err.message : "Failed to analyze job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Job Analysis</DialogTitle>
                    <DialogDescription>
                        Analyze how your profile matches {job.position} at {job.company}
                    </DialogDescription>
                </DialogHeader>

                {checking && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        Checking for saved analysis...
                    </div>
                )}

                {!checking && !analysis && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">This job has not been analyzed yet.</p>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button onClick={handleAnalyze} disabled={loading}>
                            {loading ? "Analyzing..." : "Analyze Job"}
                        </Button>
                    </div>
                )}

                {!checking && analysis && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {analysis.updatedAt
                                    ? `Last analyzed ${new Date(analysis.updatedAt).toLocaleString()}`
                                    : "Previously analyzed"}
                            </p>
                            <Badge variant="secondary">Saved result</Badge>
                        </div>

                        <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/40 py-6">
                            <p className="text-sm text-muted-foreground">Overall Match</p>
                            <p className="text-4xl font-bold">{Math.round(analysis.overallMatch * 100)}%</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Keyword Match</span>
                                    <span className="text-muted-foreground">{Math.round(analysis.keywordMatch * 100)}%</span>
                                </div>
                                <Progress value={analysis.keywordMatch * 100} />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Semantic Match</span>
                                    <span className="text-muted-foreground">{Math.round(analysis.semanticScore * 100)}%</span>
                                </div>
                                <Progress value={analysis.semanticScore * 100} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Matched Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {analysis.matchedSkills.length > 0 ? (
                                    analysis.matchedSkills.map((skill) => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">None found</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Missing Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {analysis.missingSkills.length > 0 ? (
                                    analysis.missingSkills.map((skill) => (
                                        <Badge key={skill} variant="outline">{skill}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">None — great fit!</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-sm font-semibold">Explanation</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.explanation}</p>
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button onClick={handleAnalyze} disabled={loading} variant="outline" className="w-full">
                            {loading ? "Analyzing..." : "Reanalyze"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}