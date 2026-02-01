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
      // Backend RegisterRequest: { username, password, email, role }
      const payload = {
        username,
        password,
        email,
        role: role.toUpperCase() // Backend expects uppercase enum likely, or string
      };

      const response = await authApi.register(payload);

      if (response.data.success) {
        // On success, redirect to login
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

  const isDisabled =
    !username || !email || !password || !confirmPassword || !role || loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            N
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Join our community of neighbors today.
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

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                I am joining as a...
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="" disabled>Select Role</option>
                <option value="user">User (Looking for help)</option>
                <option value="provider">Provider (Providing help)</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleSignup}
            disabled={isDisabled}
            className="w-full py-2.5"
          >
            {loading ? "Creating Account..." : "Create Account"}
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
