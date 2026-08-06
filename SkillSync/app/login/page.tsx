"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Login() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">Login</CardTitle>
                    <CardDescription className="text-gray-600"> Login to continue tracking your applications!</CardDescription>
                </CardHeader>
                <form className="space-y-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input className="border-gray-300 focus:border-primary focus:ring-primary" id="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input className="border-gray-300 focus:border-primary focus:ring-primary" id="password" minLength={7} type="password" placeholder="••••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full bg-primary hover:bg-primary/90" type="submit">Login</Button>
                        <p className="text-center text-sm text-gray-600">Don't have an account? <Link className="font-medium text-primary hover:underline" href="/sign-up">Sign Up</Link></p>
                    </CardFooter>
                </form>
            </Card>

        </div>
    )
}