"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [wordCount, setWordCount] = useState(800);
  const [blogContent, setBlogContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!title || !description) {
      setError("Title and Description are required.");
      return;
    }

    setError("");
    setLoading(true);
    setBlogContent("");

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!,
        { title, description, tone, targetAudience, wordCount }
      );
      setBlogContent(response.data.blog);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 text-white">AI Blog Generator</h1>
        <p className="text-gray-400 mb-10">Fill in the details and let AI write your blog post.</p>

        {/* Form */}
        <div className="flex flex-col gap-5 bg-gray-900 p-8 rounded-2xl border border-gray-800">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Blog Title *</label>
            <input
              type="text"
              placeholder="e.g. The Future of Artificial Intelligence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description / Topic *</label>
            <textarea
              rows={4}
              placeholder="Describe what this blog should cover..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Tone + Target Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Technical</option>
                <option>Storytelling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
              <input
                type="text"
                placeholder="e.g. Developers, Students"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Word Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Word Count: {wordCount}</label>
            <input
              type="range"
              min={300}
              max={2000}
              step={100}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>300</span>
              <span>2000</span>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Generating..." : "Generate Blog"}
          </button>
        </div>

        {/* Output */}
        {loading && (
          <div className="mt-10 text-center text-gray-400 animate-pulse">
            Searching the web and writing your blog...
          </div>
        )}

        {blogContent && (
          <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Generated Blog</h2>
            <article className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{blogContent}</ReactMarkdown>
            </article>
          </div>
        )}

      </div>
    </main>
  );
}