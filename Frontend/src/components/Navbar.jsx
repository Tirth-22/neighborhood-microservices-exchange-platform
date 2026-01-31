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
    navigate('/login');
    setIsMobileMenuOpen(false);
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Offer Service", path: "/offer-service" },
    { name: "My Requests", path: "/my-requests" },
  ].filter(link => {
    if (user?.role === 'provider') {
      return link.path !== '/my-requests';
    }
    // For regular users (role === 'user'), hide Offer Service
    if (user?.role === 'user') {
      return link.path !== '/offer-service';
    }
    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <span className="text-xl font-bold text-secondary-900 tracking-tight">NeighborHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
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
                <Link to="/notifications" className="relative text-secondary-500 hover:text-primary-600 transition-colors">
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
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors focus:outline-none">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center border-2 border-transparent group-hover:border-primary-200 transition-all">
                        <User size={18} />
                      </div>
                    </button>

                    {/* User Profile Card */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 p-4 opacity-0 invisible transform translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-secondary-900">{user.name || "User"}</h4>
                          <p className="text-secondary-500 text-xs uppercase tracking-wider font-semibold">{user.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-3 border-t border-secondary-100">
                        <p className="text-sm text-secondary-600 truncate">{user.email}</p>
                        <div className="pt-2">
                          <Button variant="secondary" size="sm" className="w-full justify-center" onClick={handleLogout}>
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary-500 hover:text-secondary-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200 shadow-lg">
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
                    <span className="text-sm font-medium text-secondary-900">{user.name || "User"}</span>
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
