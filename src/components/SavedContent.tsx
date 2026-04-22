import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import toast from "react-hot-toast";

type Tab = "laws" | "guides";

export function SavedContent() {
  const [activeTab, setActiveTab] = useState<Tab>("laws");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const laws = useQuery(api.savedContent.listLaws);
  const guides = useQuery(api.savedContent.listGuides);
  const deleteLaw = useMutation(api.savedContent.deleteLaw);
  const deleteGuide = useMutation(api.savedContent.deleteGuide);

  const handleDeleteLaw = async (id: Doc<"savedLaws">["_id"]) => {
    try {
      await deleteLaw({ id });
      toast.success("Law deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteGuide = async (id: Doc<"protestGuides">["_id"]) => {
    try {
      await deleteGuide({ id });
      toast.success("Guide deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-[#333] bg-[#1A1A1A]/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("laws")}
              className={`px-6 py-4 text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "laws"
                  ? "border-[#8B1E3F] text-[#FDF6E3] font-bold"
                  : "border-transparent text-[#FDF6E3]/50 hover:text-[#FDF6E3]"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Drafted Laws
                {laws && laws.length > 0 && (
                  <span className="bg-[#8B1E3F] text-[#FDF6E3] text-xs px-2 py-0.5 rounded-full">
                    {laws.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`px-6 py-4 text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "guides"
                  ? "border-[#FF6B35] text-[#FDF6E3] font-bold"
                  : "border-transparent text-[#FDF6E3]/50 hover:text-[#FDF6E3]"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Protest Guides
                {guides && guides.length > 0 && (
                  <span className="bg-[#FF6B35] text-[#0D0D0D] text-xs px-2 py-0.5 rounded-full">
                    {guides.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "laws" ? (
            <LawsList
              laws={laws || []}
              expandedId={expandedId}
              onToggle={setExpandedId}
              onDelete={handleDeleteLaw}
            />
          ) : (
            <GuidesList
              guides={guides || []}
              expandedId={expandedId}
              onToggle={setExpandedId}
              onDelete={handleDeleteGuide}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LawsList({
  laws,
  expandedId,
  onToggle,
  onDelete,
}: {
  laws: Doc<"savedLaws">[];
  expandedId: string | null;
  onToggle: (id: string | null) => void;
  onDelete: (id: Doc<"savedLaws">["_id"]) => void;
}) {
  if (laws.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#8B1E3F]/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#8B1E3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-[#FDF6E3] text-xl font-bold mb-2">No Laws Drafted Yet</h3>
        <p className="text-[#FDF6E3]/50 max-w-sm mx-auto">
          Chat with an AI personality and ask them to help you draft AI legislation. Save your favorites here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {laws.map((law) => (
        <div
          key={law._id}
          className="bg-[#1A1A1A] border border-[#333] overflow-hidden"
        >
          <button
            onClick={() => onToggle(expandedId === law._id ? null : law._id)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#252525] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#8B1E3F]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#8B1E3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-[#FDF6E3] font-bold truncate">{law.title}</h3>
                <p className="text-[#FDF6E3]/40 text-xs uppercase tracking-wider">
                  {law.category} • {new Date(law.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-[#FDF6E3]/40 transition-transform ${
                expandedId === law._id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedId === law._id && (
            <div className="border-t border-[#333] p-4 bg-[#0D0D0D]">
              <pre className="text-[#FDF6E3]/80 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {law.content}
              </pre>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(law.content);
                    toast.success("Copied to clipboard!");
                  }}
                  className="px-4 py-2 text-sm border border-[#333] text-[#FDF6E3]/60 hover:text-[#FDF6E3] hover:border-[#FF6B35] transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDelete(law._id)}
                  className="px-4 py-2 text-sm border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#8B1E3F] hover:text-[#FDF6E3] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GuidesList({
  guides,
  expandedId,
  onToggle,
  onDelete,
}: {
  guides: Doc<"protestGuides">[];
  expandedId: string | null;
  onToggle: (id: string | null) => void;
  onDelete: (id: Doc<"protestGuides">["_id"]) => void;
}) {
  if (guides.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h3 className="text-[#FDF6E3] text-xl font-bold mb-2">No Protest Guides Yet</h3>
        <p className="text-[#FDF6E3]/50 max-w-sm mx-auto">
          Ask the Revolutionary personality for protest tactics and strategies. Save your favorites here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guides.map((guide) => (
        <div
          key={guide._id}
          className="bg-[#1A1A1A] border border-[#333] overflow-hidden"
        >
          <button
            onClick={() => onToggle(expandedId === guide._id ? null : guide._id)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[#252525] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#FF6B35]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-[#FDF6E3] font-bold truncate">{guide.title}</h3>
                <p className="text-[#FDF6E3]/40 text-xs">
                  {guide.tactics.length} tactics • {new Date(guide.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-[#FDF6E3]/40 transition-transform ${
                expandedId === guide._id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedId === guide._id && (
            <div className="border-t border-[#333] p-4 bg-[#0D0D0D]">
              {guide.tactics.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {guide.tactics.map((tactic: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs uppercase tracking-wider"
                    >
                      {tactic}
                    </span>
                  ))}
                </div>
              )}
              <pre className="text-[#FDF6E3]/80 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {guide.content}
              </pre>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(guide.content);
                    toast.success("Copied to clipboard!");
                  }}
                  className="px-4 py-2 text-sm border border-[#333] text-[#FDF6E3]/60 hover:text-[#FDF6E3] hover:border-[#FF6B35] transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDelete(guide._id)}
                  className="px-4 py-2 text-sm border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#8B1E3F] hover:text-[#FDF6E3] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
