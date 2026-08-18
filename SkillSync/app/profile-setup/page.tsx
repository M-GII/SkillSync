import { Suspense } from "react";
import ProfileSetup from "@/components/profile-setup";
export default async function Page() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileSetup />
        </Suspense>
    );
}