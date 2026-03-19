import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import Button from "../components/ui/Button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const emailFromQuery = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [token, setToken] = useState(tokenFromQuery);
  const [email, setEmail] = useState(emailFromQuery);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verifyToken = async (verifyTokenValue) => {
    if (!verifyTokenValue) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authApi.verifyEmail(verifyTokenValue);
      if (!response?.data?.success) {
        setError(response?.data?.message || "Verification failed.");
        return;
      }
      setMessage(response?.data?.message || "Email verified successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromQuery) {
      verifyToken(tokenFromQuery);
    }
  }, [tokenFromQuery]);

  const handleVerify = (e) => {
    e.preventDefault();
    verifyToken(token);
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email to resend verification.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authApi.resendVerification({ email });
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to resend verification.");
        return;
      }

      setMessage(response?.data?.message || "Verification token generated.");
      const newToken = response?.data?.data?.verificationToken;
      if (newToken) {
        setToken(newToken);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-[#070e20] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Verify Email</h1>
        <p className="text-secondary-600 dark:text-secondary-300 mb-6 text-sm">
          Verify your email to complete account activation.
        </p>

        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Verification Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Email (for resend)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2.5 text-secondary-900 dark:text-secondary-100"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700 dark:text-green-400">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <Button variant="secondary" className="w-full mt-3" onClick={handleResend} disabled={loading}>
          Resend Verification
        </Button>

        <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-5">
          Back to <Link to="/signin" className="text-primary-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
