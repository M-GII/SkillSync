"use server"

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import Profile from "../models/profile";

interface ProfileData {
    fullName: string;
    location?: string;
    education?: string;
    skills?: string[];
    desiredRole?: string;
    yearsExperience?: number;
}

export async function saveProfile(data: ProfileData) {
    const session = await getSession();

    if (!session?.user) return { error: "Unauthorized" };

    await connectDB();

    const { fullName, location, education, skills, desiredRole, yearsExperience } = data;

    if (!fullName) return { error: "Full name is required" };

    const profile = await Profile.findOneAndUpdate(
        { userId: session.user.id },
        {
            userId: session.user.id,
            fullName,
            location: location || "",
            education: education || "",
            skills: skills || [],
            desiredRole: desiredRole || "",
            yearsExperience: yearsExperience || 0,
        },
        { returnDocument: "after", upsert: true}
    );
    revalidatePath("/dashboard");
    return { data: JSON.parse(JSON.stringify(profile)) };
}

export async function updateProfile(updates: {
    location?: string;
    education?: string;
    skills?: string[];
    desiredRole?: string;
    yearsExperience?: number;
}) {
    const session = await getSession();

    if (!session?.user) return { error: "Unauthorized" };

    await connectDB();

    const profile = await Profile.findOneAndUpdate({ userId: session.user.id }, updates, { returnDocument: "after" });

    if (!profile) return { error: "Profile not found" };

    revalidatePath("/dashboard");

    return { data: JSON.parse(JSON.stringify(profile)) };
}