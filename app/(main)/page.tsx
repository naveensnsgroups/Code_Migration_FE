"use client";

import { ActionButton } from '../features/components/ActionButton';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8 text-black dark:text-white">
      <main className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">Code Migration</h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 font-medium">
            Strategic Codebase Transformation
          </p>
        </div>
        
        <div className="flex justify-center">
          <ActionButton 
            label="Initialize Step 1" 
            onClick={() => window.location.href = 'http://localhost:8000/api/health'} 
          />
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-500">
          <div className="p-4 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <p className="font-bold text-black dark:text-white mb-1 text-base">Structure</p>
            Feature-based Logic
          </div>
          <div className="p-4 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <p className="font-bold text-black dark:text-white mb-1 text-base">API</p>
            FastAPI with Pydantic
          </div>
          <div className="p-4 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <p className="font-bold text-black dark:text-white mb-1 text-base">Status</p>
            Environment Ready
          </div>
        </div>
      </main>
    </div>
  );
}
