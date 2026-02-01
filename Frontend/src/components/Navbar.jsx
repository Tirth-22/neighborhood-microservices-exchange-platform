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

  // ---- ROLE HANDLING (SAFE) ----
  const getRole = (u) => {
    if (!u) return "";
    let r = u.role || u.roles || u.authorities || "";
    if (Array.isArray(r)) r = r[0];
    if (typeof r === "object" && r !== null)
      r = r.name || r.authority || "";
    return String(r || "").toLowerCase().trim();
  };

  const role = getRole(user);
  if (user) console.log("DEBUG: Navbar Role Detection", { role, raw: user });

  const isProvider = role.includes("provider");
  const isUser = role.includes("user") || role === "client" || (!isProvider && user);

  // ---- NAV LINKS (IMAGE-2 LOGIC) ----
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Offer Service", path: "/offer-service" },
    { name: "My Requests", path: "/my-requests" },
  ].filter((link) => {
    if (!user) {
      return link.path === "/" || link.path === "/services";
    }

    if (isProvider) {
      // IMAGE-2 provider navbar: Home, Services, Offer Service
      return link.path !== "/my-requests";
    }

    if (isUser) {
      // User navbar: Home, Services, My Requests
      return link.path !== "/offer-service";
    }

    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
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
                    className={`text-sm font-medium ${isActive(link.path)
                      ? "text-primary-600"
                      : "text-secondary-600 hover:text-primary-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 pl-6 border-l">
              {user && (
                <Link to="/notifications">
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
                <div className="relative group">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer">
                    <User size={18} />
                  </div>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 invisible group-hover:visible z-50 border border-secondary-100">
                    <p className="font-semibold text-secondary-900">{user.name}</p>
                    <p className="text-xs text-secondary-500 uppercase tracking-wider">
                      {role}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-secondary-600 hover:text-secondary-900"
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
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
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
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/notifications')
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
