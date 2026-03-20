import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response?.data?.message || "If the email exists, reset instructions have been sent.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-[#070e20] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Forgot Password</h1>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6 text-sm">
          Enter your email and we will generate reset instructions.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700 dark:text-green-400">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Generate Reset Link"}
          </Button>

          <Link to="/reset-password" className="block text-center text-primary-600 font-medium">
            I already have a reset link
          </Link>
        </form>

        <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-5">
          Remember your password? <Link to="/signin" className="text-primary-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
