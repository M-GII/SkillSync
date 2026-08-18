"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signUp } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();
        setError("");
        setLoading(true);
        try {

            const result = await signUp.email({ name, email, password });

            if (result.error) {
                setError(result.error.message || "Failed to create an account. Please try again.");
            } else {
                 router.push(`/profile-setup?name=${encodeURIComponent(name)}`)
            }
        } catch (err) {

            setError("Failed to create an account. Please try again.");

        } finally {

            setLoading(false);
        }

    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">Sign Up</CardTitle>
                    <CardDescription className="text-gray-600"> Sign up to start tracking your applications!</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && (<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>)}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} className="border-gray-300 focus:border-primary focus:ring-primary" id="password" minLength={7} type="password" placeholder="••••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90" type="submit">
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">Already have an account? <Link className="font-medium text-primary hover:underline" href="/login">Login</Link></p>
                    </CardFooter>
                </form>
            </Card>

        </div>
    )
}