import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Button from "./ui/Button";
import { Menu, X, User, Bell } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const getRole = (u) => {
    if (!u) return "";
    let r = u.role || u.roles || u.authorities || "";
    if (Array.isArray(r)) r = r[0];
    if (typeof r === "object" && r !== null)
      r = r.name || r.authority || r.role || "";
    return String(r || "").toUpperCase().trim();
  };

  const role = getRole(user);
  const isProvider = role === "PROVIDER" || role.includes("PROVIDER");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Offer Service", path: "/offer-service" },
    { name: "My Requests", path: "/my-requests" },
    { name: "Provider Dashboard", path: "/provider-dashboard" },
  ].filter((link) => {
    if (!user) {
      return link.path === "/" || link.path === "/services";
    }
    if (isProvider) {
      return link.path !== "/my-requests";
    }
    return link.path !== "/offer-service" && link.path !== "/provider-dashboard";
  });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-xl font-bold text-secondary-900">
              NeighborHub
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${isActive(link.path)
                      ? "text-primary-600"
                      : "text-secondary-600 hover:text-primary-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 pl-6 border-l border-secondary-200">
              {user && (
                <Link to="/notifications" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  <Bell size={20} />
                </Link>
              )}

              {!user ? (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-50 rounded-lg border border-secondary-100 transition-all duration-300">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <User size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-secondary-900 leading-none">
                        {user.name || user.username || "Account"}
                      </span>
                      <span className="text-[10px] text-secondary-500 uppercase font-medium tracking-tight">
                        {role}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-secondary-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-medium text-secondary-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                  ? "bg-primary-50 text-primary-700"
                  : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/notifications')
                ? "bg-primary-50 text-primary-700"
                : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                }`}
            >
              Notifications
            </Link>

            <div className="pt-4 border-t border-secondary-200 mt-4">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-secondary-900">{user.name || "User"}</span>
                      <span className="block text-xs text-secondary-500 uppercase">{role}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
