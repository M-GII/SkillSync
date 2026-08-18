"use client";

import React, { useState } from "react";
import { Profile } from "@/lib/models/models.types";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function EditProfile({ profile, open, setOpen }: { profile: Profile; open: boolean; setOpen: (open: boolean) => void }) {
    const [formData, setFormData] = useState({
        location: profile.location || "",
        education: profile.education || "",
        skills: profile.skills?.join(", ") || "",
        desiredRole: profile.desiredRole || "",
        yearsExperience: profile.yearsExperience?.toString() || "",
    });

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        try {
            const result = await updateProfile({
                location: formData.location,
                education: formData.education,
                skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
                desiredRole: formData.desiredRole,
                yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : 0,
            });

            if (!result.error) setOpen(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information.</DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleUpdate}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="profileLocation">Location</Label>
                                <Input id="profileLocation" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profileEducation">Education</Label>
                                <Input id="profileEducation" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profileSkills">Skills</Label>
                                <Input id="profileSkills" placeholder="React, TypeScript, Python" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profileDesiredRole">Desired Role</Label>
                                <Input id="profileDesiredRole" value={formData.desiredRole} onChange={(e) => setFormData({ ...formData, desiredRole: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profileYearsExperience">Years of Experience</Label>
                                <Input id="profileYearsExperience" type="number" min={0} value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}