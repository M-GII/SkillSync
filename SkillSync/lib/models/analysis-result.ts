import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysisResult extends Document {
    userId: string;
    jobId: mongoose.Types.ObjectId;
    keywordMatch: number;
    semanticScore: number;
    overallMatch: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
    createdAt: Date;
    updatedAt: Date;
}

const AnalysisResultSchema = new Schema<IAnalysisResult>({
    userId: { type: String, required: true, index: true },

    jobId: {
        type: Schema.Types.ObjectId,
        ref: "JobApplication",
        required: true,
        index: true,
    },

    keywordMatch: { type: Number, required: true, default: 0 },
    semanticScore: { type: Number, required: true, default: 0 },
    overallMatch: { type: Number, required: true, default: 0 },

    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],

    explanation: { type: String, default: "" },
}, { timestamps: true });

AnalysisResultSchema.index(
    { userId: 1, jobId: 1 },
    { unique: true }
);

export default mongoose.models.AnalysisResult || mongoose.model<IAnalysisResult>("AnalysisResult", AnalysisResultSchema);