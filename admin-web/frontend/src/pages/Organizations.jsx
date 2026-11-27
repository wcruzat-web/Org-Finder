import { useEffect, useState } from "react";
import {
  getOrganizations,
  createOrganization,
} from "../services/organizationService";
import {
  getOrganizationOfficers,
  searchStudentAccounts,
  assignOrganizationOfficer,
  removeOrganizationOfficer,
} from "../services/organizationOfficerService";
import supabase from "../lib/supabase";

const courses = [
  {
    label: "BS Agricultural and Biosystems Engineering",
    value: "BS Agricultural and Biosystems Engineering",
  },
  { label: "BS Architecture", value: "BS Architecture" },
  { label: "BS Civil Engineering", value: "BS Civil Engineering" },
  { label: "BS Computer Engineering", value: "BS Computer Engineering" },
  { label: "BS Computer Science", value: "BS Computer Science" },
  { label: "BS Electrical Engineering", value: "BS Electrical Engineering" },
  { label: "BS Electronics Engineering", value: "BS Electronics Engineering" },
  { label: "BS Industrial Engineering", value: "BS Industrial Engineering" },
  { label: "BS Industrial Technology", value: "BS Industrial Technology" },
  { label: "BS Information Technology", value: "BS Information Technology" },
];

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState("");

  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [officerLoading, setOfficerLoading] = useState(false);
  const [officerError, setOfficerError] = useState("");
  const [officerActionLoading, setOfficerActionLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);

  const initialForm = {
    name: "",
    category: "",
    description: "",
    course_eligibility: "all",
    eligible_courses: [],
  };

  const [form, setForm] = useState(initialForm);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrganizations();
      setOrganizations(response.organizations || []);
    } catch (err) {
      console.error("fetch organizations error:", err);
      setError(err.message || "Unable to load organizations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data, error: categoryError } = await supabase
      .from("organizations")
      .select("category");

    if (categoryError) {
      console.error("fetch categories error:", categoryError);
      return;
    }

    const uniqueCategories = [
      ...new Set(data.map((item) => item.category).filter(Boolean)),
    ];

    setCategories(uniqueCategories);
  };

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        const response = await getOrganizations();

        if (!isMounted) return;
        setOrganizations(response.organizations || []);

        const { data, error: categoryError } = await supabase
          .from("organizations")
          .select("category");

        if (!isMounted) return;

        if (categoryError) {
          console.error("fetch categories error:", categoryError);
          return;
        }

        setCategories([
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ]);
      } catch (err) {
        if (!isMounted) return;
        console.error("load organizations page error:", err);
        setError(err.message || "Unable to load organizations.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEligibilityChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      course_eligibility: value,
      eligible_courses: value === "all" ? [] : prev.eligible_courses,
    }));
  };

  const handleCourseSelection = (e) => {
    const selectedCourses = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setForm((prev) => ({
      ...prev,
      eligible_courses: selectedCourses,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (
        form.course_eligibility === "specific" &&
        form.eligible_courses.length === 0
      ) {
        setError("Please select at least one eligible course.");
        return;
      }

      await createOrganization({
        ...form,
        eligible_courses:
          form.course_eligibility === "all" ? [] : form.eligible_courses,
      });

      setForm(initialForm);
      setShowModal(false);

      await fetchOrganizations();
      await fetchCategories();
    } catch (err) {
      console.error("create organization error:", err);
      setError(err.message || "Unable to create organization.");
    }
  };

  const openOfficerModal = async (organization) => {
    setSelectedOrganization(organization);
    setShowOfficerModal(true);
    setStudentSearch("");
    setStudentResults([]);
    setOfficers([]);
    setOfficerError("");

    await fetchOrganizationOfficers(organization.id);
  };

  const closeOfficerModal = () => {
    setShowOfficerModal(false);
    setSelectedOrganization(null);
    setOfficers([]);
    setStudentSearch("");
    setStudentResults([]);
    setOfficerError("");
  };

  const fetchOrganizationOfficers = async (organizationId) => {
    try {
      setOfficerLoading(true);
      setOfficerError("");

      const response = await getOrganizationOfficers(organizationId);
      setOfficers(response.officers || []);
    } catch (err) {
      console.error("fetch organization officers error:", err);
      setOfficerError(
        err.message || "Unable to retrieve organization officers.",
      );
    } finally {
      setOfficerLoading(false);
    }
  };

  const handleStudentSearch = async (e) => {
    const query = e.target.value;
    setStudentSearch(query);
    setStudentResults([]);

    if (query.trim().length < 2) {
      setStudentSearchLoading(false);
      return;
    }

    try {
      setStudentSearchLoading(true);

      const response = await searchStudentAccounts(query.trim());
      setStudentResults(response.students || []);
    } catch (err) {
      console.error("student search error:", err);
      setOfficerError(err.message || "Unable to search student accounts.");
    } finally {
      setStudentSearchLoading(false);
    }
  };

  const handleAssignOfficer = async (studentId) => {
    if (!selectedOrganization) return;

    try {
      setOfficerActionLoading(true);
      setOfficerError("");

      await assignOrganizationOfficer(selectedOrganization.id, studentId);

      await fetchOrganizationOfficers(selectedOrganization.id);

      setStudentResults((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, alreadyAssigned: true }
            : student,
        ),
      );
    } catch (err) {
      console.error("assign officer error:", err);
      setOfficerError(err.message || "Unable to assign officer.");
    } finally {
      setOfficerActionLoading(false);
    }
  };

  const handleRemoveOfficer = async (studentId) => {
    if (!selectedOrganization) return;

    try {
      setOfficerActionLoading(true);
      setOfficerError("");

      await removeOrganizationOfficer(selectedOrganization.id, studentId);

      await fetchOrganizationOfficers(selectedOrganization.id);
    } catch (err) {
      console.error("remove officer error:", err);
      setOfficerError(err.message || "Unable to remove officer.");
    } finally {
      setOfficerActionLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter((organization) => {
    const matchesSearch = (organization.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || organization.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Organizations</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage registered organizations.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Organization
        </button>
      </div>

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

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-800 bg-gray-950 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 text-center font-medium">
                  Current Members
                </th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading organizations...
                  </td>
                </tr>
              ) : filteredOrganizations.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
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
                      {(organization.category || "").replaceAll("_", " ")}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400">
                        {organization.member_count ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openOfficerModal(organization)}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                      >
                        Manage Officers
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Add Organization
              </h3>

              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(initialForm);
                  setError("");
                }}
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

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Course Eligibility
                </label>
                <select
                  name="course_eligibility"
                  value={form.course_eligibility}
                  onChange={handleEligibilityChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="all">All Courses</option>
                  <option value="specific">Specific Courses</option>
                </select>
              </div>

              {form.course_eligibility === "specific" && (
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Eligible Programs
                  </label>
                  <select
                    multiple
                    value={form.eligible_courses}
                    onChange={handleCourseSelection}
                    required
                    className="h-48 w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {courses.map((course) => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Hold Ctrl (Windows) or Command (Mac) to select multiple
                    programs.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm(initialForm);
                    setError("");
                  }}
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

      {showOfficerModal && selectedOrganization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Manage Officers
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedOrganization.name}
                </p>
              </div>

              <button
                onClick={closeOfficerModal}
                className="text-xl text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {officerError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {officerError}
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-300">
                Search Student Accounts
              </label>

              <input
                type="text"
                value={studentSearch}
                onChange={handleStudentSearch}
                placeholder="Search by student name or email..."
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />

              {studentSearchLoading && (
                <p className="mt-2 text-xs text-gray-400">
                  Searching students...
                </p>
              )}

              {studentResults.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-700">
                  {studentResults.map((student) => {
                    const isAssigned =
                      officers.some(
                        (officer) => officer.student?.id === student.id,
                      ) || student.alreadyAssigned;

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between gap-3 border-b border-gray-800 p-3 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {student.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {student.email}
                            {student.course ? ` • ${student.course}` : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAssignOfficer(student.id)}
                          disabled={officerActionLoading || isAssigned}
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isAssigned ? "Assigned" : "Assign"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {!studentSearchLoading &&
                studentSearch.trim().length >= 2 &&
                studentResults.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    No matching students found.
                  </p>
                )}
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-white">
                Assigned Officers ({officers.length})
              </h4>

              {officerLoading ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  Loading officers...
                </p>
              ) : officers.length === 0 ? (
                <p className="rounded-lg border border-gray-800 p-5 text-center text-sm text-gray-400">
                  No officers assigned to this organization.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-800">
                  {officers.map((officer) => (
                    <div
                      key={officer.membership_id}
                      className="flex items-center justify-between gap-3 border-b border-gray-800 p-3 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {officer.student?.full_name || "Unknown Student"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {officer.student?.email}
                        </p>
                        {officer.student?.course && (
                          <p className="mt-1 text-xs text-gray-500">
                            {officer.student.course}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveOfficer(officer.student?.id)}
                        disabled={officerActionLoading || !officer.student?.id}
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeOfficerModal}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
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

export default Organizations;
