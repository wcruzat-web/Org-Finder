import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

const sections = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "▦" },
    ],
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { label: "Accounts", path: "/admin/accounts", icon: "♙" },
    ],
  },
  {
    title: "DATA MANAGEMENT",
    items: [
      { label: "Organizations", path: "/admin/organizations", icon: "♧" },
      { label: "Vacancies", path: "/admin/vacancies", icon: "▤" },
      { label: "Announcements", path: "/admin/announcements", icon: "◈" },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Analytics & Reports", path: "/admin/analytics", icon: "▥" },
    ],
  },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Admin");

  //* fetch admin fullname from accounts
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

      if (!error && data) {
        setFullName(data.full_name);
      }
    };

    fetchAdminName();
  }, []);

  //* logout admin
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D9B77D] text-lg text-[#292C43]">
          ◉
        </div>
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
              {section.items.map((item) => (
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
                  <span className="w-4 text-center text-sm">{item.icon}</span>
                  <span className="min-w-0 flex-1 whitespace-nowrap">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

     {/* admin account and logout */}
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
          <span className="w-4 text-center text-sm">↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
