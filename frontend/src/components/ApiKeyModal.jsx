import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Badge } from './ui/Badge'
import { X, Key, Check, ExternalLink, ShieldCheck } from 'lucide-react'

export function ApiKeyModal({ isOpen, onClose, apiKey, setApiKey, onSave }) {
  if (!isOpen) return null

  const [inputVal, setInputVal] = useState(apiKey || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setApiKey(inputVal.trim())
    if (onSave) onSave(inputVal.trim())
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-800 bg-[#121214] p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">API Key Configuration</h2>
              <p className="text-xs text-neutral-400">TinyFish authentication setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3.5 text-xs text-neutral-300 space-y-2">
            <div className="font-medium text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Where to put your API key</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              You can put your API key in either of two places:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
              <li>
                In the <code className="text-white bg-neutral-800 px-1 py-0.5 rounded font-mono">.env</code> file in the project root:
                <div className="mt-1 font-mono text-[11px] text-neutral-300 bg-black/50 p-2 rounded border border-neutral-800">
                  TINYFISH_API_KEY="sk-tinyfish-..."
                </div>
              </li>
              <li>Or paste it directly into the input below to use it instantly in this browser session.</li>
            </ol>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              TinyFish API Key
            </label>
            <Input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="sk-tinyfish-..."
              className="font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Need an API key?</span>
            <a
              href="https://agent.tinyfish.ai/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 hover:text-white inline-flex items-center gap-1 underline"
            >
              <span>Get API key from TinyFish</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-neutral-400 hover:text-white">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-white text-black hover:bg-neutral-200 text-xs font-medium px-4"
          >
            {saved ? (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Saved</span>
              </span>
            ) : (
              <span>Save Configuration</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
