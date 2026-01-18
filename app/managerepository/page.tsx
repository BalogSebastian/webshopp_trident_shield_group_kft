import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });

  return (
    <div>
      <header className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Beérkező Rendelések</h2>
        <p className="text-gray-500 text-sm mt-2">Itt látod a webshopban leadott összes rendelést.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-[10px] uppercase font-black tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="py-5 pl-8">Tranzakció ID</th>
              <th className="py-5">Vevő Neve</th>
              <th className="py-5">Termék</th>
              <th className="py-5 text-center">Mennyiség</th>
              <th className="py-5 text-right pr-8">Végösszeg</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-5 pl-8 font-mono text-blue-600 text-xs group-hover:underline cursor-pointer">
                  {order.transactionId}
                </td>
                <td className="py-5">{order.customerName}</td>
                <td className="py-5 text-gray-500">{order.productName}</td>
                <td className="text-center py-5">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{order.quantity} db</span>
                </td>
                <td className="text-right pr-8 font-mono">{order.totalPrice.toLocaleString()} Ft</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-xs uppercase tracking-widest">Nincs aktív rendelés</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}