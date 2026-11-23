
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#292C43]">

      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        <AdminHeader />

        <main className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
