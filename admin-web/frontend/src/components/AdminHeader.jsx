
import { useLocation } from "react-router-dom";

const pageInfo = {
  "/admin/dashboard": {
    title: "Dashboard",
    description: "Overview of OrgApp activity this semester",
  },
  "/admin/accounts": {
    title: "Accounts",
    description: "Manage organization accounts",
  },
  "/admin/organizations": {
    title: "Organizations",
    description: "Manage registered organizations",
  },
  "/admin/vacancies": {
    title: "Vacancies",
    description: "Manage organization vacancies",
  },
  "/admin/announcements": {
    title: "Announcements",
    description: "Manage announcements",
  },
  "/admin/analytics": {
    title: "Analytics & Reports",
    description: "View application and organization statistics",
  },
};

function AdminHeader() {
  const location = useLocation();
  const currentPage = pageInfo[location.pathname] || pageInfo["/admin/dashboard"];

  return (
    <header className="flex min-h-[76px] items-center justify-between gap-4 bg-[#292C43] px-4 py-3 md:px-6">
      <div>
        <h2 className="text-xl font-bold text-white md:text-2xl">
          {currentPage.title}
        </h2>
        <p className="mt-1 text-xs text-[#AEB8D5] md:text-sm">
          {currentPage.description}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <input
          type="text"
          placeholder="Search organizations, vacancies..."
          className="hidden h-10 w-48 rounded-full border border-[#4A4E68] bg-[#383C55] px-4 text-xs text-white outline-none placeholder:text-[#AEB8D5] focus:border-[#D9B77D] md:block lg:w-64"
        />

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#383C55] text-base text-white hover:bg-[#41445B]"
        >
          ♧
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9B77D] text-xs font-bold text-[#292C43]">
          AD
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
