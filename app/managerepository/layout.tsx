import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Bal sáv (Fixen ott van) */}
      <Sidebar />
      
      {/* Jobb oldali tartalom - eltoljuk 64 (16rem) egységgel a sidebar miatt */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}