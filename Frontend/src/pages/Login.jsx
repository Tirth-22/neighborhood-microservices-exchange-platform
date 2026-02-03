import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { authApi } from "../api/authApi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDisabled = !username || !password || loading;

  const handleLogin = async () => {
    setError("");

    setLoading(true);
    try {
      const response = await authApi.login({ username, password });

      if (response.data.success) {
        let { token, role: backendRole } = response.data;
        const finalRole = String(backendRole || role).toUpperCase().trim();

        const userData = {
          name: username,
          role: finalRole,
          token: token,
          id: username
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("token", token);

        if (finalRole === "ADMIN") {
          navigate("/admin");
        } else if (finalRole === "PROVIDER") {
          navigate("/provider-dashboard");
        } else {
          navigate("/services");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
            N
          </div>
          <h2 className="mt-8 text-4xl font-extrabold text-secondary-900 tracking-tight">
            Sign in to NeighborHub
          </h2>
          <p className="mt-3 text-secondary-600 text-lg">
            Ready to help or get help? <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 underline underline-offset-4 decoration-primary-300/30">Sign up here</Link>
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <Input
              label="Username / Email"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="group">
              <label className="block text-sm font-semibold text-secondary-700 mb-2 ml-1">
                I am signing in as...
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-secondary-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 appearance-none cursor-pointer hover:border-primary-400 transition-all"
                >
                  <option value="user">User (Looking for help)</option>
                  <option value="provider">Provider (Offering services)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-secondary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isDisabled}
            className="w-full py-4 text-lg font-bold rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? "Verifying..." : "Sign in to Dashboard"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
