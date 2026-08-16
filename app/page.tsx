import CompetitionSection from "@/components/CompetitionSection";
import TrackedSources from "@/components/TrackedSources";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-800">
      {/* Навигационная панель */}
      <header className="border-b border-zinc-200/80 bg-white/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#0f7067] text-white font-medium text-xs">
                KZ
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                AI Opportunities
              </span>
              <span className="hidden sm:inline-block ml-1 rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-normal text-zinc-500">
                2026–2027
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-normal">
              <a
                href="#competitions"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Соревнования
              </a>
              <a
                href="#sources"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Источники
              </a>
              <span className="inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Live мониторинг</span>
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero-секция с мягкими, приглушенными тонами и спокойным шрифтом */}
      <section className="border-b border-[#0d3532] bg-[#103b39] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-block rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-[#0d4e48] mb-3">
              Проверяемый реестр хакатонов и соревнований
            </span>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-snug">
              Хакатоны с подтверждёнными условиями — в Казахстане и мире
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-emerald-50/80">
              По умолчанию показываем только хакатоны с подтверждённым типом и сроком подачи. Другие форматы доступны отдельно и не маскируются под хакатоны.
            </p>

            {/* Спокойные информационные блоки */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 text-xs">
              <div className="rounded border border-white/15 bg-white/8 p-3">
                <span className="block text-[11px] font-normal text-emerald-100/60">
                  Охват
                </span>
                <span className="mt-0.5 block font-medium text-white">
                  РК + Мир
                </span>
              </div>

              <div className="rounded border border-white/15 bg-white/8 p-3">
                <span className="block text-[11px] font-normal text-emerald-100/60">
                  Призовой фонд
                </span>
                <span className="mt-0.5 block font-medium text-white">
                  До $2,000,000
                </span>
              </div>

              <div className="rounded border border-white/15 bg-white/8 p-3">
                <span className="block text-[11px] font-normal text-emerald-100/60">
                  Ссылки
                </span>
                <span className="mt-0.5 block font-medium text-white">
                  Прямые страницы
                </span>
              </div>

              <div className="rounded border border-white/15 bg-white/8 p-3">
                <span className="block text-[11px] font-normal text-emerald-100/60">
                  Инструменты
                </span>
                <span className="mt-0.5 block font-medium text-white">
                  Сравнение условий
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Основной каталог */}
      <main id="competitions" className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <CompetitionSection />
        <div id="sources">
          <TrackedSources />
        </div>
      </main>

      {/* Приглушенный футер */}
      <footer className="border-t border-[#0d3532] bg-[#103b39] py-8 text-xs text-emerald-50/70 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 KZ AI Opportunities. Каталог соревнований для разработчиков.</p>
          <a
            href="#competitions"
            className="text-emerald-100 hover:text-white transition-colors"
          >
            Наверх ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
