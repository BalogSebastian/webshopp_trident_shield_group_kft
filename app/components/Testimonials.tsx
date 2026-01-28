// app/components/Testimonials.tsx
import { reviews } from "@/lib/data"; // Adat importálása

export default function Testimonials() {
  // Most csak az első véleményt vesszük ki a tömbből
  const review = reviews[0]; 

  return (
    <section className="relative py-32 bg-gray-50 overflow-hidden text-center border-b border-gray-200">
      
      {/* HÁTTÉR SZÖVEG */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0">
         <h2 className="text-[15vw] font-black text-white uppercase tracking-tighter whitespace-nowrap text-center drop-shadow-sm">
           VÉLEMÉNYEK
         </h2>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        <div className="flex justify-center gap-1 mb-8 text-blue-600 text-2xl">
          ★★★★★
        </div>

        <h3 className="text-2xl md:text-4xl font-black uppercase leading-tight mb-8 text-gray-900">
          "{review.text}"
        </h3>

        <div className="flex flex-col items-center">
            <p className="text-sm font-black tracking-[0.2em] text-black uppercase mb-1">
              {review.name}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {review.role}
            </p>
        </div>
      </div>
    </section>
  );
}