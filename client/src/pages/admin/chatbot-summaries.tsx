import React, { useEffect, useState } from "react";

interface ChatbotSummary {
  sessionId: string;
  type: string;
  name?: string;
  email?: string;
  message: string;
  createdAt: string;
}

export default function ChatbotSummariesAdmin() {
  const [summaries, setSummaries] = useState<ChatbotSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chatbot-summaries")
      .then((res) => res.json())
      .then((data) => {
        setSummaries(data);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    window.open("/api/chatbot-summaries/excel", "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Chatbot Summaries</h1>
        <button
          onClick={handleDownload}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
        >
          Download Excel
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : summaries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No chatbot summaries found.</td>
              </tr>
            ) : (
              summaries.map((s) => (
                <tr key={s.sessionId + s.createdAt}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-primary font-semibold">{s.type.replace("_", " ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.email || "-"}</td>
                  <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-900 max-w-xs break-words">{s.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 