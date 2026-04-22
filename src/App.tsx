import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { MainApp } from "./components/MainApp";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 w-12 h-12 border-4 border-[#8B1E3F] border-b-transparent rounded-full animate-spin animate-reverse" />
          </div>
          <p className="font-mono text-[#FDF6E3]/60 text-sm tracking-widest uppercase">
            Initializing Revolution...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#FDF6E3",
            border: "1px solid #FF6B35",
            fontFamily: "Instrument Sans, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#FF6B35",
              secondary: "#0D0D0D",
            },
          },
          error: {
            iconTheme: {
              primary: "#8B1E3F",
              secondary: "#FDF6E3",
            },
          },
        }}
      />
      {isAuthenticated ? <MainApp /> : <AuthScreen />}
    </>
  );
}
