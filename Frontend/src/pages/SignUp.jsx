import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { authApi } from "../api/authApi";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!username || !email || !password || !confirmPassword || !role) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username,
        password,
        email,
        role: role.toUpperCase()
      };

      const response = await authApi.register(payload);

      if (response.data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }

    } catch (err) {
      console.error(err);
      setError("Registration failed. Server unavailable or Gateway Error.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !username || !email || !password || !confirmPassword || !role || loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
            N
          </div>
          <h2 className="mt-8 text-4xl font-extrabold text-secondary-900 tracking-tight">
            Create an account
          </h2>
          <p className="mt-3 text-secondary-600 text-lg">
            Join the neighborhood hub today.
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
              label="Username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="group">
              <label className="block text-sm font-semibold text-secondary-700 mb-2 ml-1">
                I am joining as a...
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-secondary-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 appearance-none cursor-pointer hover:border-primary-400 transition-all"
                >
                  <option value="" disabled className="bg-white text-secondary-900">Select Role</option>
                  <option value="user" className="bg-white text-secondary-900">User (Looking for help)</option>
                  <option value="provider" className="bg-white text-secondary-900">Provider (Providing help)</option>
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
            onClick={handleSignup}
            disabled={isDisabled}
            className="w-full py-4 text-lg font-bold rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? "Building account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
