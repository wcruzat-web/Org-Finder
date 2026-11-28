import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  CalendarDays,
  BarChart3,
  LogOut,
} from "lucide-react";
import appIcon from "../assets/app-icon.jpg";
import supabase from "../lib/supabase";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "DATA MANAGEMENT",
    items: [
      { label: "Organizations", path: "/admin/organizations", icon: Building2 },
      { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
      { label: "Semesters", path: "/admin/semesters", icon: CalendarDays },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        label: "Analytics & Reports",
        path: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Admin");

  useEffect(() => {
    const fetchAdminName = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("accounts")
        .select("full_name")
        .eq("auth_user_id", user.id)
        .single();

      if (!error && data?.full_name) {
        setFullName(data.full_name);
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-[165px] shrink-0 flex-col border-r border-[#41445B] bg-[#292C43] px-2.5 py-4 text-white lg:w-[185px]">
      <div className="mb-7 flex items-center gap-2.5 px-1">
        <img
          src={appIcon}
          alt="OrgApp icon"
          className="h-9 w-9 shrink-0 rounded-xl object-contain"
        />

        <div>
          <h1 className="text-sm font-bold">OrgApp</h1>
          <p className="text-[10px] text-slate-400">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2.5 px-2 text-[10px] font-semibold tracking-wider text-[#9BA4C3]">
              {section.title}
            </p>

            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex min-h-9 items-center gap-2 rounded-xl px-2.5 py-2 text-[12px] transition ${
                        isActive
                          ? "bg-[#D9B77D] font-semibold text-[#292C43]"
                          : "text-slate-200 hover:bg-[#383C55]"
                      }`
                    }
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span className="min-w-0 flex-1 whitespace-nowrap">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-5 border-t border-[#41445B] pt-4">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D9B77D] text-xs font-bold text-[#292C43]">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{fullName}</p>
            <p className="text-[9px] text-slate-400">Administrator</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-slate-200 transition hover:bg-[#383C55] hover:text-white"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
