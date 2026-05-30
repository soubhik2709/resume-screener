"use client";
import { useState ,useRef } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Briefcase,
  BarChart3,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  Users,
  Medal
} from "lucide-react";
import {toast} from "sonner";

interface Candidate {
  filename: string;
  candidateName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  resumePreview: string;
  rank?: number;
  rank_position?: number;
}






export default function Home() {
  const [resumes, setResumes] = useState<File[]>([]);
  const [jdText, setJdText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [results, setResults] = useState<Candidate[]>([]);
 const resultsRef = useRef<HTMLDivElement>(null);

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

      // Testing
      console.log("the respnose is", res);

      setResults(res.data?.candidates);
      setSessionId(res.data.sessionId);

      setTimeout(() => {
  resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}, 1200);

      toast.success(`${res.data.totalCandidates} candidates analyzed`);
    } catch (error) {
      console.error(error);
      toast.error("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!sessionId) return;
    window.open(`http://localhost:5000/api/resumes/export/${sessionId}`); //what is window.open?
  };

  const getScoreColor = (score: number) => {
    if (score >= 70)
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        bar: "bg-emerald-500",
      };
    if (score >= 40)
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        bar: "bg-amber-500",
      };
    return { bg: "bg-rose-500/15", text: "text-rose-400", bar: "bg-rose-500" };
  };

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-slate-400 font-bold">#{rank}</span>;
};

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans">
      {/* background color */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%]  w-150 h-150 rounded-full bg-violet-600/10  blur-[115px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>


      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* why realtive? */}

        {/* Header */}
        <div className="mb-10 ">
          <div className="flex items-center gap-2 mb-3 ">
            <Briefcase className="w-5 h-5 text-violet-400" />
            <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
              Enterprise Talent Suite
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-1">
            Resume Screening
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-violet-400 mb-3">
            Candidate Ranking Web Application
          </h2>
          <p className="text-slate-400 text-base">
            Upload resumes and a job description — get ranked candidates
            instantly.
          </p>
        </div>

        {/* Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* Upload */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        {/* what is this backdrop-blur-sm */}
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4 text-violet-400" />
            <h2  className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              {/* tracking-wider  */}
              Upload Resumes
            </h2>
          </div>
          
          <label
          className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-200 group">
          {/* what is group */}

            <FileText className="w-8 h-8 text-slate-500 group-hover:text-violet-400 mb-2 transition-colors"/>
            {/* what is group hover? */}
            <span  className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
               Click to select PDF / DOCX files
            </span>
                <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={(e) => setResumes(Array.from(e.target.files || []))}
              />
          </label>
                {resumes.length > 0 && (
            <div className="mt-3 space-y-1">
               {resumes.map((f,i)=>(
                <div  key={i} className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 rounded-lg px-3 py-2">
                    <FileText className="w-3 h-3 text-violet-400 shrink-0" />
                    <span className="truncate">{f.name}</span>
                </div>
               ))}
            </div>
              )}
        </div>

        {/* Job Description */}
        <div  className="bg-white/4 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-cyan-400"/>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Job Description
              </h2>
          </div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-36 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 resize-none  focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all duration-200 overflow-y-auto custom-scroll"
            />
        </div>
      </div>

     {/* Action */}
     <div className="flex flex-wrap gap-3 mb-10">
      <button
       onClick={handleSubmit}
            disabled={loading || resumes.length === 0 || !jdText}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/30 disabled:shadow-none"
      >
        {loading ? (
          <>
          <Loader2 className="w-4 h-4 animate-spin"/>
          Analyzing…
          </>
        ):(
                   <>
                <BarChart3 className="w-4 h-4" />
                Analyze Resumes
              </>
        )}
        
      </button>
      {sessionId && (
         <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
      )}
     </div>

{/* Empty states  */}
 {results.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 text-sm">
              No results yet. Upload resumes and a job description to get started.
            </p>
          </div>
        )}

{/* Results */}

     {results.length > 0 && (
          <div ref={resultsRef} className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Ranked Candidates
              </h2>
              <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                {results.length} results
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-3 text-left">Rank</th>
                    <th className="px-6 py-3 text-left">Candidate</th>
                    <th className="px-6 py-3 text-left">Score</th>
                    <th className="px-6 py-3 text-left">Matching Skills</th>
                    <th className="px-6 py-3 text-left">Missing Skills</th>
                    <th className="px-6 py-3 text-left">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((c) => {
                    const score = getScoreColor(c.matchScore);
                    return (
                      <tr
                        key={c.rank}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-lg">
                          {getRankIcon(c.rank ?? c.rank_position ?? 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-200">{c.candidateName}</div>
                          <div className="text-xs text-slate-500 truncate max-w-35">{c.filename}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${score.bg} ${score.text}`}>
                            {c.matchScore}%
                          </div>
                          <div className="mt-1.5 w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${score.bar}`}
                              style={{ width: `${c.matchScore}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {c.matchingSkills.slice(0, 3).map((s) => (
                              <span key={s} className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-2.5 h-2.5" />{s}
                              </span>
                            ))}
                            {c.matchingSkills.length > 3 && (
                              <span className="text-xs text-slate-500">+{c.matchingSkills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {c.missingSkills.slice(0, 3).map((s) => (
                              <span key={s} className="flex items-center gap-1 bg-rose-500/10 text-rose-400 text-xs px-2 py-0.5 rounded-full">
                                <XCircle className="w-2.5 h-2.5" />{s}
                              </span>
                            ))}
                            {c.missingSkills.length > 3 && (
                              <span className="text-xs text-slate-500">+{c.missingSkills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 max-w-50 truncate">
                          {c.resumePreview}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/5">
              {results.map((c) => {
                const score = getScoreColor(c.matchScore);
                return (
                  <div key={c.rank} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{getRankIcon(c.rank ?? c.rank_position ?? 0)}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${score.bg} ${score.text}`}>
                        {c.matchScore}%
                      </span>
                    </div>
                    <div className="font-medium text-slate-200 mb-1">{c.candidateName}</div>
                    <div className="text-xs text-slate-500 mb-3">{c.filename}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {c.matchingSkills.slice(0, 3).map((s) => (
                        <span key={s} className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.missingSkills.slice(0, 3).map((s) => (
                        <span key={s} className="bg-rose-500/10 text-rose-400 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>








   
    </div>
  );
}

// how to use sooner , i install sooner
//position sticky vs fixed?
//uninstall old lucid react
