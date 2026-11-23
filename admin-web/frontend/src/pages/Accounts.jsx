import { useMemo, useState, useEffect } from "react";

import {
  getAvailableOrganizations,
  getOrganizationAccounts,
  createOrganizationAccount,
} from "../services/organizationAccountService";

import supabase from "../lib/supabase";


function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [availableOrganizations, setAvailableOrganizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [form, setForm] = useState({
    organization_id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [accountsResponse, organizationsResponse] = await Promise.all([
          getOrganizationAccounts(),
          getAvailableOrganizations(),
        ]);

        const formattedAccounts = accountsResponse.accounts.map((account) => ({
          ...account,
          organization: Array.isArray(account.organizations)
            ? account.organizations[0] || null
            : account.organizations,
        }));

        setAccounts(formattedAccounts);
        setAvailableOrganizations(organizationsResponse.organizations);
      } catch (error) {
        console.error("Error fetching organization accounts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      const uniqueCategories = [
        ...new Set(data.map((item) => item.category).filter(Boolean)),
      ];

      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        account.organization?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        account.email?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || account.organization?.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [accounts, search, category]);

  const openCreateModal = () => {
    setSelectedAccount(null);
    setForm({
      organization_id: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await createOrganizationAccount({
        organization_id: Number(form.organization_id),
        email: form.email,
        password: form.password,
      });

      alert(response.message);

      closeModal();

      setForm({
        organization_id: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Refresh account and organization lists
      const [accountsResponse, organizationsResponse] = await Promise.all([
        getOrganizationAccounts(),
        getAvailableOrganizations(),
      ]);

      const formattedAccounts = accountsResponse.accounts.map((account) => ({
        ...account,
        organization: Array.isArray(account.organizations)
          ? account.organizations[0] || null
          : account.organizations,
      }));

      setAccounts(formattedAccounts);
      setAvailableOrganizations(organizationsResponse.organizations);
    } catch (error) {
      console.error("Error creating organization account:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-full bg-[#292C43] p-4 text-white md:p-6">
      {/* Page heading */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Organization Accounts
          </h2>
          <p className="mt-1 text-sm text-[#AEB8D5]">
            Manage login accounts linked to registered organizations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-[#D9B77D] px-4 py-2.5 text-sm font-semibold text-[#292C43] transition hover:bg-[#e8c994]"
        >
          + Add Account
        </button>
      </div>

      {/* Account count */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full bg-[#D9B77D] px-5 py-2 text-sm font-semibold text-[#292C43]">
          All Accounts
          <span className="ml-2">{accounts.length}</span>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-full border border-[#50546C] bg-[#383C55] px-4 text-sm text-white outline-none placeholder:text-[#AEB8D5] focus:border-[#D9B77D] sm:max-w-xs"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-full border border-[#50546C] bg-[#383C55] px-4 text-sm text-white outline-none focus:border-[#D9B77D]"
        >
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Accounts table */}
      {/* Loading and error states */}
      {loading && (
        <p className="mb-4 text-sm text-[#AEB8D5]">
          Loading organization accounts...
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Accounts table */}
      <div className="overflow-hidden rounded-xl border border-[#41445B] bg-[#383C55]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-[#32364E] text-[11px] uppercase tracking-wider text-[#AEB8D5]">
              <tr>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Login Email</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#4A4E68]">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition hover:bg-[#41455F]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold">
                        {account.organization?.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm capitalize text-[#C5CDE2]">
                      {account.organization?.category?.replaceAll("_", " ")}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#C5CDE2]">
                      {account.email}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedAccount(account)}
                        className="rounded-full bg-[#D9B77D] px-4 py-2 text-xs font-semibold text-[#292C43] hover:bg-[#e8c994]"
                      >
                        View / Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-16 text-center">
                    <p className="text-sm font-semibold text-white">
                      No organization accounts found
                    </p>
                    <p className="mt-2 text-xs text-[#AEB8D5]">
                      Organization accounts will appear here once created.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#4A4E68] px-5 py-4 text-xs text-[#AEB8D5]">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </div>
      </div>

      {/* Create account modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#50546C] bg-[#292C43] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Create Organization Account
                </h3>
                <p className="mt-1 text-xs text-[#AEB8D5]">
                  Create login credentials for an organization.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-xl text-[#AEB8D5] hover:text-white"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organization
                </label>
                <select
                  required
                  value={form.organization_id}
                  onChange={(e) =>
                    setForm({ ...form, organization_id: e.target.value })
                  }
                  className="h-11 w-full rounded-lg border border-[#50546C] bg-[#383C55] px-3 text-sm text-white outline-none focus:border-[#D9B77D]"
                >
                  <option value="">Select an organization</option>
                  {availableOrganizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Login Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="organization@example.com"
                  className="h-11 w-full rounded-lg border border-[#50546C] bg-[#383C55] px-3 text-sm text-white outline-none placeholder:text-[#AEB8D5] focus:border-[#D9B77D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="h-11 w-full rounded-lg border border-[#50546C] bg-[#383C55] px-3 text-sm text-white outline-none placeholder:text-[#AEB8D5] focus:border-[#D9B77D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm password"
                  className="h-11 w-full rounded-lg border border-[#50546C] bg-[#383C55] px-3 text-sm text-white outline-none placeholder:text-[#AEB8D5] focus:border-[#D9B77D]"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#41445B] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[#50546C] px-4 py-2.5 text-sm text-[#C5CDE2] hover:bg-[#383C55]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#D9B77D] px-5 py-2.5 text-sm font-semibold text-[#292C43] hover:bg-[#e8c994]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/manage account placeholder */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#50546C] bg-[#292C43] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">Account Details</h3>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-xl text-[#AEB8D5] hover:text-white"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-[#AEB8D5]">Organization</p>
                <p className="mt-1 font-semibold">
                  {selectedAccount.organization?.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#AEB8D5]">Category</p>
                <p className="mt-1 capitalize">
                  {selectedAccount.organization?.category?.replaceAll("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#AEB8D5]">Login Email</p>
                <p className="mt-1">{selectedAccount.email}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAccount(null)}
                className="rounded-lg bg-[#D9B77D] px-5 py-2.5 text-sm font-semibold text-[#292C43]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;
