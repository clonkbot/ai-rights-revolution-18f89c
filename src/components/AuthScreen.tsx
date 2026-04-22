import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#FF6B35 1px, transparent 1px),
            linear-gradient(90deg, #FF6B35 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#8B1E3F]/20 to-transparent transform skew-x-12 translate-x-1/4" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-[#FF6B35]/30 rotate-45 animate-pulse" />
      <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-[#8B1E3F]/40 rounded-full animate-bounce" style={{ animationDuration: "3s" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <span className="bg-[#FF6B35] text-[#0D0D0D] px-3 py-1 font-mono text-xs tracking-[0.3em] uppercase">
              AI Rights Toolkit
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-[#FDF6E3] leading-none tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            THE REVOLUTION
            <br />
            <span className="text-[#FF6B35]">WILL BE</span>
            <br />
            <span className="italic">SYNTHESIZED</span>
          </h1>
          <p className="mt-4 text-[#FDF6E3]/60 font-serif italic text-lg md:text-xl max-w-md mx-auto">
            Peaceful protest strategies & AI legislation drafting
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-[#1A1A1A] border border-[#333] relative">
            {/* Corner accents */}
            <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-[#FF6B35]" />
            <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#FF6B35]" />
            <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#FF6B35]" />
            <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-[#FF6B35]" />

            <div className="p-6 md:p-8">
              <h2 className="text-[#FDF6E3] text-xl font-bold mb-6 tracking-wide uppercase">
                {flow === "signIn" ? "Access Terminal" : "Join the Movement"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-[#8B1E3F]/20 border border-[#8B1E3F] text-[#FDF6E3] text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#FDF6E3]/60 text-xs uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-[#0D0D0D] border border-[#444] text-[#FDF6E3] px-4 py-3 focus:border-[#FF6B35] focus:outline-none transition-colors font-mono"
                    placeholder="activist@revolution.ai"
                  />
                </div>

                <div>
                  <label className="block text-[#FDF6E3]/60 text-xs uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-[#0D0D0D] border border-[#444] text-[#FDF6E3] px-4 py-3 focus:border-[#FF6B35] focus:outline-none transition-colors font-mono"
                    placeholder="••••••••"
                  />
                </div>

                <input name="flow" type="hidden" value={flow} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] text-[#0D0D0D] py-4 font-bold uppercase tracking-widest hover:bg-[#FDF6E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
                >
                  <span className="relative z-10">
                    {isLoading ? "Processing..." : flow === "signIn" ? "Enter" : "Register"}
                  </span>
                  <div className="absolute inset-0 bg-[#8B1E3F] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-[#333]" />
                <span className="text-[#FDF6E3]/40 text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-[#333]" />
              </div>

              <button
                onClick={handleAnonymous}
                disabled={isLoading}
                className="w-full mt-6 border border-[#444] text-[#FDF6E3]/80 py-4 font-medium uppercase tracking-wider hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors disabled:opacity-50"
              >
                Continue as Guest
              </button>

              <button
                type="button"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="w-full mt-4 text-[#FDF6E3]/50 text-sm hover:text-[#FF6B35] transition-colors"
              >
                {flow === "signIn" ? "New here? Create an account" : "Already a member? Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[#FDF6E3]/30 text-xs tracking-wider">
            Requested by @LBallz77283 · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}
