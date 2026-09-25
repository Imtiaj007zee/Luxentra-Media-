import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import SiteNav from "@/react-app/components/SiteNav";
import SiteFooter from "@/react-app/components/SiteFooter";
import {
  useFilms,
  usePhotos,
  useShowcasePhotos,
  useT,
  type Film,
  type Photo,
} from "@/react-app/lib/siteContent";

const KNOWN_FILTERS = ["twilight", "aerial", "exterior", "interior", "staging"] as const;

function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: Film;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [item.slug]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="eyebrow text-[#c7ff00] mb-1">{item.category}</p>
          <h3 className="text-white text-[20px] font-bold tracking-tight">{item.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[14px] tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video */}
      <div
        className="flex-1 flex items-center justify-center px-4 md:px-20 pb-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous video"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 mr-6"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <video
          ref={videoRef}
          key={item.slug}
          src={item.src}
          poster={item.poster}
          controls
          playsInline
          preload="auto"
          className={`max-h-full max-w-full rounded-md bg-[#1a1a1a] ${
            item.ratio === "portrait" ? "aspect-[9/16] h-full" : "aspect-video w-full"
          }`}
        />
        <button
          onClick={onNext}
          aria-label="Next video"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 ml-6"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile prev/next */}
      <div
        className="flex md:hidden items-center justify-center gap-4 pb-8 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function PhotoLightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: Photo;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="eyebrow text-[#c7ff00] mb-1">{item.label}</p>
          <h3 className="text-white text-[20px] font-bold tracking-tight">{item.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[14px] tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Photo */}
      <div
        className="flex-1 flex items-center justify-center px-4 md:px-20 pb-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 mr-6"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <img
          key={item.slug}
          src={item.src}
          alt={item.title}
          className="max-h-full max-w-full rounded-md object-contain"
        />
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="hidden md:flex w-12 h-12 rounded-full bg-white/10 items-center justify-center text-white hover:bg-[#c7ff00] hover:text-black transition-colors shrink-0 ml-6"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile prev/next */}
      <div
        className="flex md:hidden items-center justify-center gap-4 pb-8 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function WorkPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"films" | "photos">(() =>
    searchParams.get("tab") === "photos" ? "photos" : "films"
  );
  const [active, setActive] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const t = useT();
  const films = useFilms();
  const photos = usePhotos();
  const showcase = useShowcasePhotos();

  const FILTERS = useMemo(
    () => [
      { id: "all", label: t("work.filter_all") },
      { id: "twilight", label: t("work.filter_twilight") },
      { id: "aerial", label: t("work.filter_aerial") },
      { id: "exterior", label: t("work.filter_exterior") },
      { id: "interior", label: t("work.filter_interior") },
      { id: "staging", label: t("work.filter_staging") },
    ],
    [t]
  );

  const [photoFilter, setPhotoFilter] = useState<string>(() => {
    const f = searchParams.get("filter");
    return searchParams.get("tab") === "photos" &&
      f &&
      (f === "all" || (KNOWN_FILTERS as readonly string[]).includes(f))
      ? f
      : "all";
  });

  // Deep links like /work?tab=photos&filter=twilight (from the homepage)
  useEffect(() => {
    const tb = searchParams.get("tab");
    const f = searchParams.get("filter");
    if (tb === "photos" || tb === "films") setTab(tb);
    if (tb === "photos") {
      setPhotoFilter(
        f && (f === "all" || (KNOWN_FILTERS as readonly string[]).includes(f)) ? f : "all"
      );
      setActivePhoto(null);
      document.getElementById("films")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  const filmGroups = useMemo(
    () =>
      t("work.film_groups")
        .split("\n")
        .map((g) => g.trim())
        .filter(Boolean),
    [t]
  );

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + films.length) % films.length)),
    [films.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % films.length)),
    [films.length]
  );

  const filteredPhotos = useMemo(
    () => (photoFilter === "all" ? photos : photos.filter((p) => p.filter === photoFilter)),
    [photoFilter, photos]
  );

  const openShowcasePhoto = useCallback(
    (item: Photo) => {
      setPhotoFilter("all");
      const idx = photos.findIndex((p) => p.slug === item.slug);
      setActivePhoto(idx >= 0 ? idx : null);
    },
    [photos]
  );

  const closePhoto = useCallback(() => setActivePhoto(null), []);
  const prevPhoto = useCallback(
    () =>
      setActivePhoto((i) =>
        i === null ? i : (i - 1 + filteredPhotos.length) % filteredPhotos.length
      ),
    [filteredPhotos.length]
  );
  const nextPhoto = useCallback(
    () => setActivePhoto((i) => (i === null ? i : (i + 1) % filteredPhotos.length)),
    [filteredPhotos.length]
  );

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <SiteNav />

      {/* Hero */}
      <section className="bg-[#0b0b0b] text-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-28 pb-16 md:pb-20">
          <p className="eyebrow text-white/50 mb-6">{t("work.hero_eyebrow")}</p>
          <h1 className="text-[52px] md:text-[88px] font-bold tracking-[-0.03em] leading-[1.02] mb-6">
            {t("work.h1a")}
            <br />
            {t("work.h1b")}
          </h1>
          <p className="text-[18px] md:text-[21px] leading-snug text-white/70 max-w-2xl">
            {t("work.intro")}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section id="films" className="bg-white py-16 md:py-24 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Tabs */}
          <div className="flex items-center gap-3 mb-8">
            {(["films", "photos"] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`px-6 py-2.5 rounded-full text-[15px] font-semibold transition-colors ${
                  tab === tb
                    ? "bg-black text-white"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {tb === "films"
                  ? `${t("work.tab_films")} (${films.length})`
                  : `${t("work.tab_photos")} (${photos.length})`}
              </button>
            ))}
          </div>

          {tab === "films" ? (
            <>
              {filmGroups.map((group) => {
                const items = films
                  .map((item, i) => ({ ...item, index: i }))
                  .filter((x) => x.category === group);
                if (items.length === 0) return null;
                return (
                  <div
                    key={group}
                    id={`films-${group.toLowerCase().replace(/\s+/g, "-")}`}
                    className="mb-14 last:mb-0 scroll-mt-24"
                  >
                    <div className="flex items-baseline justify-between mb-6">
                      <h3 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em]">
                        {group}
                      </h3>
                      <span className="text-black/40 text-[14px] tabular-nums">
                        {items.length} {items.length === 1 ? "film" : "films"}
                      </span>
                    </div>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
                      {items.map((item) => (
                        <button
                          key={item.slug}
                          onClick={() => setActive(item.index)}
                          className="group relative block w-full break-inside-avoid rounded-md overflow-hidden bg-[#111] text-left"
                          aria-label={`Play ${item.title}`}
                        >
                          <img
                            src={item.poster}
                            alt={item.title}
                            loading="lazy"
                            className={`w-full object-cover ${
                              item.ratio === "portrait" ? "aspect-[3/4]" : "aspect-video"
                            }`}
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white group-hover:bg-[#c7ff00] group-hover:text-black group-hover:scale-110 transition-all">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            </span>
                          </span>
                          <span className="absolute bottom-0 left-0 right-0 p-5">
                            <span className="text-white text-[19px] font-bold tracking-tight block">
                              {item.title}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {/* Photo filters */}
              <div className="flex flex-wrap items-center gap-2.5 mb-8">
                {FILTERS.map((f) => {
                  const count =
                    f.id === "all" ? photos.length : photos.filter((p) => p.filter === f.id).length;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setPhotoFilter(f.id);
                        setActivePhoto(null);
                      }}
                      className={`px-5 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                        photoFilter === f.id
                          ? "bg-[#c7ff00] text-black border-[#c7ff00]"
                          : "bg-transparent text-black/60 border-black/15 hover:border-black/40"
                      }`}
                    >
                      {f.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* New additions showcase */}
              {photoFilter === "all" && showcase.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <p className="eyebrow text-black/40 mb-2">{t("work.showcase_eyebrow")}</p>
                      <h3 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em]">
                        {t("work.showcase_h2")}
                      </h3>
                    </div>
                    <span className="text-black/40 text-[14px] tabular-nums">
                      {t("work.showcase_count", { n: showcase.length, m: photos.length })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {showcase.map((item, i) => (
                      <button
                        key={item.slug}
                        onClick={() => openShowcasePhoto(item)}
                        className={`group relative block w-full overflow-hidden rounded-xl bg-[#111] text-left ${
                          i === 0 ? "col-span-2 row-span-2 min-h-[280px] md:min-h-[420px]" : ""
                        }`}
                        aria-label={`View ${item.title}`}
                      >
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          className={
                            i === 0
                              ? "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              : "w-full aspect-[4/3] object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          }
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90" />
                        <span className="absolute bottom-0 left-0 right-0 p-5">
                          <span className="eyebrow text-[#c7ff00] block mb-1">{item.label}</span>
                          <span className="text-white text-[17px] font-bold tracking-tight block">
                            {item.title}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
                {filteredPhotos.map((item, i) => (
                  <button
                    key={item.slug}
                    onClick={() => setActivePhoto(i)}
                    className="group relative block w-full break-inside-avoid rounded-md overflow-hidden bg-[#111] text-left"
                    aria-label={`View ${item.title}`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                    <span className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="eyebrow text-[#c7ff00] block mb-1">{item.label}</span>
                      <span className="text-white text-[17px] font-bold tracking-tight block">
                        {item.title}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b0b0b] text-white py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <img
            src="/brand/symbol-lime.png"
            alt=""
            aria-hidden
            className="h-14 w-14 object-contain mx-auto mb-10"
          />
          <h2 className="text-[44px] md:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-10">
            {t("work.cta_h2")}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/order" className="btn-lime">
              {t("work.cta_book")}
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 text-white font-medium text-[17px] hover:text-[#c7ff00] transition-colors"
            >
              {t("work.cta_team")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      {active !== null && films[active] && (
        <Lightbox
          item={films[active]}
          index={active}
          total={films.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}

      {activePhoto !== null && filteredPhotos[activePhoto] && (
        <PhotoLightbox
          item={filteredPhotos[activePhoto]}
          index={activePhoto}
          total={filteredPhotos.length}
          onClose={closePhoto}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}
