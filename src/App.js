import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, LogOut, Menu, Pill, ShoppingCart, Users as UsersIcon } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Medicaments from "./pages/Medicaments";
import Ventes from "./pages/Ventes";
import Login from "./pages/Login";
import Users from "./pages/Users";
import logo from "./logo.png";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(true);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.setItem("lang", i18n.language);
    window.location.href = "/login";
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive ? "bg-slate-700" : "hover:bg-slate-700"
    }`;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {!user && <Route path="*" element={<Navigate to="/login" />} />}

        {user && (
          <Route
            path="*"
            element={
              <div className="min-h-screen flex">
                <aside
                  className={`relative bg-[#0f172a] text-white min-h-screen transition-all duration-300 ${
                    open ? "w-64" : "w-20"
                  } flex flex-col`}
                >
                  <div className="flex items-center gap-3 p-4">
                    <img
                      src={logo}
                      alt="logo"
                      className="w-12 h-12 rounded-xl shadow-md border border-gray-300"
                    />
                    {open && <span className="text-lg font-semibold">{t("appName")}</span>}
                  </div>

                  <button
                    onClick={() => setOpen(!open)}
                    className="absolute -right-3 top-24 bg-white text-black w-7 h-7 rounded-full shadow flex items-center justify-center hover:bg-gray-200"
                    aria-label="Toggle menu"
                  >
                    <Menu size={16} />
                  </button>

                  <nav className="flex flex-col gap-2 mt-6 px-3">
                    <select
                      value={i18n.language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="w-full rounded-lg bg-slate-800 p-2 text-sm text-white outline-none"
                      aria-label={t("language")}
                    >
                      <option value="fr">FR</option>
                      <option value="en">EN</option>
                    </select>

                    <button
                      onClick={handleLogout}
                      className="bg-red-500 w-full py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      {open && t("logout")}
                    </button>

                    {user?.role === "admin" && (
                      <>
                        <NavLink to="/dashboard" className={navClass}>
                          <LayoutDashboard size={20} />
                          {open && t("dashboard")}
                        </NavLink>

                        <NavLink to="/medicaments" className={navClass}>
                          <Pill size={20} />
                          {open && t("medicaments")}
                        </NavLink>
                      </>
                    )}

                    <NavLink to="/ventes" className={navClass}>
                      <ShoppingCart size={20} />
                      {open && t("sales")}
                    </NavLink>

                    {user?.role === "admin" && (
                      <NavLink to="/users" className={navClass}>
                        <UsersIcon size={20} />
                        {open && t("users")}
                      </NavLink>
                    )}
                  </nav>
                </aside>

                <main className="flex-1 p-6 bg-gray-100 min-h-screen">
                  <Routes>
                    {user?.role === "admin" && (
                      <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/medicaments" element={<Medicaments />} />
                        <Route path="/ventes" element={<Ventes />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </>
                    )}

                    {user?.role === "pharmacien" && (
                      <>
                        <Route path="/ventes" element={<Ventes />} />
                        <Route path="*" element={<Navigate to="/ventes" />} />
                      </>
                    )}
                  </Routes>
                </main>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
