import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Medicaments from "./pages/Medicaments";
import Ventes from "./pages/Ventes";
import Login from "./pages/Login";
import Users from "./pages/Users";
import logo from "./logo.png";


function App() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // return (
  // <div className="bg-red-500 text-white p-10">
  //   TEST LOGIN
  // </div>
  // );

  return (
    <Router>

      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* NOT LOGGED */}
        {!user && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        

        {/* LOGGED */}
        {user && (
          <Route
            path="*"
            element={
              <div className="min-h-screen flex">

                {/* SIDEBAR */}
                <div className={`relative bg-[#0f172a] text-white min-h-screen transition-all duration-300 ${open ? "w-64" : "w-20"} flex flex-col`}>

                {/* LOGO */}
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-12 h-12 rounded-xl shadow-md border border-gray-300"
                  />
                  {open && <span className="text-lg font-semibold">PharmaSystem</span>}
                </div>
                

                {/* TOGGLE BUTTON (جنب) */}
                <button
                  onClick={() => setOpen(!open)}
                  className="absolute -right-3 top-24 bg-white text-black w-7 h-7 rounded-full shadow flex items-center justify-center hover:bg-gray-200"
                >
                  {open ? "☰" : "☰"}
                </button>

                {/* MENU */}
                
                <div className="flex flex-col gap-2 mt-6 px-3">
                   <div className="mt-auto p-4">
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 w-full py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        🔓 {open && "Logout"}
                      </button>
                    </div>

                  {user?.role === "admin" && (
                    <>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-3 rounded-lg transition ${
                            isActive ? "bg-slate-700" : "hover:bg-slate-700"
                          }`
                        }
                      >
                        📊
                        {open && "Dashboard"}
                      </NavLink>

                      <NavLink
                        to="/medicaments"
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-3 rounded-lg transition ${
                            isActive ? "bg-slate-700" : "hover:bg-slate-700"
                          }`
                        }
                      >
                        💊
                        {open && "Medicaments"}
                      </NavLink>
                      
                    </>
                  )}

                  <NavLink
                    to="/ventes"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition ${
                        isActive ? "bg-slate-700" : "hover:bg-slate-700"
                      }`
                    }
                  >
                    🛒
                    {open && "Ventes"}

                    
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink to="/users" className="block p-2 hover:bg-slate-700 rounded">
                      👥 Users
                    </NavLink>
                  )}
                  

                </div>

                {/* LOGOUT */}
               

              </div>

                {/* MAIN */}
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">

                  <Routes>

                    {/* ADMIN */}
                    {user?.role === "admin" && (
                      <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/medicaments" element={<Medicaments />} />
                        <Route path="/ventes" element={<Ventes />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                        
                      </>
                    )}

                    {/* PHARMACIEN */}
                    {user?.role === "pharmacien" && (
                      <>
                        <Route path="/ventes" element={<Ventes />} />
                        <Route path="*" element={<Navigate to="/ventes" />} />
                      </>
                    )}

                  </Routes>

                </div>

              </div>
            }
          />
        )}

      </Routes>

    </Router>
  );
}

export default App;