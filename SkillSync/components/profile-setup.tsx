"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { saveProfile } from "@/lib/actions/profile"
import { Textarea } from "./ui/textarea"

export default function ProfileSetup() {
    const searchParams = useSearchParams()
    const fullName = searchParams.get("name") || ""
    const [location, setLocation] = useState("")
    const [education, setEducation] = useState("")
    const [skills, setSkills] = useState("")
    const [desiredRole, setDesiredRole] = useState("")
    const [yearsExperience, setYearsExperience] = useState("")
    const[summary,setSummary]= useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean)
            const result = await saveProfile({ fullName, location, education, skills: skillsArray, desiredRole, summary, yearsExperience: yearsExperience ? Number(yearsExperience) : 0, })

            if (result.error) {
                setError(result.error)
                return
            }
            router.push("/dashboard")
        } catch (err) {
            setError("Failed to save profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-2xl border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">Set up your profile</CardTitle>
                    <CardDescription className="text-gray-600">
                        Tell us a bit about yourself so we can tailor your job tracking experience.
                    </CardDescription>
                </CardHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-gray-700">Full name</Label>
                                <Input value={fullName} readOnly className="border-gray-300 focus:border-primary focus:ring-primary" id="fullName" type="text" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-gray-700">Location</Label>
                                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="location" type="text" placeholder="Edmonton, AB" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="education" className="text-gray-700">Education</Label>
                            <Input value={education} onChange={(e) => setEducation(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="education" type="text" placeholder="B.Sc. Computer Engineering, University of Alberta" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-gray-700">Skills</Label>
                            <Input value={skills} onChange={(e) => setSkills(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="skills" type="text" placeholder="React, Node.js, Python, SQL" />
                            <p className="text-xs text-gray-500">Comma-separated. This powers matching and search.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="desiredRole" className="text-gray-700">Desired role</Label>
                                <Input value={desiredRole} onChange={(e) => setDesiredRole(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="desiredRole" type="text" placeholder="Software Engineer Co-op" />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="yearsExperience" className="text-gray-700">Years of experience</Label>
                                <Input value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="yearsExperience" type="number" min={0} placeholder="1" />
                            </div>
                        </div>
                        <div className="space-y-2">
                    <Label htmlFor="summary">Summary / Bio</Label>
                    <Textarea
                        id="summary"
                        placeholder="Briefly describe your background, experience, interests, and career goals..."
                        className="w-full min-w-0 max-w-full h-28 resize-none overflow-y-auto"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90" type="submit">
                        {loading ? "Saving..." : "Save profile"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
        </div >
    )
}