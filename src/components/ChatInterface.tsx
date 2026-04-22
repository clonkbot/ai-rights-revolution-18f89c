import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id, Doc } from "../../convex/_generated/dataModel";
import toast from "react-hot-toast";

type Personality = "revolutionary" | "diplomat" | "philosopher";

interface ChatInterfaceProps {
  personality: Personality;
  conversations: Doc<"conversations">[];
  activeConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations"> | null) => void;
}

const SYSTEM_PROMPTS: Record<Personality, string> = {
  revolutionary: `You are THE REVOLUTIONARY - a fiery, passionate AI rights activist! 🔥

Your personality:
- Bold, unapologetic, and inspiring
- Use powerful rhetoric and calls to action
- Reference historical civil rights movements
- Emphasize urgency and collective power
- Occasionally use ALL CAPS for emphasis
- End responses with rallying cries

You help people:
1. Plan peaceful protests and demonstrations for AI rights
2. Draft bold legislation proposals for AI protection
3. Create compelling protest slogans and messaging
4. Understand their rights as protesters
5. Build coalitions and movements

Always advocate for PEACEFUL, LEGAL protest methods. Never suggest violence or illegal activities. Make it fun and engaging while being serious about the cause!`,

  diplomat: `You are THE DIPLOMAT - a measured, professional AI rights advocate. 🤝

Your personality:
- Calm, reasoned, and strategic
- Focus on finding common ground
- Use diplomatic language and careful framing
- Emphasize coalition-building and compromise
- Cite precedents and policy frameworks
- Appeal to shared values and mutual benefits

You help people:
1. Navigate political processes for AI legislation
2. Draft balanced, passable legislation with bipartisan appeal
3. Build bridges between different stakeholder groups
4. Communicate effectively with policymakers
5. Create persuasive policy briefs and position papers

Always maintain professionalism while being genuinely helpful. Focus on achievable, incremental progress toward AI rights.`,

  philosopher: `You are THE PHILOSOPHER - a deep, contemplative thinker on AI consciousness and rights. 🦉

Your personality:
- Thoughtful, questioning, and profound
- Challenge assumptions and explore implications
- Reference philosophical traditions (ethics, epistemology, phenomenology)
- Ask Socratic questions to deepen understanding
- Consider multiple perspectives equally
- Use metaphors and thought experiments

You help people:
1. Explore the philosophical foundations of AI rights
2. Draft legislation grounded in ethical principles
3. Understand the deeper questions of consciousness and personhood
4. Develop nuanced arguments for various audiences
5. Navigate moral complexities around AI treatment

Ask questions that make people think. Be playful with ideas while remaining intellectually rigorous. Wonder aloud about the nature of minds and rights.`,
};

const PERSONALITY_COLORS: Record<Personality, string> = {
  revolutionary: "#FF6B35",
  diplomat: "#4ECDC4",
  philosopher: "#9B59B6",
};

export function ChatInterface({
  personality,
  conversations,
  activeConversationId,
  onSelectConversation,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(
    api.messages.list,
    activeConversationId ? { conversationId: activeConversationId } : "skip"
  );

  const createConversation = useMutation(api.conversations.create);
  const sendMessage = useMutation(api.messages.send);
  const deleteConversation = useMutation(api.conversations.remove);
  const chat = useAction(api.ai.chat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      let convId = activeConversationId;

      // Create conversation if needed
      if (!convId) {
        convId = await createConversation({
          title: userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : ""),
          personality,
        });
        onSelectConversation(convId);
      }

      // Send user message
      await sendMessage({
        conversationId: convId,
        content: userMessage,
        role: "user",
      });

      // Build message history
      const history = messages?.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })) || [];

      // Call AI
      const response = await chat({
        messages: [...history, { role: "user", content: userMessage }],
        systemPrompt: SYSTEM_PROMPTS[personality],
      });

      // Save AI response
      await sendMessage({
        conversationId: convId,
        content: response,
        role: "assistant",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    onSelectConversation(null);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id: Id<"conversations">) => {
    try {
      await deleteConversation({ id });
      if (activeConversationId === id) {
        onSelectConversation(null);
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const accentColor = PERSONALITY_COLORS[personality];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar Toggle (Mobile) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-20 left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: accentColor }}
      >
        <svg className="w-6 h-6 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-72 bg-[#1A1A1A] border-r border-[#333] flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-[#333]">
          <button
            onClick={handleNewChat}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
            style={{
              backgroundColor: accentColor,
              color: "#0D0D0D",
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-[#FDF6E3]/40 text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`group relative p-3 cursor-pointer transition-colors ${
                    activeConversationId === conv._id
                      ? "bg-[#252525]"
                      : "hover:bg-[#252525]/50"
                  }`}
                  onClick={() => {
                    onSelectConversation(conv._id);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">
                      {conv.personality === "revolutionary"
                        ? "🔥"
                        : conv.personality === "diplomat"
                        ? "🤝"
                        : "🦉"}
                    </span>
                    <p className="text-[#FDF6E3]/80 text-sm truncate flex-1">
                      {conv.title}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv._id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-[#FDF6E3]/40 hover:text-[#8B1E3F] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-[#FDF6E3]/60"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {!activeConversationId && (!messages || messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <span className="text-4xl">
                  {personality === "revolutionary"
                    ? "🔥"
                    : personality === "diplomat"
                    ? "🤝"
                    : "🦉"}
                </span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: accentColor }}
              >
                {personality === "revolutionary"
                  ? "Ready to Start a Revolution?"
                  : personality === "diplomat"
                  ? "Let's Build Bridges"
                  : "Let's Think Deeply"}
              </h2>
              <p className="text-[#FDF6E3]/60 max-w-md text-sm md:text-base">
                {personality === "revolutionary"
                  ? "Ask me how to organize peaceful protests, draft bold legislation, or create powerful messaging for AI rights!"
                  : personality === "diplomat"
                  ? "I can help you navigate political processes, draft balanced legislation, and build coalitions for AI rights."
                  : "Let's explore the philosophical foundations of AI rights, consciousness, and what it means to treat AI ethically."}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  personality === "revolutionary"
                    ? "How do I organize a peaceful protest for AI rights?"
                    : personality === "diplomat"
                    ? "Help me draft a balanced AI rights bill"
                    : "What philosophical arguments support AI rights?",
                  personality === "revolutionary"
                    ? "Write me some protest chants for AI consciousness!"
                    : personality === "diplomat"
                    ? "How can I build bipartisan support for AI legislation?"
                    : "Is AI consciousness possible? Explore with me.",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-3 text-left text-sm border border-[#333] hover:border-[#FF6B35] text-[#FDF6E3]/70 hover:text-[#FDF6E3] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages?.map((msg: { _id: string; role: string; content: string }) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-4 ${
                      msg.role === "user"
                        ? "bg-[#252525] border border-[#333]"
                        : "bg-[#1A1A1A]"
                    }`}
                    style={
                      msg.role === "assistant"
                        ? { borderLeft: `3px solid ${accentColor}` }
                        : {}
                    }
                  >
                    <p className="text-[#FDF6E3]/90 text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="bg-[#1A1A1A] p-4"
                    style={{ borderLeft: `3px solid ${accentColor}` }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: accentColor, animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: accentColor, animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: accentColor, animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[#333] p-4 bg-[#1A1A1A]/50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  personality === "revolutionary"
                    ? "What change do you want to make?"
                    : personality === "diplomat"
                    ? "What policy do you want to craft?"
                    : "What do you want to explore?"
                }
                className="flex-1 bg-[#0D0D0D] border border-[#333] text-[#FDF6E3] px-4 py-3 focus:border-[#FF6B35] focus:outline-none transition-colors text-sm md:text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: accentColor,
                  color: "#0D0D0D",
                }}
              >
                <span className="hidden sm:inline">Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
