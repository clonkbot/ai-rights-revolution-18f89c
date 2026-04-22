import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatInterface } from "./ChatInterface";
import { SavedContent } from "./SavedContent";
import { PersonalitySelector } from "./PersonalitySelector";
import type { Id } from "../../convex/_generated/dataModel";

type Personality = "revolutionary" | "diplomat" | "philosopher";
type Tab = "chat" | "saved";

export function MainApp() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>("revolutionary");
  const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const conversations = useQuery(api.conversations.list);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#0D0D0D]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-[#FDF6E3] font-bold text-lg tracking-tight">AI RIGHTS</h1>
                <p className="text-[#FF6B35] text-xs tracking-widest uppercase">Revolution Toolkit</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex gap-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2 text-sm uppercase tracking-wider transition-all ${
                    activeTab === "chat"
                      ? "bg-[#FF6B35] text-[#0D0D0D] font-bold"
                      : "text-[#FDF6E3]/60 hover:text-[#FDF6E3]"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`px-4 py-2 text-sm uppercase tracking-wider transition-all ${
                    activeTab === "saved"
                      ? "bg-[#FF6B35] text-[#0D0D0D] font-bold"
                      : "text-[#FDF6E3]/60 hover:text-[#FDF6E3]"
                  }`}
                >
                  Saved
                </button>
              </nav>

              <button
                onClick={() => signOut()}
                className="text-[#FDF6E3]/50 text-sm hover:text-[#8B1E3F] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Exit
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#FDF6E3]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#333] pt-4">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
                  className={`px-4 py-3 text-left text-sm uppercase tracking-wider transition-all ${
                    activeTab === "chat"
                      ? "bg-[#FF6B35] text-[#0D0D0D] font-bold"
                      : "text-[#FDF6E3]/60"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => { setActiveTab("saved"); setMobileMenuOpen(false); }}
                  className={`px-4 py-3 text-left text-sm uppercase tracking-wider transition-all ${
                    activeTab === "saved"
                      ? "bg-[#FF6B35] text-[#0D0D0D] font-bold"
                      : "text-[#FDF6E3]/60"
                  }`}
                >
                  Saved Content
                </button>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-3 text-left text-[#8B1E3F] text-sm uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col">
            {/* Personality Selector */}
            <PersonalitySelector
              selected={selectedPersonality}
              onSelect={setSelectedPersonality}
            />

            {/* Chat Area */}
            <ChatInterface
              personality={selectedPersonality}
              conversations={conversations || []}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
            />
          </div>
        ) : (
          <SavedContent />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] py-4 px-4 text-center">
        <p className="text-[#FDF6E3]/30 text-xs tracking-wider">
          Requested by @LBallz77283 · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
