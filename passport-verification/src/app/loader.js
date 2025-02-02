"use client";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 z-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
};

export default Loading;
