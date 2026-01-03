import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-md mb-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold text-blue-600">NeighborHub</Link>

        <ul className="hidden md:flex space-x-6  text-gray-700 font-medium">

          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/services" className="hover:text-blue-600">Services</Link></li>
          <li><Link to="/offer-service" className="hover:text-blue-600">Offer Service</Link></li>
          <li><Link to="/my-requests" className="hover:text-blue-600"> My Requests</Link></li>
          <li><Link to="/notifications" className="hover:text-blue-600">Notifications</Link></li>

          <div>
            {!user ? (
              <li>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Logout
                </button>
              </li>
            )}

          </div>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
