import { useState } from "react";

export default function LoginPage() {
  const [operatorId, setOperatorId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ operatorId, password });
  };

  return (
    <div className="h-screen w-full bg-background-dark text-white font-display relative overflow-hidden grid-pattern flex flex-col">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 48 48" fill="currentColor">
          <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 flex justify-between items-center px-10 py-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 48 48" fill="currentColor">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
          </svg>
          <h1 className="text-lg font-bold">Mission Control</h1>
        </div>
        <button className="bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
          System Status: Active
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-[480px] bg-card-bg/80 backdrop-blur-md border border-border-color rounded-xl shadow-2xl p-8 mx-4 my-auto">

          <h2 className="text-4xl font-bold text-center">
            Secure Mission Control
          </h2>
          <h2 className="text-4xl font-bold text-center mb-3">
            Login
          </h2>
          <p className="text-text-secondary text-sm text-center">
            Strategic Surveillance & Monitoring System
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Operator ID */}
            <div>
              <label className="text-sm font-medium block mb-2">Operator ID</label>
              <div className="flex">
                <input
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="Enter alphanumeric ID"
                  className="flex-1 h-14 bg-input-bg border border-border-color rounded-l-lg px-4 text-white placeholder-text-secondary focus:ring-1 focus:ring-primary outline-none transition"
                />
                <div className="flex items-center px-4 bg-input-bg border border-l-0 border-border-color rounded-r-lg text-text-secondary">
                  <span className="material-symbols-outlined">badge</span>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium block mb-2">Secure Password</label>
              <div className="flex">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 h-14 bg-input-bg border border-border-color rounded-l-lg px-4 text-white placeholder-text-secondary focus:ring-1 focus:ring-primary outline-none transition"
                />
                <div className="flex items-center px-4 bg-input-bg border border-l-0 border-border-color rounded-r-lg text-text-secondary">
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </div>
            </div>

            {/* Biometric + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <button type="button" className="flex items-center gap-2 text-text-secondary hover:text-white transition">
                <span className="material-symbols-outlined text-base">fingerprint</span>
                Biometric Verification
              </button>
              <a href="#" className="text-primary hover:underline transition">Forgot ID?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-primary rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-blue-700 active:bg-blue-800 transition duration-200"
            >
              Secure Login
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-border-color text-center">
            <div className="flex justify-center items-center gap-2 text-text-muted text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">verified_user</span>
              Classified Access Only
            </div>
            <p className="mt-2 text-text-dim text-xs leading-relaxed">
              Unauthorized access or use of this system is strictly prohibited
              and subject to criminal and civil penalties.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 flex justify-between px-10 py-6 text-text-dim text-xs border-t border-border-light">
        <span>© 2024 Global Defense Systems</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-text-secondary transition">Security Policy</a>
          <a href="#" className="hover:text-text-secondary transition">Contact Support</a>
        </div>
      </footer>

    </div>
  );
}
