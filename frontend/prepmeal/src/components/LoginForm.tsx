import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApiClient } from "../utils/apiClient";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { apiCall } = useApiClient();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    
    try {
      const response = await apiCall('/api/account/login', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail: email, password }),
        requiresAuth: false 
      });
      
      const data = await response.json();
      login(data.token, data.refreshToken, data.user);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Login failed');
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-[#FBE9E7] p-4 mx-2">
      <img src="../assets/sushi_002.png" alt="PrepMeal Logo" className="mx-auto mb-4" />

      <h1 className="mb-4 text-center text-xl font-semibold text-gray-800">
        Sign in to your account
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#F28378]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#F28378]">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
          />
        </div>

        <div className="mb-2 text-right">
          <a href="#" className="text-sm text-gray-500 hover:text-[#EF9A9A]">
            Forgot Password?
          </a>
        </div>

        <button
          disabled={isLoading}
          className="w-full rounded bg-[#EF9A9A] py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#E57373] disabled:opacity-50"
          type="submit"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <Link to="/register" className="mt-4 block text-center text-sm text-[#F28378] hover:text-[#EF9A9A]">
        Don't have an account? Sign up
      </Link>
      <p className="mt-8 text-sm text-gray-400">
        By clicking on sign in, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

export { LoginForm };