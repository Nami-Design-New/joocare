"use client";

import Lottie from "lottie-react";
import animationData from "@/lotties/trail_loading.json";

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70">
            <div className="w-40 h-40">
                <Lottie animationData={animationData} loop />
            </div>
        </div>
    );
}