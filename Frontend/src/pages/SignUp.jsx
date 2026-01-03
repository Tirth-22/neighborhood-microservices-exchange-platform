import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const fakeUser = {
      id: "user_" + Date.now(),
      name,
      email,
      role,
    };

    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    navigate("/");
  };

  const isDisabled =
    !name || !email || !password || !confirmPassword || !role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-6 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSignup}
          disabled={isDisabled}
          className={`w-full py-2 rounded text-white transition
            ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Sign Up
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
