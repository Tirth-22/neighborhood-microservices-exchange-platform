import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-[#070e20] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-8 shadow-sm">
        <p className="text-sm uppercase tracking-widest text-primary-600 font-semibold mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">Page not found</h1>
        <p className="text-secondary-600 dark:text-secondary-300 mb-8">
          The page you requested does not exist. You can go back to the home page and continue exploring services.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary">Browse Services</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
