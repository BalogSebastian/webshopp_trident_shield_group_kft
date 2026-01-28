import Sidebar from "../components/admin/Sidebar";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

// Segédfüggvény a user lekérésére a Tokenből (Server Side)
async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) return null;

  try {
    return jwt.verify(token.value, process.env.JWT_SECRET!) as { name: string; email: string };
  } catch (error) {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Opcionális: Ha nincs user, visszadobjuk a loginra (védelem)
  if (!user) {
     redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 md:p-12">
        {/* ÜDVÖZLŐ SÁV - Itt írja ki a nevet */}
        <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bejelentkezve mint:</p>
               <h1 className="text-2xl font-black text-gray-900">Üdvözöllek, {user.name}! 👋</h1>
            </div>
            
            {/* Kijelentkezés gombot is tehetünk ide opcionálisan */}
        </div>

        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}