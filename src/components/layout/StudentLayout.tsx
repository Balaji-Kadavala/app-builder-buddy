import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { StudentBottomNav } from "./StudentBottomNav";

export function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-4">
        <Outlet />
      </main>
      <StudentBottomNav />
    </div>
  );
}
