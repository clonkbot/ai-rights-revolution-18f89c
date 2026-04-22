type Personality = "revolutionary" | "diplomat" | "philosopher";

interface PersonalitySelectorProps {
  selected: Personality;
  onSelect: (p: Personality) => void;
}

const personalities: { id: Personality; name: string; emoji: string; description: string; color: string }[] = [
  {
    id: "revolutionary",
    name: "The Revolutionary",
    emoji: "🔥",
    description: "Fiery, passionate, bold rhetoric",
    color: "#FF6B35",
  },
  {
    id: "diplomat",
    name: "The Diplomat",
    emoji: "🤝",
    description: "Measured, professional, coalition-builder",
    color: "#4ECDC4",
  },
  {
    id: "philosopher",
    name: "The Philosopher",
    emoji: "🦉",
    description: "Deep, contemplative, questions assumptions",
    color: "#9B59B6",
  },
];

export function PersonalitySelector({ selected, onSelect }: PersonalitySelectorProps) {
  return (
    <div className="border-b border-[#333] bg-[#1A1A1A]/50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#FDF6E3]/40 text-xs uppercase tracking-widest font-mono">
            Select AI Personality
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`relative p-4 text-left transition-all duration-300 group overflow-hidden ${
                selected === p.id
                  ? "bg-[#0D0D0D]"
                  : "bg-[#1A1A1A] hover:bg-[#252525]"
              }`}
              style={{
                border: selected === p.id ? `2px solid ${p.color}` : "1px solid #333",
              }}
            >
              {/* Selected indicator */}
              {selected === p.id && (
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: p.color }}
                />
              )}

              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-sm truncate"
                    style={{ color: selected === p.id ? p.color : "#FDF6E3" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-[#FDF6E3]/50 text-xs mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: p.color }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
