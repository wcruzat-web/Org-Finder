import { useEffect, useState } from "react";

import {
  getSemesters,
  createSemester,
  updateSemester,
} from "../services/semesterService";

const emptyForm = {
  name: "",
  starts_on: "",
  ends_on: "",
};

const getSemesterStatus = (semester) => {
  const today = new Date().toISOString().slice(0, 10);

  if (today < semester.starts_on) return "Upcoming";
  if (today > semester.ends_on) return "Ended";
  return "Active";
};

function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSemesters();
      setSemesters(response.semesters || []);
    } catch (err) {
      setError(err.message || "Failed to load semesters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSemesters = async () => {
      try {
        const response = await getSemesters();

        if (isMounted) {
          setSemesters(response.semesters || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load semesters.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSemesters();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (semester) => {
    setForm({
      name: semester.name,
      starts_on: semester.starts_on,
      ends_on: semester.ends_on,
    });

    setEditingId(semester.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.starts_on > form.ends_on) {
      setError("The start date cannot be after the end date.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateSemester(editingId, form);
        setSuccess("Semester updated successfully.");
      } else {
        await createSemester(form);
        setSuccess("Semester created successfully.");
      }

      resetForm();
      await fetchSemesters();
    } catch (err) {
      setError(err.message || "Failed to save semester.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusStyles = {
    Active: "bg-green-500/10 text-green-400 border border-green-500/30",
    Upcoming: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
    Ended: "bg-gray-800 text-gray-400 border border-gray-700",
  };

  const inputStyles =
    "w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Semesters</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage academic semester schedules.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Semester
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? "Edit Semester" : "Add Semester"}
            </h3>

            <button
              onClick={resetForm}
              disabled={saving}
              className="text-xl text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Semester Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. First Semester 2026-2027"
                required
                className={inputStyles}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  name="starts_on"
                  value={form.starts_on}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  name="ends_on"
                  value={form.ends_on}
                  onChange={handleChange}
                  min={form.starts_on || undefined}
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Save Semester"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 bg-gray-950 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Semester</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">End Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading semesters...
                  </td>
                </tr>
              ) : semesters.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No semesters found.
                  </td>
                </tr>
              ) : (
                semesters.map((semester) => {
                  const status = getSemesterStatus(semester);

                  return (
                    <tr
                      key={semester.id}
                      className="text-gray-300 hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {semester.name}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {formatDate(semester.starts_on)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {formatDate(semester.ends_on)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(semester)}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Semesters;
