import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Users,
  ClipboardList,
} from "lucide-react";
import supabase from "../lib/supabase";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const [organizations, setOrganizations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const fetchAnalytics = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError("");

      const [
        { data: organizationData, error: organizationError },
        { data: applicationData, error: applicationError },
        { data: membershipData, error: membershipError },
        { data: semesterData, error: semesterError },
      ] = await Promise.all([
        supabase.from("organizations").select("id, name, category, created_at"),

        supabase
          .from("applications")
          .select("id, organization_id, student_id, status, submitted_at"),

        supabase
          .from("organization_members")
          .select(
            "id, organization_id, semester_id, student_id, role, joined_at, left_at",
          ),

        supabase
          .from("semesters")
          .select("id, name, starts_on, ends_on")
          .order("starts_on", { ascending: false }),
      ]);

      if (organizationError) throw organizationError;
      if (applicationError) throw applicationError;
      if (membershipError) throw membershipError;
      if (semesterError) throw semesterError;

      setOrganizations(organizationData || []);
      setApplications(applicationData || []);
      setMemberships(membershipData || []);
      setSemesters(semesterData || []);
    } catch (err) {
      console.error("analytics fetch error:", err);
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnalytics(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchAnalytics]);

  const currentSemester = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");

    return semesters.find(
      (semester) => today >= semester.starts_on && today <= semester.ends_on,
    );
  }, [semesters]);

  const filteredApplications = useMemo(() => {
    if (selectedSemester === "all") return applications;

    const semester = semesters.find(
      (item) => String(item.id) === selectedSemester,
    );

    if (!semester) return [];

    return applications.filter((application) => {
      if (!application.submitted_at) return false;

      const date = application.submitted_at.slice(0, 10);

      return date >= semester.starts_on && date <= semester.ends_on;
    });
  }, [applications, semesters, selectedSemester]);

  const filteredMemberships = useMemo(() => {
    if (selectedSemester === "all") return memberships;

    return memberships.filter(
      (membership) => String(membership.semester_id) === selectedSemester,
    );
  }, [memberships, selectedSemester]);

  const activeMemberships = useMemo(() => {
    return filteredMemberships.filter(
      (membership) => membership.left_at === null,
    );
  }, [filteredMemberships]);

  const organizationCategoryData = useMemo(() => {
    const counts = {};

    organizations.forEach((organization) => {
      const category = organization.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [organizations]);

  const applicationStatusData = useMemo(() => {
    const counts = {};

    filteredApplications.forEach((application) => {
      const status = application.status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredApplications]);

  const organizationMembershipData = useMemo(() => {
    return organizations
      .map((organization) => {
        const count = activeMemberships.filter(
          (membership) =>
            String(membership.organization_id) === String(organization.id),
        ).length;

        return {
          organization: organization.name,
          category: organization.category || "Uncategorized",
          member_count: count,
        };
      })
      .sort((a, b) => b.member_count - a.member_count);
  }, [organizations, activeMemberships]);

  const semesterComparison = useMemo(() => {
    return [...semesters].reverse().map((semester) => {
      const applicationCount = applications.filter((application) => {
        if (!application.submitted_at) return false;

        const date = application.submitted_at.slice(0, 10);

        return date >= semester.starts_on && date <= semester.ends_on;
      }).length;

      const memberCount = memberships.filter(
        (membership) =>
          String(membership.semester_id) === String(semester.id) &&
          membership.left_at === null,
      ).length;

      return {
        semester: semester.name,
        applications: applicationCount,
        members: memberCount,
      };
    });
  }, [semesters, applications, memberships]);

  const statistics = [
    {
      label: "Total organizations",
      value: organizations.length,
      icon: Building2,
    },
    {
      label: "Applications",
      value: filteredApplications.length,
      icon: FileText,
    },
    {
      label: "Current members",
      value: activeMemberships.length,
      icon: Users,
    },
    {
      label: "Organization categories",
      value: organizationCategoryData.length,
      icon: ClipboardList,
    },
  ];

  const escapeCsv = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const downloadCsv = (filename, headers, rows) => {
    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const exportOrganizations = () => {
    downloadCsv(
      "organizations-report.csv",
      ["Organization ID", "Organization", "Category", "Created At"],
      organizations.map((organization) => [
        organization.id,
        organization.name,
        organization.category,
        organization.created_at,
      ]),
    );
  };

  const exportApplications = () => {
    downloadCsv(
      "applications-report.csv",
      [
        "Application ID",
        "Organization ID",
        "Student ID",
        "Status",
        "Submitted At",
      ],
      filteredApplications.map((application) => [
        application.id,
        application.organization_id,
        application.student_id,
        application.status,
        application.submitted_at,
      ]),
    );
  };

  const exportMemberships = () => {
    downloadCsv(
      "membership-report.csv",
      [
        "Membership ID",
        "Organization",
        "Semester",
        "Student ID",
        "Role",
        "Joined At",
        "Left At",
        "Status",
      ],
      filteredMemberships.map((membership) => {
        const organization = organizations.find(
          (item) => item.id === membership.organization_id,
        );

        const semester = semesters.find(
          (item) => item.id === membership.semester_id,
        );

        return [
          membership.id,
          organization?.name || "Unknown",
          semester?.name || "Unknown",
          membership.student_id,
          membership.role,
          membership.joined_at,
          membership.left_at,
          membership.left_at ? "Inactive" : "Active",
        ];
      }),
    );
  };

  const exportSemesterComparison = () => {
    downloadCsv(
      "semester-comparison-report.csv",
      ["Semester", "Applications", "Active Members"],
      semesterComparison.map((item) => [
        item.semester,
        item.applications,
        item.members,
      ]),
    );
  };

  const exportAllReports = () => {
    setExporting(true);

    try {
      exportOrganizations();
      exportApplications();
      exportMemberships();
      exportSemesterComparison();
    } finally {
      setExporting(false);
    }
  };

  const maximumSemesterValue = Math.max(
    ...semesterComparison.map((item) => item.applications),
    1,
  );

  const maximumOrganizationMembers = Math.max(
    ...organizationMembershipData.map((item) => item.member_count),
    1,
  );

  return (
    <div className="space-y-6 pb-8 text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Analytics & Reports</h2>
          <p className="mt-1 text-sm text-gray-400">
            Monitor organization activity, applications, and memberships.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={exportAllReports}
            disabled={loading || exporting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Download size={16} />
            Export all reports
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">Report period</p>
          <p className="text-xs text-gray-500">
            {selectedSemester === "all"
              ? "Showing all available semesters"
              : semesters.find((item) => String(item.id) === selectedSemester)
                  ?.name}
          </p>
        </div>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="all">All Semesters</option>
          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{stat.label}</p>
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold">
                {loading ? "—" : stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Applications by status</h3>
              <p className="mt-1 text-xs text-gray-500">
                Application distribution for the selected period
              </p>
            </div>
            <BarChart3 className="text-indigo-400" size={20} />
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading report...
            </p>
          ) : applicationStatusData.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No application records found.
            </p>
          ) : (
            <div className="space-y-5">
              {applicationStatusData.map((item) => (
                <div key={item.status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="capitalize text-gray-300">
                      {item.status.replaceAll("_", " ")}
                    </span>
                    <span className="font-semibold">{item.count}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${
                          (item.count /
                            Math.max(filteredApplications.length, 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-5">
            <h3 className="font-semibold">Organizations by category</h3>
            <p className="mt-1 text-xs text-gray-500">
              Distribution of registered organizations
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading report...
            </p>
          ) : organizationCategoryData.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No organization records found.
            </p>
          ) : (
            <div className="space-y-5">
              {organizationCategoryData.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${
                          (item.count / Math.max(organizations.length, 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-5">
          <h3 className="font-semibold">Semester comparison</h3>
          <p className="mt-1 text-xs text-gray-500">
            Application submissions across academic semesters
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading semester data...
          </p>
        ) : semesterComparison.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No semester records found.
          </p>
        ) : (
          <div className="space-y-5">
            {semesterComparison.map((item) => (
              <div key={item.semester}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="text-gray-300">{item.semester}</span>
                  <span className="text-gray-400">
                    {item.applications} applications
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${
                        (item.applications / maximumSemesterValue) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-5">
          <h3 className="font-semibold">Organization membership report</h3>
          <p className="mt-1 text-xs text-gray-500">
            Active memberships for the selected semester
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading membership data...
          </p>
        ) : organizationMembershipData.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No organization records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="py-3 pr-4 font-medium">Organization</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 pr-4 font-medium">Members</th>
                  <th className="py-3 font-medium">Distribution</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {organizationMembershipData.map((item) => (
                  <tr key={item.organization}>
                    <td className="py-4 pr-4 font-medium text-white">
                      {item.organization}
                    </td>
                    <td className="py-4 pr-4 text-gray-400">{item.category}</td>
                    <td className="py-4 pr-4 font-semibold">
                      {item.member_count}
                    </td>
                    <td className="py-4">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${
                              (item.member_count / maximumOrganizationMembers) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-5">
          <h3 className="font-semibold">Export center</h3>
          <p className="mt-1 text-xs text-gray-500">
            Download reports as CSV files for spreadsheet applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Organizations",
              description: "Organization details and categories",
              action: exportOrganizations,
            },
            {
              title: "Applications",
              description: "Application records and statuses",
              action: exportApplications,
            },
            {
              title: "Memberships",
              description: "Organization membership records",
              action: exportMemberships,
            },
            {
              title: "Semester comparison",
              description: "Application and membership summaries",
              action: exportSemesterComparison,
            },
          ].map((report) => (
            <button
              key={report.title}
              onClick={report.action}
              disabled={loading}
              className="flex items-start gap-3 rounded-lg border border-gray-800 p-4 text-left hover:border-indigo-500 hover:bg-gray-800/50 disabled:opacity-50"
            >
              <FileSpreadsheet
                size={22}
                className="shrink-0 text-emerald-400"
              />
              <span>
                <span className="block text-sm font-semibold text-white">
                  {report.title}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {report.description}
                </span>
                <span className="mt-3 flex items-center gap-1 text-xs text-indigo-400">
                  <Download size={13} />
                  Download CSV
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">
        Current semester: {currentSemester?.name || "No active semester"}. Data
        retrieved from your Supabase database.
      </p>
    </div>
  );
}

export default Analytics;
