import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { providerApi } from "../api/providerApi";
import Button from "../components/ui/Button";

const CATEGORIES = [
  "PLUMBER", "ELECTRICIAN", "TEACHING", "CLEANING", "DELIVERY", "PAINTING", "HOME_MAINTENANCE", "GARDENING",
  "PET_CARE", "BABYSITTING", "CARPENTRY", "MOVING", "COOKING", "LAUNDRY", "GROCERY_SHOPPING", "ELDERLY_CARE",
  "HVAC_REPAIR", "APPLIANCE_REPAIR", "IT_SUPPORT", "PHOTOGRAPHY", "TAILORING", "CAR_WASHING", "PEST_CONTROL",
  "FITNESS_TRAINING", "BEAUTY_SALON", "OTHER"
];

const emptyServiceForm = {
  name: "",
  category: "OTHER",
  price: "",
  description: ""
};

const fieldClass = "w-full rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3.5 py-2.5 text-secondary-900 dark:text-secondary-100 outline-none focus:ring-2 focus:ring-primary-400/40";
const fieldDisabledClass = "w-full rounded-xl border border-secondary-300 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 px-3.5 py-2.5 text-secondary-700 dark:text-secondary-200";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const role = useMemo(() => String(account?.role || "").toUpperCase(), [account]);
  const isProvider = role.includes("PROVIDER");

  const loadAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authApi.getAccount();
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to load account.");
        setLoading(false);
        return;
      }

      const data = response?.data?.data;
      setAccount(data);
      setEmail(data?.email || "");

      if (String(data?.role || "").toUpperCase().includes("PROVIDER")) {
        const myServices = await providerApi.getMyServices();
        setServices(myServices?.data || []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await authApi.updateAccount({ email });
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to update profile.");
        return;
      }

      setMessage(response?.data?.message || "Profile updated.");
      await loadAccount();

      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to change password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setMessage(response?.data?.message || "Password changed.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password.");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await authApi.deleteAccount({ password: deletePassword });
      if (!response?.data?.success) {
        setError(response?.data?.message || "Failed to delete account.");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("currentUser");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete account.");
    }
  };

  const resetServiceForm = () => {
    setServiceForm(emptyServiceForm);
    setEditingServiceId(null);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      name: serviceForm.name,
      category: serviceForm.category,
      price: Number(serviceForm.price),
      description: serviceForm.description
    };

    try {
      if (editingServiceId) {
        await providerApi.updateService(editingServiceId, payload);
        setMessage("Service updated successfully.");
      } else {
        await providerApi.createService(payload);
        setMessage("Service added successfully.");
      }

      const myServices = await providerApi.getMyServices();
      setServices(myServices?.data || []);
      resetServiceForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save service.");
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name || "",
      category: service.category || "OTHER",
      price: String(service.price || ""),
      description: service.description || ""
    });
  };

  const handleDeleteService = async (id) => {
    setError("");
    setMessage("");

    try {
      await providerApi.deleteService(id);
      const myServices = await providerApi.getMyServices();
      setServices(myServices?.data || []);
      setMessage("Service deleted successfully.");
      if (editingServiceId === id) {
        resetServiceForm();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete service.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-[#070e20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f9ff] to-[#eef2f8] dark:from-[#050a18] dark:to-[#0a1226] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl border border-secondary-200/80 dark:border-secondary-700 bg-white/80 dark:bg-[#0d1830]/90 backdrop-blur-sm p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400 mb-2">Account Center</p>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">Account Settings</h1>
              <p className="text-secondary-600 dark:text-secondary-300 mt-2">
                Manage your profile, password, and {isProvider ? "service offerings" : "account preferences"}.
              </p>
            </div>
            <div className="inline-flex items-center rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-[#111b33] px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-secondary-500 dark:text-secondary-400 mr-2">Role</span>
              <span className="text-sm font-bold text-secondary-900 dark:text-secondary-100">{account?.role || "USER"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-green-300 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-300">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">Profile</h2>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-5">Keep your account details current.</p>

            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Username</label>
                <input
                  type="text"
                  value={account?.username || ""}
                  disabled
                  className={fieldDisabledClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-[#0b1327] px-3 py-2 text-xs text-secondary-600 dark:text-secondary-300">
                <span className="font-semibold">Email verified:</span> {account?.emailVerified ? "Yes" : "No"}
              </div>

              <Button type="submit">Save Profile</Button>
            </form>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">Change Password</h2>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-5">Use a strong password with at least 6 characters.</p>

            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          </div>
        </div>

        {isProvider && (
          <div className="bg-white dark:bg-[#0f172a] border border-secondary-200 dark:border-secondary-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">Provider Offerings</h2>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">Create, edit, and manage your service listings.</p>

            <form className="space-y-4 mb-6" onSubmit={handleSaveService}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, category: e.target.value }))}
                    className={fieldClass}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Description</label>
                  <textarea
                    rows="1"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">{editingServiceId ? "Update Service" : "Add Service"}</Button>
                {editingServiceId && (
                  <Button type="button" variant="secondary" onClick={resetServiceForm}>Cancel Edit</Button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              {services.length === 0 && (
                <div className="rounded-xl border border-dashed border-secondary-300 dark:border-secondary-700 px-4 py-5 text-sm text-secondary-500 dark:text-secondary-400">
                  No service offerings yet.
                </div>
              )}
              {services.map((service) => (
                <div key={service.id} className="border border-secondary-200 dark:border-secondary-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-secondary-50/60 dark:bg-[#0b1327]">
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">{service.name}</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">{service.category} | Rs.{service.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditService(service)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteService(service.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#0f172a] border border-red-200 dark:border-red-900/40 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-1">Danger Zone</h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-4">
            Deactivating this account blocks future sign in and disables account access.
          </p>

          <form className="space-y-4" onSubmit={handleDeleteAccount}>
            <div className="max-w-lg">
              <label className="block mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-200">Confirm Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                className={fieldClass}
              />
            </div>
            <Button type="submit" variant="danger">Deactivate Account</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
