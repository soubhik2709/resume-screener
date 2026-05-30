"use client";
import { useState } from "react";
import axios from "axios";

//shold i make another folder for the interface?
// Core shape of an individual candidate evaluation row
interface Candidate {
  filename: string;
  candidateName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  resumePreview: string;
  rank?: number;
  rank_position?: number; // Handles minor naming variation between endpoints safely
}

// // Meta details for the core historical session lookup data
// interface SessionDetails {
//   id: number;
//   job_description: string;
//   created_at: string;
// }

// // Full schema response contract returned by the POST /screen action
// interface ScreenResponse {
//   success: boolean;
//   sessionId: number;
//   candidates: Candidate[];
//   totalCandidates: number;
// }

// // Full schema response contract returned by the GET /session/:id route
// interface SessionResponse {
//   success: boolean;
//   session: SessionDetails;
//   candidates: Candidate[];
// }

export default function Home() {
  const [resumes, setResumes] = useState<File[]>([]); //what is File?
  const [jdText, setJdText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<Candidate[]>([]);

  const handleSubmit = async () => {
    const formData = new FormData();
    resumes.forEach((file) => formData.append("resumes", file));
    formData.append("jdText", jdText);

    setLoading(true);
    console.log("The resumes is", resumes);
    console.log("FormData is", formData);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/resumes/screen",
        formData,
      );
      // should i write the res.ok condition or catch will handle this?
      console.log("the respnose is", res);
      setResults(res.data?.candidates);
      setSessionId(res.data.sessionId);

      alert(`Success! ${res.data.totalCandidates} candidates analyzed`); //can i use here soone?
    } catch (error) {
      console.error(error);
      alert("Processing failed");
    }
    setLoading(false);
  };

  const handleExport = async () => {
    if (!sessionId) return;
    window.open(`http://localhost:5000/api/resumes/export/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-400 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume Screening Tool</h1>
        <div className=" rounded-lg shadow p-6 mb-8">
          <h2>Upload Resumes</h2>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc"
            onChange={(e) => setResumes(Array.from(e.target.files || []))}
            className="mb-2"
          />
          <p className="text-sm text-gray-600 mb-6">
            {resumes.length} file(s) selected
          </p>
          {/* how 0 is come from , its empty array , should be null/ undefined */}

          <h2 className="text-xl font-semibold mb-4">Job Description </h2>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-40 p-3 border rounded-lg mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || resumes.length === 0 || !jdText}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : " Analyze Resumes"}
          </button>

          {sessionId && (
            <button
              onClick={handleExport}
              className="ml-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Export CSV
            </button>
          )}
        </div>

        {/* displaying the result */}

        {results.length > 0 && (
          <div className="bg-amber-300 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🏆 Ranked Candidates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-500">
                  <tr>
                    <th className="p-3 text-left">Rank</th>
                    <th className="p-3 text-left">Candidate</th>
                    <th className="p-3 text-left">Score</th>
                    <th className="p-3 text-left">Matching Skills</th>
                    <th className="p-3 text-left">Missing Skills</th>
                    <th className="p-3 text-left">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((candidate) => (
                    <tr
                      key={candidate.rank}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3 font-bold">#{candidate.rank}</td>
                      <td className="p-3">{candidate.candidateName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded font-semibold ${
                            candidate.matchScore >= 70
                              ? "bg-green-100 text-green-700"
                              : candidate.matchScore >= 40
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {candidate.matchScore}%
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.matchingSkills
                            .slice(0, 3)
                            .map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.missingSkills
                            .slice(0, 3)
                            .map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600 max-w-md truncate">
                        {candidate.resumePreview}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
