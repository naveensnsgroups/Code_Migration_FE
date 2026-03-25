"use client";

import { Button } from '../../components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background font-sans p-8">
      <main className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">Code Migration</h1>
          <p className="text-2xl text-muted-foreground font-medium">
            Strategic Codebase Transformation
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            label="Go to Dashboard" 
            size="lg"
            onClick={() => window.location.href = '/dashboard'} 
          />
        </div>
      </main>
    </div>
  );
}
