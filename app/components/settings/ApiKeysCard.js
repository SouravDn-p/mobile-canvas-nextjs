"use client";

import { useState } from "react";
import { FaKey, FaCopy, FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";

export const ApiKeysCard = ({ apiKey, onGenerate, onCopy }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) return;

    try {
      await navigator.clipboard.writeText(apiKey.key);
      onCopy(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
          <FaKey className="text-white text-sm" />
        </div>
        <h3 className="text-xl font-semibold text-white">API Keys</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            API Key
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                apiKey && showApiKey
                  ? apiKey.key
                  : apiKey
                  ? "••••••••••••••••••••••••••••••••"
                  : "No API key generated"
              }
              className="w-full px-4 py-3 pr-24 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none text-white font-mono text-sm"
              placeholder="Generate an API key to get started"
            />

            {/* Toggle visibility button */}
            {apiKey && (
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 transition-colors"
                title={showApiKey ? "Hide API Key" : "Show API Key"}
              >
                {showApiKey ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!apiKey}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy API Key"
            >
              <FaCopy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
            </button>
          </div>

          {/* API Key metadata */}
          {apiKey && (
            <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Created:{" "}
                  {new Date(apiKey.createdAt || Date.now()).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!apiKey || copied}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <FaCopy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy Key"}</span>
            </div>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  <span>{apiKey ? "Regenerate" : "Generate"}</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Copy success message */}
        {copied && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-green-400 text-sm text-center font-medium">
              API key copied to clipboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
