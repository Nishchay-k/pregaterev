'use client'
import { Building2, Clock, FileText, Calculator, ListChecks, AlertCircle, GraduationCap, Layers, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">About GATE</h1>
        <p className="text-slate-400 text-sm mt-1">What the exam actually is, who runs it, and how it's structured — and how GateForge mirrors that structure.</p>
      </div>

      {/* What is GATE */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={18} className="text-blue-400" />
          <h2 className="font-semibold text-white">What is GATE?</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          The <strong className="text-white">Graduate Aptitude Test in Engineering (GATE)</strong> is a national-level exam in India that tests comprehensive understanding of undergraduate-level engineering and science subjects.
          A qualifying score is used for admission to <strong className="text-white">M.Tech / PhD programs</strong> at IITs, NITs, IIITs and other institutes, and is also accepted by many <strong className="text-white">Public Sector Undertakings (PSUs)</strong> for direct recruitment.
        </p>
      </div>

      {/* Who conducts it */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={18} className="text-purple-400" />
          <h2 className="font-semibold text-white">Who Conducts GATE?</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          GATE is jointly conducted by the <strong className="text-white">Indian Institute of Science (IISc) Bangalore</strong> and the <strong className="text-white">seven IITs</strong> (Roorkee, Delhi, Guwahati, Kanpur, Kharagpur, Madras, Bombay), on behalf of the <strong className="text-white">National Coordination Board – GATE</strong>, under the Ministry of Education, Government of India.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          The role of <em>organizing institute</em> rotates every year among these eight institutions — each year's organizer sets that year's exact dates, releases the syllabus PDF, and publishes results.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="text-xs text-blue-400 font-medium mb-0.5">GATE 2026 Organizing Institute</div>
            <div className="text-sm text-white font-semibold">IIT Guwahati</div>
          </div>
          <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium mb-0.5">GATE 2027 Organizing Institute</div>
            <div className="text-sm text-white font-semibold">IIT Madras</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          Since the organizer changes yearly, always cross-check exact dates and notifications on that year's official GATE website.
        </p>
      </div>

      {/* Exam pattern */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-green-400" />
          <h2 className="font-semibold text-white">Exam Pattern</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Duration', val: '3 hours', icon: Clock },
            { label: 'Total Marks', val: '100', icon: Calculator },
            { label: 'Total Questions', val: '65', icon: ListChecks },
            { label: 'Mode', val: 'CBT (online)', icon: FileText },
          ].map(({ label, val, icon: Icon }) => (
            <div key={label} className="bg-slate-900/50 rounded-lg p-3 text-center">
              <Icon size={14} className="text-slate-500 mx-auto mb-1.5" />
              <div className="text-sm font-bold text-white">{val}</div>
              <div className="text-[11px] text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="text-sm text-slate-300 mb-3">Every paper, regardless of subject, splits into two sections:</div>
        <div className="space-y-2 mb-2">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <span className="text-amber-400 font-bold text-sm w-16 shrink-0">15 marks</span>
            <span className="text-sm text-slate-300">General Aptitude (GA) — mandatory on <em>every</em> GATE paper, same format regardless of stream</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <span className="text-blue-400 font-bold text-sm w-16 shrink-0">85 marks</span>
            <span className="text-sm text-slate-300">Subject-specific — for CSE/DA this includes Engineering Mathematics (~13 marks) + core subject (~72 marks)</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">30 questions carry 1 mark each, 35 carry 2 marks each (30×1 + 35×2 = 100).</p>
      </div>

      {/* Question types & marking */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks size={18} className="text-cyan-400" />
          <h2 className="font-semibold text-white">Question Types & Marking Scheme</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500 text-left">
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Format</th>
                <th className="py-2 pr-3">Negative Marking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="py-2.5 pr-3"><span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 font-medium">MCQ</span></td>
                <td className="py-2.5 pr-3 text-slate-300">Single correct option (A/B/C/D)</td>
                <td className="py-2.5 pr-3 text-red-400">−1/3 mark (1-mark Qs) · −2/3 mark (2-mark Qs)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3"><span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 font-medium">MSQ</span></td>
                <td className="py-2.5 pr-3 text-slate-300">One or more correct options — must select ALL correct ones, no partial credit</td>
                <td className="py-2.5 pr-3 text-green-400">None</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3"><span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-medium">NAT</span></td>
                <td className="py-2.5 pr-3 text-slate-300">No options — type a numeric answer directly</td>
                <td className="py-2.5 pr-3 text-green-400">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CSE vs DA */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={18} className="text-orange-400" />
          <h2 className="font-semibold text-white">GATE CSE vs GATE DA</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <div className="text-blue-400 font-semibold mb-1">GATE CS (Computer Science & IT)</div>
            <p className="text-slate-400 text-xs leading-relaxed">Established, long-running paper. 11 subjects spanning theory of computation, OS, DBMS, networks, and more.</p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
            <div className="text-orange-400 font-semibold mb-1">GATE DA (Data Science & AI)</div>
            <p className="text-slate-400 text-xs leading-relaxed">Introduced in GATE 2024 — one of the newest papers. Covers ML, deep learning, probability/statistics, and AI alongside shared foundations.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Both share core foundations — Linear Algebra, Probability & Statistics, Programming & Data Structures, Algorithms — which is why GateForge's Syllabus tab lets you view them merged, separate, or side-by-side.</p>
      </div>

      {/* How GateForge mirrors this */}
      <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-5">
        <h2 className="font-semibold text-white mb-3">How GateForge Mirrors This</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">Full Mock tests</strong> automatically reserve ~15% of questions for General Aptitude, matching the real 15/100 mark split.</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">Scoring</strong> applies negative marking only to MCQs — MSQ and NAT are never penalized, exactly per GATE rules.</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span><span><strong className="text-white">PYQ Library and Tests</strong> include all three question formats (MCQ, MSQ, NAT) so you practice the actual interaction style, not just multiple choice.</span></li>
        </ul>
      </div>

      <p className="text-xs text-slate-600 text-center pb-4">
        This page summarizes the general GATE structure for study planning purposes. Always verify exact dates, eligibility, and any pattern changes on the official site for your exam year (e.g. gate2026.iitg.ac.in).
      </p>
    </div>
  )
}
