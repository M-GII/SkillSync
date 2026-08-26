"use server";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import {JobApplication } from "../models";
import analysisResult from "../models/analysis-result";

interface AnalysisData {
    overallMatch: number;
    keywordMatch: number;
    semanticScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
}

export async function getJobAnalysis(jobId: string) {
    const session = await getSession();
    if (!session?.user) return { error: "Unauthorized" };

    await connectDB();

    const analysis = await analysisResult.findOne({
        jobId,
        userId: session.user.id,
    }).lean();

    return { data: analysis ? JSON.parse(JSON.stringify(analysis)) : null };
}

export async function saveJobAnalysis(jobId: string, data: AnalysisData) {
    const session = await getSession();
    if (!session?.user) return { error: "Unauthorized" };

    await connectDB();

    const jobApplication = await JobApplication.findById(jobId);
    if (!jobApplication) return { error: "Job application not found" };
    if (jobApplication.userId !== session.user.id) return { error: "Unauthorized" };

    const analysis = await analysisResult.findOneAndUpdate(
        { jobId, userId: session.user.id },
        { $set: data },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { data: JSON.parse(JSON.stringify(analysis)) };
}