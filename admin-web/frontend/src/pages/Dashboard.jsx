
const statistics = [
  {
    label: "Active organizations",
    value: "128",
    change: "↑ 16 from last semester",
    icon: "♧",
  },
  {
    label: "Open vacancies",
    value: "214",
    change: "↑ 21 from last semester",
    icon: "▣",
  },
  {
    label: "Applications this semester",
    value: "1,846",
    change: "↑ 253 from last semester",
    icon: "▤",
  },
  {
    label: "Total organization accounts",
    value: "149",
    change: "Organization accounts created",
    icon: "♙",
  },
];

const semesters = [
  { label: "1S 23-24", value: 704 },
  { label: "2S 23-24", value: 1015 },
  { label: "1S 24-25", value: 1128 },
  { label: "2S 24-25", value: 1402 },
  { label: "1S 25-26", value: 1593 },
  { label: "2S 25-26", value: 1846 },
];

const organizations = [
  { name: "Academic", count: 58, percentage: 39 },
  { name: "Community service", count: 32, percentage: 21 },
  { name: "Arts and culture", count: 24, percentage: 16 },
  { name: "Recreation", count: 20, percentage: 13 },
  { name: "Others", count: 15, percentage: 10 },
];

const activities = [
  {
    status: "Removed",
    color: "bg-[#713D4A] text-[#FF9A9A]",
    action: "Vacancy: Unpaid Marketing Intern",
    organization: "Junior Entrepreneurs' Circle",
    details: "Misleading compensation",
    time: "2 hours ago",
  },
  {
    status: "Approved",
    color: "bg-[#245A4A] text-[#63E6A8]",
    action: "Account verification",
    organization: "Red Cross Youth Council",
    details: "Documents complete",
    time: "5 hours ago",
  },
  {
    status: "Deactivated",
    color: "bg-[#6B5830] text-[#F5D17B]",
    action: "Account deactivated",
    organization: "Photography Circle",
    details: "Repeated policy violation",
    time: "Yesterday",
  },
];

function Dashboard() {
  return (
    <div className="space-y-4 pb-6 text-white">

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-[#383C55] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#C5CDE2]">{stat.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#484D68] text-sm text-[#D9B77D]">
                {stat.icon}
              </div>
            </div>

            <h3 className="mt-2 text-3xl font-bold tracking-wide text-white">
              {stat.value}
            </h3>

            <p className="mt-2 text-xs text-[#68DCA8]">{stat.change}</p>
          </div>
        ))}
      </section>

      {/* Chart and Organization Overview */}
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">

        {/* Applications Chart */}
        <div className="rounded-xl bg-[#383C55] p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold">
                Applications per semester
              </h3>
              <p className="mt-1 text-xs text-[#AEB8D5]">
                Submitted throughout the academic year
              </p>
            </div>

            <div className="flex gap-3 text-[11px] text-[#C5CDE2]">
              <span>● Current semester</span>
              <span>● Previous semesters</span>
            </div>
          </div>

          <div className="mt-5 flex h-[190px] items-end justify-around gap-3 px-2">
            {semesters.map((semester, index) => (
              <div
                key={semester.label}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <span className="mb-2 text-xs text-[#DCE2F4]">
                  {semester.value.toLocaleString()}
                </span>

                <div
                  className={`w-full max-w-[42px] rounded-t-lg ${
                    index === semesters.length - 1
                      ? "bg-[#D9B77D]"
                      : "bg-[#69718F]"
                  }`}
                  style={{ height: `${(semester.value / 1846) * 125}px` }}
                />

                <span className="mt-2 whitespace-nowrap text-[10px] text-[#AEB8D5]">
                  {semester.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Overview */}
        <div className="rounded-xl bg-[#383C55] p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">Organization overview</h3>
            <span className="rounded-full bg-[#705B2D] px-3 py-1.5 text-[11px] font-semibold text-[#F5D17B]">
              149 accounts
            </span>
          </div>

          <div className="space-y-4">
            {organizations.map((organization) => (
              <div key={organization.name}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[#DCE2F4]">
                    {organization.name}
                  </span>
                  <span className="font-semibold text-white">
                    {organization.count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#292C43]">
                  <div
                    className="h-full rounded-full bg-[#D9B77D]"
                    style={{ width: `${organization.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Admin Activity */}
      <section className="rounded-xl bg-[#383C55] p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold">Recent admin activity</h3>
          <button className="text-xs font-medium text-[#C5D4FF] hover:text-white">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-[#50546C] text-xs text-[#AEB8D5]">
                <th className="py-3 font-medium">Status / Action</th>
                <th className="py-3 font-medium">Organization</th>
                <th className="py-3 font-medium">Details</th>
                <th className="py-3 text-right font-medium">Time</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.action}
                  className="border-b border-[#50546C] last:border-0"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${activity.color}`}
                      >
                        {activity.status}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {activity.action}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-xs text-[#C5CDE2]">
                    {activity.organization}
                  </td>

                  <td className="py-4 text-xs text-[#C5CDE2]">
                    {activity.details}
                  </td>

                  <td className="py-4 text-right text-[11px] text-[#AEB8D5]">
                    {activity.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
