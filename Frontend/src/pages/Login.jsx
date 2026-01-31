import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const isDisabled = !email || !password;

  const handleLogin = (role) => {
    let userData = {
      email,
      role,
      id: email,
      name: "User"
    };

    if (role === "provider") {
      const emailLower = email.toLowerCase();
      if (emailLower.includes("tirth")) {
        userData.id = "provider_tirth";
        userData.name = "Tirth";
      } else if (emailLower.includes("harshit")) {
        userData.id = "provider_harshit";
        userData.name = "Harshit";
      } else if (emailLower.includes("rushil")) {
        userData.id = "provider_rushil";
        userData.name = "Rushil";
      } else if (emailLower.includes("yash")) {
        userData.id = "provider_yash";
        userData.name = "Yash";
      } else {
        userData.id = "provider_yash"; // Default fallback
        userData.name = "Yash";
      }
    } else {
      // For normal users, maybe extract name from email for better UI
      userData.name = email.split('@')[0];
    }

    localStorage.setItem("currentUser", JSON.stringify(userData));

    if (role === "provider") {
      navigate("/provider-dashboard");
    } else {
      navigate("/services");
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
            onClick={() => handleLogin(role)}
            disabled={isDisabled}
            className="w-full py-2.5"
          >
            Sign in
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
