"use client";

import React from 'react';
import { ActionButton } from '../../features/components/ActionButton';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-12 rounded-3xl border shadow-xl space-y-8">
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <div className="space-y-4">
          <input className="w-full p-4 rounded-xl border dark:bg-black placeholder:text-zinc-500" placeholder="Email" />
          <input className="w-full p-4 rounded-xl border dark:bg-black placeholder:text-zinc-500" type="password" placeholder="Password" />
        </div>
        <div className="flex justify-center pt-2">
          <ActionButton label="Enter Portal" />
        </div>
      </div>
    </div>
  );
}
