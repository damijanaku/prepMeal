import { useApiClient } from "../utils/apiClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const { apiCall } = useApiClient(); 
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await apiCall("http://localhost:5204/api/account/register", {
        method: "POST",
        body: JSON.stringify({ name, username, email, password, confirmPassword }),
        requiresAuth: false, // Registration doesn't need authentication
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorBody = await response.text();
        setErrorMessage(errorBody || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while registering. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="w-full max-w-sm rounded-lg border bg-[#FBE9E7] border-gray-200 p-4 mx-2">
      <img src="../../assets/sushi_003.png" alt="PrepMeal Logo" className="mx-auto mb-4" />

      <h1 className="mb-4 text-center text-xl font-semibold">Create new account</h1>

      {errorMessage && (
        <div className="mb-4 rounded bg-red-100 p-2 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm text-[#F28378]">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-900 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="mb-1 block text-sm text-[#F28378]">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john_doe"
            autoComplete="username"
            className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-900 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm text-[#F28378]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-900 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm text-[#F28378]">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="mb-1 block text-sm text-[#F28378]">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
            required
          />
        </div>

        <button
          disabled={isLoading}
          className="w-full rounded bg-[#EF9A9A] py-2.5 font-small text-white transition-colors duration-300 hover:bg-[#E57373] disabled:opacity-50"
          type="submit"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
      
      <Link to="/login" className="mt-4 block text-center text-sm text-[#F28378] hover:text-[#EF9A9A]">
        Already have an account? Sign in
      </Link>
      <p className="mt-8 text-sm text-gray-400">
        By clicking on sign in, you agree to our{' '}
        <a href="#" className="underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

export { RegisterForm };