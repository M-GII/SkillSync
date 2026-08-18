import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
    userId: string;
    fullName: string;
    location?: string;
    education?: string;
    skills?: string[];
    desiredRole?: string;
    yearsExperience?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    location: { type: String, default: "" },
    education: { type: String, default: "" },
    skills: [{ type: String }],
    desiredRole: { type: String, default: "" },
    yearsExperience: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);