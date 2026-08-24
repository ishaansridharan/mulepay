import { Sparkles, ArrowRight, Code2 } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f615,transparent)] pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>React + Vite + Tailwind CSS</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Hi 👋
          </h1>
          <p className="text-neutral-400 text-sm">
            Your modern web boilerplate is ready to build something awesome.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-left text-xs font-mono text-neutral-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-neutral-500" />
            <span>src/App.jsx</span>
          </div>
          <span className="text-neutral-500">Ready to edit</span>
        </div>
      </div>
    </div>
  )
}
