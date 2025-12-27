import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        <p className="text-center mt-4">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Don't have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
