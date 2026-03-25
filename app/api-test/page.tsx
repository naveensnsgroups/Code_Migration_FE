"use client";

import React, { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 font-sans text-black dark:text-white min-h-screen bg-white dark:bg-black">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}
      {data ? (
        <pre className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-md overflow-auto mb-4 border dark:border-zinc-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        !error && <p className="text-gray-500 italic">Loading...</p>
      )}
      <div className="mt-8 border-t pt-4 text-sm text-gray-600 dark:text-zinc-400">
        <p>API URL: <code className="bg-gray-200 dark:bg-zinc-800 px-1 rounded font-mono">{process.env.NEXT_PUBLIC_API_URL}</code></p>
      </div>
    </div>
  );
}
