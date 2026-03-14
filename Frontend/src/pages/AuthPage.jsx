import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const persistAuth = (userData, token, rememberMe) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  otherStorage.removeItem("token");
  otherStorage.removeItem("currentUser");
  storage.setItem("token", token);
  storage.setItem("currentUser", JSON.stringify(userData));
};

const AuthPage = ({ initialTab = "login" }) => {
  const isLoginPage = initialTab === "login";
  const navigate = useNavigate();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("USER");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupRole, setSignupRole] = useState("USER");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const loginDisabled = !loginUsername || !loginPassword || !loginRole || loginLoading;
  const signupDisabled = !signupUsername || !signupEmail || !signupPassword || !confirmPassword || !signupRole || signupLoading;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await authApi.login({
        username: loginUsername,
        password: loginPassword,
        role: loginRole
      });

      if (!response?.data?.success) {
        setLoginError("Invalid credentials or server error");
        return;
      }

      const { token, role: backendRole } = response.data;
      const finalRole = String(backendRole || loginRole).toUpperCase().trim();
      const userData = {
        name: loginUsername,
        username: loginUsername,
        role: finalRole,
        token,
        id: loginUsername
      };

      persistAuth(userData, token, true);

      if (finalRole === "ADMIN") {
        navigate("/admin");
      } else if (finalRole === "PROVIDER") {
        navigate("/notifications");
      } else {
        navigate("/services");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Invalid credentials or server error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    setSignupLoading(true);

    try {
      const payload = {
        username: signupUsername,
        password: signupPassword,
        email: signupEmail,
        role: signupRole
      };

      const response = await authApi.register(payload);

      if (!response?.data?.success) {
        setSignupError(response?.data?.message || "Registration failed");
        return;
      }

      setLoginUsername(signupUsername);
      setLoginPassword("");
      setLoginRole(signupRole);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setSignupError("Registration failed. Server unavailable or Gateway Error.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-8 dark:bg-[#070e20] sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-4xl font-bold text-white shadow-lg shadow-blue-400/35">
          N
        </div>

        {isLoginPage ? (
          <>
            <h1 className="text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Sign in to NeighborHub</h1>
            <p className="mt-2 text-center text-xl text-slate-600 dark:text-[#c5d3eb]">
              Ready to help or get help? {" "}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Sign up here
              </Link>
            </p>

            <div className="mt-6 w-full rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm dark:border-[#253351] dark:bg-[#0f172a]">
              <form className="space-y-5" onSubmit={handleLogin}>
                {loginError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                    {loginError}
                  </p>
                )}

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Username / Email</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">I am signing in as...</label>
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  >
                    <option value="USER">User (Looking for help)</option>
                    <option value="PROVIDER">Provider (Offering services)</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loginDisabled}
                  className="w-full rounded-xl bg-blue-400 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {loginLoading ? "Signing in..." : "Sign in to Dashboard"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
            <p className="mt-2 text-center text-xl text-slate-600 dark:text-[#c5d3eb]">Join the neighborhood hub today.</p>

            <div className="mt-6 w-full rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm dark:border-[#253351] dark:bg-[#0f172a]">
              <form className="space-y-5" onSubmit={handleSignup}>
                {signupError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                    {signupError}
                  </p>
                )}

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Username</label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Email address</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:placeholder:text-[#8ea0bf] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-[#d4def2]">I am joining as a...</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#253351] dark:bg-[#111b33] dark:text-[#f8fbff] dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  >
                    <option value="USER">User</option>
                    <option value="PROVIDER">Provider</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={signupDisabled}
                  className="w-full rounded-xl bg-blue-400 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {signupLoading ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-base text-slate-600 dark:text-[#c5d3eb]">
                  Already have an account? {" "}
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
