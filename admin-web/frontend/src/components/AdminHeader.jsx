
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

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
  "/admin/announcements": {
    title: "Announcements",
    description: "Manage announcements",
  },
  "/admin/semesters": {
    title: "Semesters",
    description: "Manage academic semesters",
  },
  "/admin/analytics": {
    title: "Analytics & Reports",
    description: "View application and organization statistics",
  },
};

function AdminHeader() {
  const location = useLocation();
  const currentPage =
    pageInfo[location.pathname] || pageInfo["/admin/dashboard"];

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

      <button
        type="button"
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#383C55] text-white transition hover:bg-[#41445B]"
      >
        <Bell size={19} strokeWidth={1.8} />
      </button>
    </header>
  );
}

export default AdminHeader;
