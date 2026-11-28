import { useEffect, useState } from "react";
import { Building2, FileText, Users } from "lucide-react";
import supabase from "../lib/supabase";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState({
    activeOrganizations: 0,
    totalOrganizations: 0,
    applicationsThisSemester: 0,
  });
  const [semesters, setSemesters] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError("");

    try {
      const [
        { data: organizationData, error: organizationError },
        { data: monitoringData, error: monitoringError },
        { data: semesterData, error: semesterError },
        { data: applicationData, error: applicationError },
      ] = await Promise.all([
        supabase.from("organizations").select("id, category"),

        supabase
          .from("org_monitoring")
          .select("organization_id, last_posted_at"),

        supabase
          .from("semesters")
          .select("id, name, starts_on, ends_on")
          .order("starts_on", { ascending: true }),

        supabase.from("applications").select("submitted_at"),
      ]);

      if (organizationError) throw organizationError;
      if (monitoringError) throw monitoringError;
      if (semesterError) throw semesterError;
      if (applicationError) throw applicationError;

      const now = new Date();

      const monitoringMap = new Map(
        (monitoringData || []).map((record) => [
          record.organization_id,
          new Date(record.last_posted_at),
        ]),
      );

      const activeOrganizations = (organizationData || []).filter(
        (organization) => {
          const lastPosted = monitoringMap.get(organization.id);

          return (
            lastPosted &&
            now.getTime() - lastPosted.getTime() <= 30 * 24 * 60 * 60 * 1000 &&
            lastPosted <= now
          );
        },
      ).length;

      const currentSemester = (semesterData || []).find((semester) => {
        const today = now.toISOString().slice(0, 10);

        return today >= semester.starts_on && today <= semester.ends_on;
      });

      const applications = applicationData || [];

      const applicationsThisSemester = currentSemester
        ? applications.filter((application) => {
            const submittedDate = new Date(application.submitted_at)
              .toISOString()
              .slice(0, 10);

            return (
              submittedDate >= currentSemester.starts_on &&
              submittedDate <= currentSemester.ends_on
            );
          }).length
        : 0;

      const semesterStatistics = (semesterData || []).map((semester) => {
        const count = applications.filter((application) => {
          const submittedDate = new Date(application.submitted_at)
            .toISOString()
            .slice(0, 10);

          return (
            submittedDate >= semester.starts_on &&
            submittedDate <= semester.ends_on
          );
        }).length;

        return {
          label: semester.name,
          value: count,
          isCurrent: semester.id === currentSemester?.id,
        };
      });

      const categoryCounts = (organizationData || []).reduce(
        (counts, organization) => {
          const category = organization.category || "Uncategorized";

          counts[category] = (counts[category] || 0) + 1;

          return counts;
        },
        {},
      );

      const organizationOverview = Object.entries(categoryCounts)
        .map(([name, count]) => ({
          name,
          count,
          percentage:
            organizationData.length > 0
              ? (count / organizationData.length) * 100
              : 0,
        }))
        .sort((a, b) => b.count - a.count);

      setStatistics({
        activeOrganizations,
        totalOrganizations: organizationData.length,
        applicationsThisSemester,
      });

      setSemesters(semesterStatistics.slice(-6));
      setOrganizations(organizationOverview);
    } catch (err) {
      console.error("dashboard data error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const statisticCards = [
    {
      label: "Active organizations",
      value: statistics.activeOrganizations,
      change: "Posted within the last 30 days",
      icon: Building2,
    },
    {
      label: "Applications this semester",
      value: statistics.applicationsThisSemester,
      change: "Applications submitted this semester",
      icon: FileText,
    },
    {
      label: "Total organizations",
      value: statistics.totalOrganizations,
      change: "Registered organizations",
      icon: Users,
    },
  ];

  const maximumApplications = Math.max(
    ...semesters.map((semester) => semester.value),
    1,
  );

  return (
    <div className="space-y-4 pb-6 text-white">
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
          <button
            onClick={fetchDashboardData}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {statisticCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl bg-[#383C55] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#C5CDE2]">{stat.label}</p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#484D68] text-[#D9B77D]">
                  <Icon size={19} />
                </div>
              </div>

              <h3 className="mt-2 text-3xl font-bold tracking-wide text-white">
                {loading ? "—" : stat.value.toLocaleString()}
              </h3>

              <p className="mt-2 text-xs text-[#68DCA8]">{stat.change}</p>
            </div>
          );
        })}
      </section>

      {/* chart and organization overview */}
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
        {/* applications chart */}
        <div className="rounded-xl bg-[#383C55] p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">Applications per semester</h3>
              <p className="mt-1 text-xs text-[#AEB8D5]">
                Submitted throughout the academic year
              </p>
            </div>

            <div className="flex gap-3 text-[11px] text-[#C5CDE2]">
              <span>● Current semester</span>
              <span>● Previous semesters</span>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[190px] items-center justify-center text-sm text-[#AEB8D5]">
              Loading applications...
            </div>
          ) : semesters.length === 0 ? (
            <div className="flex h-[190px] items-center justify-center text-sm text-[#AEB8D5]">
              No semester data available.
            </div>
          ) : (
            <div className="mt-5 flex h-[190px] items-end justify-around gap-3 px-2">
              {semesters.map((semester) => (
                <div
                  key={semester.label}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs text-[#DCE2F4]">
                    {semester.value.toLocaleString()}
                  </span>

                  <div
                    className={`w-full max-w-[42px] rounded-t-lg ${
                      semester.isCurrent ? "bg-[#D9B77D]" : "bg-[#69718F]"
                    }`}
                    style={{
                      height: `${
                        (semester.value / maximumApplications) * 125
                      }px`,
                    }}
                  />

                  <span className="mt-2 whitespace-nowrap text-[10px] text-[#AEB8D5]">
                    {semester.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* organization overview */}
        <div className="rounded-xl bg-[#383C55] p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">Organization overview</h3>

            <span className="rounded-full bg-[#705B2D] px-3 py-1.5 text-[11px] font-semibold text-[#F5D17B]">
              {loading
                ? "Loading..."
                : `${statistics.totalOrganizations} organizations`}
            </span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-sm text-[#AEB8D5]">
              Loading organizations...
            </div>
          ) : organizations.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#AEB8D5]">
              No organizations available.
            </div>
          ) : (
            <div className="space-y-4">
              {organizations.map((organization) => (
                <div key={organization.name}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-[#DCE2F4]">{organization.name}</span>

                    <span className="font-semibold text-white">
                      {organization.count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#292C43]">
                    <div
                      className="h-full rounded-full bg-[#D9B77D]"
                      style={{
                        width: `${organization.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
