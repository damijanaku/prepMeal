import { Link } from "react-router-dom"

function RegisterForm() {
    return (
        <div className="w-full max-w-sm rounded-lg border bg-[#FBE9E7] border-gray-200  p-4 mx-2">
        <img src="../../assets/sushi_003.png" alt="PrepMeal Logo" className="mx-auto mb-4" />

          <h1 className="mb-4 text-center text-xl font-semibold">Create new account</h1>

          <form>
            <div className="mb-4">
              <label htmlFor="name" className="mb-1 block text-sm text-[#F28378]">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2  text-gray-400 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:[#EF9A9A]"
              />
            </div>
            
        <div className="mb-4">
              <label htmlFor="username" className="mb-1 block text-sm text-[#F28378]">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="john_doe"
                autoComplete="username"
                className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-400 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:[#EF9A9A]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm text-[#F28378]">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-400 placeholder-[#7f8c8d] focus:outline-none focus:ring-2 focus:[#EF9A9A]"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="mb-1 block text-sm text-[#F28378]">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                autoComplete="new-password"
                className="w-full rounded border border-gray-300 bg-slate-100 px-2 py-2 text-gray-400 focus:outline-none focus:ring-2 focus:[#EF9A9A]"
              />
            </div>

            <div className="mb-2 text-right">
              <a href="#" className="text-sm text-gray-400 hover:[#EF9A9A]">
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full rounded bg-[#EF9A9A] py-2.5 font-small text-white transition-colors duration-300 hover:bg-[#E57373]"
              type="submit"
            >
              Create account
            </button>
          </form>
          
          <Link to="/login" className="mt-4 block text-center text-sm text-[#F28378] hover:[#EF9A9A]">
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
    )
}

export { RegisterForm }