import { LoginForm } from '../components/LoginForm';

function Login() {
  return (
    <div className="grid min-h-screen w-full grid-cols-2 bg-slate-100">
      <div className="flex flex-wrap items-center justify-center bg-[#FFC5BB] p-8">
        <img src="../../assets/bg.png" alt="Logo" className="h-full w-full"  />
        
      </div>

      <div className="flex flex-wrap items-center justify-center bg-[#FFC5BB] p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;