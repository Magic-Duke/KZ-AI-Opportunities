import CompetitionSection from "@/components/CompetitionSection";
import TrackedSources from "@/components/TrackedSources";

export default function Home() {
  return (
    <div className="min-h-full bg-slate-50/50">
      {/* Шапка проекта с мягким фоном и акцентом */}
      <header className="border-b border-slate-200/80 bg-white shadow-xs">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Казахстан 🇰🇿 & Мировые платформы 🌎 • Сезон 2026–2027
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            KZ AI Opportunities
          </h1>

          <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            Единый агрегатор соревнований по искусственному интеллекту, хакатонов, олимпиад
            и стартап-битв. Прямые ссылки на регистрацию в казахстанских вузах и технопарках
            (Astana Hub, КУ им. Ш. Уалиханова, CPFED, РНПЦ «Дарын») и мировых платформах (Kaggle, Codeforces, Devpost, LeetCode).
          </p>

          {/* Быстрые факты / Статистика */}
          <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-800">🇰🇿 + 🌎 Категории:</span> Казахстан и Мировые контесты
            </div>
            <div>
              <span className="font-bold text-slate-800">🔗 Прямые ссылки:</span> На страницы условий и регистрации
            </div>
            <div>
              <span className="font-bold text-slate-800">🏙️ Города РК:</span> Астана, Алматы, Кокшетау и онлайн
            </div>
            <div>
              <span className="font-bold text-slate-800">🪜 Порог входа:</span> От простой регистрации до ML-стартапов
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <CompetitionSection />
        <TrackedSources />
      </main>

      {/* Футер */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4">
          <p>© 2026 KZ AI Opportunities. Агрегатор возможностей для разработчиков Казахстана.</p>
          <p className="mt-1 text-slate-400">
            Источники: Astana Hub, Kaggle, Codeforces, Devpost, РНПЦ «Дарын», CPFED, КУ им. Ш. Уалиханова, LeetCode, AtCoder, КБТУ, SDU, МУИТ.
          </p>
        </div>
      </footer>
    </div>
  );
}
