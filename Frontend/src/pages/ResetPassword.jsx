import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import Button from "../components/ui/Button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const initialToken = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.resetPassword({ token, newPassword });
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to reset password.");
        return;
      }
      setMessage("Password reset successfully. You can now sign in.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-[#070e20] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Reset Password</h1>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6 text-sm">Enter your reset token and a new password.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700 dark:text-green-400">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>

        <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-5">
          Back to <Link to="/signin" className="text-primary-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
