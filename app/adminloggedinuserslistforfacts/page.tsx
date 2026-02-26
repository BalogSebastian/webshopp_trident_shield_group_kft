"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  verifyToken?: string;
  verifyTokenExpiry?: string;
  __v?: number;
}

export default function AdminLoggedInUsersListForFacts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        // A login ellenőrzés ideiglenesen kikapcsolva
        /*
        if (res.status === 401) {
          router.push("/login"); // Vagy az admin login oldalra, ha van külön
          return;
        }
        */
        if (!res.ok) {
          throw new Error("Hiba a felhasználók betöltésekor");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const deleteUser = async (userId: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem visszavonható!")) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Hiba a felhasználó törlésekor");
      }

      setUsers(users.filter((user) => user._id !== userId));
      alert("Felhasználó sikeresen törölve");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Regisztrált Felhasználók</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Vissza
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Név</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Email</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Státusz</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Regisztráció ideje</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Azonosító (_id)</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Egyéb adatok</th>
                  <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider text-right">Műveletek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-gray-300">{user.email}</td>
                    <td className="p-4">
                      {user.isVerified ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/20">
                          Ellenőrizve
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/20">
                          Nincs ellenőrizve
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(user.createdAt).toLocaleString("hu-HU")}
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-xs">{user._id}</td>
                    <td className="p-4 text-gray-400 text-xs">
                      {user.verifyToken && (
                        <div className="mb-1">
                          <span className="font-mono bg-gray-900 px-1 rounded">Token: {user.verifyToken}</span>
                        </div>
                      )}
                      {user.verifyTokenExpiry && (
                        <div>
                          <span className="font-mono bg-gray-900 px-1 rounded">
                            Lejárat: {new Date(user.verifyTokenExpiry).toLocaleString("hu-HU")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md text-xs font-medium transition-colors"
                      >
                        Törlés
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Nincs megjeleníthető felhasználó.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-4 text-gray-500 text-sm text-right">
          Összesen: {users.length} felhasználó
        </div>
      </div>
    </div>
  );
}
