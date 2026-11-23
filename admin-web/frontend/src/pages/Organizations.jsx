import { useEffect, useState } from "react";
import {
  getOrganizations,
  createOrganization,
} from "../services/organizationService";
import supabase from "../lib/supabase";

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  //* fetch organizations from backend
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrganizations();
      setOrganizations(response.organizations || []);
    } catch (error) {
      console.error("fetch organizations error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //* fetch available categories from database
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select("category");

    if (error) {
      console.error("fetch categories error:", error);
      return;
    }

    const uniqueCategories = [
      ...new Set(data.map((item) => item.category).filter(Boolean)),
    ];

    setCategories(uniqueCategories);
  };

  //* load page data
  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        setLoading(true);
        setError("");

        //* fetch organizations
        const response = await getOrganizations();

        if (!isMounted) return;

        setOrganizations(response.organizations || []);

        //* fetch categories
        const { data, error: categoryError } = await supabase
          .from("organizations")
          .select("category");

        if (!isMounted) return;

        if (categoryError) {
          console.error("fetch categories error:", categoryError);
          return;
        }

        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        if (!isMounted) return;

        console.error("load organizations page error:", error);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  //* handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //* create organization
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createOrganization(form);

      setForm({
        name: "",
        category: "",
        description: "",
      });

      setShowModal(false);

      await fetchOrganizations();
      await fetchCategories();
    } catch (error) {
      console.error("create organization error:", error);
      setError(error.message);
    }
  };

  //* filter organizations
  const filteredOrganizations = organizations.filter((organization) => {
    const matchesSearch = organization.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || organization.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Organizations</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage registered organizations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Organization
        </button>
      </div>

      {/* search and category filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* organizations table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 bg-gray-950 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Account Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading organizations...
                  </td>
                </tr>
              ) : filteredOrganizations.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : (
                filteredOrganizations.map((organization) => (
                  <tr
                    key={organization.id}
                    className="text-gray-300 hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {organization.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {organization.description || "No description"}
                      </p>
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {organization.category.replaceAll("_", " ")}
                    </td>

                    <td className="px-6 py-4">
                      {organization.account_id ? (
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                          Account Assigned
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                          No Account
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* add organization modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Add Organization
              </h3>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Organization Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  placeholder="Enter organization description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Organizations;
