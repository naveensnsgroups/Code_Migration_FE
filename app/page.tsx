export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8 text-black dark:text-white">
      <main className="max-w-3xl w-full text-center sm:text-left space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Code Migration Project</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Welcome to the Code Migration tool. This project is separate from the initial exploration.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/api-test" className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity">
            Check API Connection
          </a>
        </div>
      </main>
    </div>
  );
}
