"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function ImageTabs() {
 const [activeImageIndex, setActiveImageIndex] = useState("organize");
return (
        <section className="border-t bg-white py-16">
          <div className="container mx-auto px-4 ">
            <div className="mx-auto max-w-6xl">
              <div className="flex gap-2 justify-center mb-8">
                <Button onClick ={() => setActiveImageIndex("organize")} className={` text-muted-foreground rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImageIndex === "organize" ? "bg-primary text-white " : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}> Organize Applications</Button>
                <Button onClick ={() => setActiveImageIndex("get-hired")} className={`text-muted-foreground rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImageIndex === "get-hired" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}> Get Hired</Button>
                <Button onClick ={() => setActiveImageIndex("track-progress")} className={`text-muted-foreground rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeImageIndex === "track-progress" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}> Track Progress</Button>
              </div>
              <div className="relative mx-auto max-w-5xl overflow-hidden rouned-lg border border-gray-200 shadow-xl">
                {activeImageIndex === "organize" && <Image src="/hero-images/Hero.png" alt="Organize Applications" loading="eager" width={1200} height={800} /> }
                {activeImageIndex === "get-hired" && <Image src="/hero-images/hero2.png" alt="Get Hired" width={1200} height={800} /> }
                {activeImageIndex === "track-progress" && <Image src="/hero-images/hero3.png" alt="Track Progress" width={1200} height={800} /> }
              </div>
            </div>
          </div>

        </section>
)
}