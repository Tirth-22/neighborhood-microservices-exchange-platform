import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const isDisabled = !email || !password;

  const handleLogin = (role) => {
    let providerId = null;

    if (role === "provider") {
      providerId = "provider_yash"; 
    }

    const fakeUser = {
      id: role === "provider" ? providerId : "user_" + Date.now(),
      email,
      role
    };


    localStorage.setItem("currentUser", JSON.stringify(fakeUser));

    if (role === "provider") {
      navigate("/provider-dashboard");
    } else {
      navigate("/services");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Login as </option>
          <option value="user">Login as User</option>
          <option value="provider">Login as Provider</option>
        </select>

        <button
          onClick={() => handleLogin(role)}
          disabled={isDisabled}
          className={`w-full py-2 rounded text-white transition
            ${isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
