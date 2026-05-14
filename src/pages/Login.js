import React, { useState } from "react";
import axios from "axios";
import { HelpCircle, Moon } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/api/login", {
      email,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    })
    .catch(() => alert("Login failed"));
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-[#f5f7f9]">
        <h1 className="text-2xl font-bold text-[#4a40e0]">
          PharmaSys
        </h1>

        <div className="flex gap-4 text-gray-500">
          
          <Moon className="w-5 h-5 cursor-pointer hover:text-indigo-500" />
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-grow flex items-center justify-center pt-16">

        <div className="bg-white p-10 rounded-2xl shadow w-[420px]">

          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back 👋
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Login to your Pharma System
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                placeholder="name@email.com"
                className="w-full mt-2 p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between">
                <label className="text-sm font-semibold">Password</label>
                
              </div>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full mt-2 p-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-6 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>
              
              
            </div>

            {/* REMEMBER */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span className="text-sm text-gray-500">
                Keep me signed in
              </span>
            </div>

            {/* BUTTON login */}
           
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl 
              !bg-indigo-600 text-white font-bold 
              shadow-lg 
              hover:!bg-indigo-600 
              focus:!bg-indigo-600 
              active:!bg-indigo-600 
              transition"
            >
              LOGIN
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;













