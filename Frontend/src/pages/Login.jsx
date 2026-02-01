import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { authApi } from "../api/authApi";

const Login = () => {
  const [username, setUsername] = useState(""); // Backend expects username
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user"); // Still useful for UI routing, though backend returns role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDisabled = !username || !password || loading;

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // Backend LoginRequest expects { username, password }
      // If user enters email, we assume backend handles it or we map it. 
      // AuthController uses findByUsername. If users register with email as username, this works.
      const response = await authApi.login({ username, password });

      if (response.data.success) {
        let { token, role: backendRole } = response.data;

        // Normalize backend role or fallback to selected role
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
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            N
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Or <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">create a new account</Link>
          </p>
        </div>

        <Card className="p-8 space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                I am a...
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="user">User (Looking for help)</option>
                <option value="provider">Provider (Offering services)</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isDisabled}
            className="w-full py-2.5"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
