import { useEffect, useMemo, useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Type,
  Package,
  Users,
  Clapperboard,
  Image,
  SlidersHorizontal,
  Ticket,
} from "lucide-react";
import { useContent, saveContentApi, type ContentPayload } from "@/react-app/lib/siteContent";
import {
  DEFAULT_COPY,
  DEFAULT_TERMS,
  type TeamMember,
  type PackageContent,
  type FilmContent,
  type PhotoContent,
  type TermEntry,
  type DiscountEntry,
} from "@/react-app/lib/contentDefaults";

// Hidden control panel: every word, package, team member, film, photo,
// number, term, and discount code on the live site. Never linked publicly.

const TABS = [
  { id: "words", label: "Words", icon: Type },
  { id: "packages", label: "Packages", icon: Package },
  { id: "team", label: "Team", icon: Users },
  { id: "films", label: "Films", icon: Clapperboard },
  { id: "photos", label: "Photos", icon: Image },
  { id: "terms", label: "Numbers & terms", icon: SlidersHorizontal },
  { id: "discounts", label: "Discount codes", icon: Ticket },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white text-[14px] outline-none focus:border-[#c7ff00] [color-scheme:dark]";
const areaClass =
  "w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-[14px] outline-none focus:border-[#c7ff00] [color-scheme:dark]";
const labelClass = "block text-[12px] text-white/50 mb-1";
const cardClass = "rounded-md border border-white/10 bg-white/[0.03] p-4";
const numClass =
  "w-20 h-10 px-2 rounded-md bg-white/10 border border-white/20 text-white text-[14px] text-right outline-none focus:border-[#c7ff00] [color-scheme:dark]";

const PHOTO_FILTERS = ["twilight", "aerial", "exterior", "interior", "staging"];

type Draft = {
  copy: Record<string, string>;
  terms: TermEntry[];
  team: TeamMember[];
  packages: PackageContent[];
  films: FilmContent[];
  photos: PhotoContent[];
  discounts: DiscountEntry[];
};

function clonePayload(c: ReturnType<typeof useContent>): Draft {
  return {
    copy: { ...c.copy },
    terms: DEFAULT_TERMS.map((t) => ({
      key: t.key,
      label: t.label,
      value: t.key in c.terms ? c.terms[t.key] : t.value,
    })),
    team: c.team.map((t) => ({ ...t, highlights: [...t.highlights] })),
    packages: c.packages.map((p) => ({ ...p, features: [...p.features] })),
    films: c.films.map((f) => ({ ...f })),
    photos: c.photos.map((p) => ({ ...p })),
    discounts: c.discounts.map((d) => ({ ...d })),
  };
}

export default function ContentAdmin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const content = useContent();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState<TabId>("words");
  const [wordGroup, setWordGroup] = useState<string>("Homepage");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Sync the editor with the live content whenever it loads or changes.
  useEffect(() => {
    if (content.loaded && !draft) setDraft(clonePayload(content));
  }, [content, draft]);

  const groups = useMemo(() => {
    const seen: string[] = [];
    for (const c of DEFAULT_COPY) if (!seen.includes(c.group)) seen.push(c.group);
    return seen;
  }, []);

  if (!draft) {
    return (
      <section className="mt-12">
        <p className="text-[14px] text-white/40">Loading live content…</p>
      </section>
    );
  }

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveMsg(null);
    const payload: ContentPayload = {
      ...draft,
      terms: Object.fromEntries(draft.terms.map((t) => [t.key, t.value])),
    };
    const res = await saveContentApi(username, password, payload);
    setSaving(false);
    if (res.ok) {
      content.replaceRemoteContent({
        copy: draft.copy,
        terms: payload.terms,
        team: draft.team,
        packages: draft.packages,
        films: draft.films,
        photos: draft.photos,
        discounts: draft.discounts,
      });
      setSaveMsg({ ok: true, text: "Saved. The live site now uses these words." });
    } else {
      setSaveMsg({ ok: false, text: res.error || "Could not save." });
    }
  };

  const move = <T,>(arr: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= arr.length) return arr;
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next.map((it, i) =>
      it && typeof it === "object" && "order" in it ? { ...(it as object), order: i + 1 } : it
    ) as T[];
  };

  const VisibleToggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      title={on ? "Visible on the site" : "Hidden from the site"}
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-full border ${
        on
          ? "bg-[#c7ff00]/15 text-[#c7ff00] border-[#c7ff00]/30"
          : "bg-white/5 text-white/40 border-white/15"
      }`}
    >
      {on ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      {on ? "Visible" : "Hidden"}
    </button>
  );

  const Reorder = ({
    index,
    total,
    onMove,
  }: {
    index: number;
    total: number;
    onMove: (to: number) => void;
  }) => (
    <div className="flex gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
        className="p-1.5 rounded border border-white/15 text-white/50 hover:text-white disabled:opacity-25"
        title="Move up"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(index + 1)}
        className="p-1.5 rounded border border-white/15 text-white/50 hover:text-white disabled:opacity-25"
        title="Move down"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const SaveRow = () => (
    <div className="flex items-center gap-3 mt-6">
      <button
        onClick={save}
        disabled={saving}
        className="btn-lime h-11 px-6 disabled:opacity-40 inline-flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save this section"}
      </button>
      {saveMsg && (
        <p className={`flex items-center gap-2 text-[14px] ${saveMsg.ok ? "text-[#c7ff00]" : "text-red-400"}`}>
          {saveMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {saveMsg.text}
        </p>
      )}
    </div>
  );

  // ── Words ────────────────────────────────────────────────────────────
  const wordsForGroup = DEFAULT_COPY.filter((c) => c.group === wordGroup);

  // ── Discounts ────────────────────────────────────────────────────────
  const discountRows = [...draft.discounts].sort((a, b) => b.amount - a.amount);

  return (
    <section className="mt-14">
      <h2 className="text-[19px] font-bold tracking-tight mb-1">Site content</h2>
      <p className="text-[13px] text-white/40 mb-4">
        Every word, package, team member, film, photo, number, and discount code. Save
        a section and the live site updates.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-full border ${
                tab === t.id
                  ? "bg-[#c7ff00] text-black border-[#c7ff00]"
                  : "bg-white/5 text-white/60 border-white/15 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "words" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setWordGroup(g)}
                className={`text-[13px] px-3 py-1.5 rounded-full border ${
                  wordGroup === g
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/55 border-white/15 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] divide-y divide-white/10">
            {wordsForGroup.map((entry) => (
              <div key={entry.key} className="px-4 py-3">
                <p className="text-[13px] font-medium text-white/80 mb-1">{entry.label}</p>
                <textarea
                  value={draft.copy[entry.key] ?? entry.value}
                  rows={Math.min(4, Math.max(1, Math.ceil((draft.copy[entry.key] ?? entry.value).length / 70)))}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDraft((d) => (d ? { ...d, copy: { ...d.copy, [entry.key]: v } } : d));
                    setSaveMsg(null);
                  }}
                  className={areaClass}
                />
              </div>
            ))}
          </div>
          <p className="text-[12px] text-white/35 mt-3">
            {"{{tokens}} like {{price_standard}} or {{stat_properties}} are filled in automatically."}
          </p>
          <SaveRow />
        </div>
      )}

      {tab === "packages" && (
        <div className="space-y-4">
          {draft.packages.map((p, i) => (
            <div key={p.id} className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-white/40 font-medium uppercase tracking-wide">
                  {p.kind === "plan" ? "Branding plan" : "Package"} · #{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <VisibleToggle
                    on={p.visible}
                    onChange={() =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              packages: d.packages.map((x, xi) =>
                                xi === i ? { ...x, visible: !x.visible } : x
                              ),
                            }
                          : d
                      )
                    }
                  />
                  <Reorder
                    index={i}
                    total={draft.packages.length}
                    onMove={(to) =>
                      setDraft((d) => (d ? { ...d, packages: move(d.packages, i, to) } : d))
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    value={p.name}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              packages: d.packages.map((x, xi) =>
                                xi === i ? { ...x, name: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input
                    value={p.tagline}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              packages: d.packages.map((x, xi) =>
                                xi === i ? { ...x, tagline: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelClass}>Description</label>
                <textarea
                  value={p.blurb}
                  rows={2}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            packages: d.packages.map((x, xi) =>
                              xi === i ? { ...x, blurb: e.target.value } : x
                            ),
                          }
                        : d
                    )
                  }
                  className={areaClass}
                />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Features (one per line)</label>
                <textarea
                  value={p.features.join("\n")}
                  rows={Math.max(3, p.features.length)}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            packages: d.packages.map((x, xi) =>
                              xi === i
                                ? { ...x, features: e.target.value.split("\n") }
                                : x
                            ),
                          }
                        : d
                    )
                  }
                  className={areaClass}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className={labelClass}>Badge (empty = none)</label>
                  <input
                    value={p.badge}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              packages: d.packages.map((x, xi) =>
                                xi === i ? { ...x, badge: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Featured</label>
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              packages: d.packages.map((x, xi) =>
                                xi === i ? { ...x, featured: e.target.checked } : x
                              ),
                            }
                          : d
                      )
                    }
                    className="w-5 h-5 mt-2 accent-[#c7ff00]"
                  />
                </div>
              </div>
            </div>
          ))}
          <p className="text-[12px] text-white/35">
            Prices live under "Package prices" and "Branding plans" above, so the numbers stay in one place.
          </p>
          <SaveRow />
        </div>
      )}

      {tab === "team" && (
        <div className="space-y-4">
          {draft.team.map((m, i) => (
            <div key={m.id} className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-white/40 font-medium uppercase tracking-wide">
                  #{i + 1} · id: {m.id}
                </span>
                <div className="flex items-center gap-2">
                  <VisibleToggle
                    on={m.visible}
                    onChange={() =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, visible: !x.visible } : x
                              ),
                            }
                          : d
                      )
                    }
                  />
                  <Reorder
                    index={i}
                    total={draft.team.length}
                    onMove={(to) =>
                      setDraft((d) => (d ? { ...d, team: move(d.team, i, to) } : d))
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    value={m.name}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, name: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Short name</label>
                  <input
                    value={m.knownAs}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, knownAs: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    value={m.role}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, role: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Company line</label>
                  <input
                    value={m.title}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, title: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Photo path</label>
                  <input
                    value={m.photo}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, photo: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Badge (empty = none)</label>
                  <input
                    value={m.badge}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              team: d.team.map((x, xi) =>
                                xi === i ? { ...x, badge: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className={labelClass}>Bio (blank line between paragraphs)</label>
                <textarea
                  value={m.bio}
                  rows={Math.max(4, m.bio.split("\n").length)}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            team: d.team.map((x, xi) =>
                              xi === i ? { ...x, bio: e.target.value } : x
                            ),
                          }
                        : d
                    )
                  }
                  className={areaClass}
                />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Highlights (one per line)</label>
                <textarea
                  value={m.highlights.join("\n")}
                  rows={Math.max(3, m.highlights.length)}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            team: d.team.map((x, xi) =>
                              xi === i
                                ? { ...x, highlights: e.target.value.split("\n") }
                                : x
                            ),
                          }
                        : d
                    )
                  }
                  className={areaClass}
                />
              </div>
              <div className="mt-3">
                <label className={labelClass}>Quote</label>
                <textarea
                  value={m.quote}
                  rows={2}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            team: d.team.map((x, xi) =>
                              xi === i ? { ...x, quote: e.target.value } : x
                            ),
                          }
                        : d
                    )
                  }
                  className={areaClass}
                />
              </div>
            </div>
          ))}
          <SaveRow />
        </div>
      )}

      {tab === "films" && (
        <div className="space-y-4">
          {draft.films.map((f, i) => (
            <div key={f.id} className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-white/40 font-medium uppercase tracking-wide">
                  #{i + 1} · id: {f.id}
                </span>
                <div className="flex items-center gap-2">
                  <VisibleToggle
                    on={f.visible}
                    onChange={() =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, visible: !x.visible } : x
                              ),
                            }
                          : d
                      )
                    }
                  />
                  <Reorder
                    index={i}
                    total={draft.films.length}
                    onMove={(to) =>
                      setDraft((d) => (d ? { ...d, films: move(d.films, i, to) } : d))
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    value={f.title}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, title: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category (must match a /work filter exactly)</label>
                  <input
                    value={f.category}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, category: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Poster image path</label>
                  <input
                    value={f.poster}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, poster: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Video file path</label>
                  <input
                    value={f.video}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, video: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>External URL override (empty = use the video file above)</label>
                  <input
                    value={f.url_override}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i ? { ...x, url_override: e.target.value } : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <label className={labelClass}>Shape</label>
                  <select
                    value={f.ratio}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              films: d.films.map((x, xi) =>
                                xi === i
                                  ? {
                                      ...x,
                                      ratio: e.target.value === "portrait" ? "portrait" : "landscape",
                                    }
                                  : x
                              ),
                            }
                          : d
                      )
                    }
                    className={inputClass}
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (9:16)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <SaveRow />
        </div>
      )}

      {tab === "photos" && (
        <div>
          <p className="text-[12px] text-white/35 mb-4">
            Order sets the position inside each /work filter. Showcase rank (1–12) picks the
            "Fresh from the field" strip on the homepage; 0 = not in the showcase.
          </p>
          <div className="space-y-3">
            {draft.photos.map((p, i) => (
              <div key={p.slug} className={cardClass}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-white/40 font-medium uppercase tracking-wide">
                    #{i + 1} · slug: {p.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <VisibleToggle
                      on={p.visible}
                      onChange={() =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i ? { ...x, visible: !x.visible } : x
                                ),
                              }
                            : d
                        )
                      }
                    />
                    <Reorder
                      index={i}
                      total={draft.photos.length}
                      onMove={(to) =>
                        setDraft((d) => (d ? { ...d, photos: move(d.photos, i, to) } : d))
                      }
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      value={p.title}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i ? { ...x, title: e.target.value } : x
                                ),
                              }
                            : d
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Card label</label>
                    <input
                      value={p.label}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i ? { ...x, label: e.target.value } : x
                                ),
                              }
                            : d
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Filter (matches a /work chip)</label>
                    <select
                      value={p.filter}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i ? { ...x, filter: e.target.value } : x
                                ),
                              }
                            : d
                        )
                      }
                      className={inputClass}
                    >
                      {PHOTO_FILTERS.map((fl) => (
                        <option key={fl} value={fl}>
                          {fl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Showcase rank (0 = not shown)</label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={p.showcase}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i
                                    ? { ...x, showcase: Math.max(0, parseInt(e.target.value || "0", 10)) }
                                    : x
                                ),
                              }
                            : d
                        )
                      }
                      className={numClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>External URL override (empty = bundled photo file)</label>
                    <input
                      value={p.url_override}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                photos: d.photos.map((x, xi) =>
                                  xi === i ? { ...x, url_override: e.target.value } : x
                                ),
                              }
                            : d
                        )
                      }
                      className={inputClass}
                      placeholder="https://…"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SaveRow />
        </div>
      )}

      {tab === "terms" && (
        <div>
          <p className="text-[12px] text-white/35 mb-4">
            Numbers and small text used across the site. {"{{tokens}}"} in the Words tab
            can pull these in.
          </p>
          <div className="rounded-md border border-white/10 bg-white/[0.03] divide-y divide-white/10">
            {draft.terms.map((t, i) => (
              <div key={t.key} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-[14px] text-white/80">{t.label}</p>
                  <p className="text-[12px] text-white/35 font-mono">{t.key}</p>
                </div>
                <input
                  value={t.value}
                  onChange={(e) =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            terms: d.terms.map((x, xi) =>
                              xi === i ? { ...x, value: e.target.value } : x
                            ),
                          }
                        : d
                    )
                  }
                  className="w-56 h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white text-[14px] outline-none focus:border-[#c7ff00]"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const key = prompt("New term key (letters and underscores, e.g. my_term):");
              if (!key || !/^[a-z_]+$/.test(key)) {
                if (key) alert("Keys can only use lowercase letters and underscores.");
                return;
              }
              const label = prompt("Label for this term:") || key;
              setDraft((d) =>
                d ? { ...d, terms: [...d.terms, { key, label, value: "" }] } : d
              );
            }}
            className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white border border-white/15 rounded-md px-3 py-2 mt-4"
          >
            <Plus className="w-4 h-4" /> Add a term
          </button>
          <SaveRow />
        </div>
      )}

      {tab === "discounts" && (
        <div>
          <p className="text-[12px] text-white/35 mb-4">
            Codes customers enter at checkout. Only codes marked "shown publicly" appear
            anywhere on the site; the rest stay private. Turn a code off instead of
            deleting it so old records keep working.
          </p>
          <div className="space-y-3">
            {discountRows.map((d) => {
              const i = draft.discounts.indexOf(d);
              return (
                <div key={d.code} className={cardClass}>
                  <div className="grid md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className={labelClass}>Code</label>
                      <input value={d.code} readOnly className={`${inputClass} opacity-60`} />
                    </div>
                    <div>
                      <label className={labelClass}>Percent off</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={d.amount}
                        onChange={(e) =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  discounts: prev.discounts.map((x, xi) =>
                                    xi === i
                                      ? {
                                          ...x,
                                          amount: Math.min(
                                            100,
                                            Math.max(1, parseInt(e.target.value || "0", 10))
                                          ),
                                        }
                                      : x
                                  ),
                                }
                              : prev
                          )
                        }
                        className={numClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 text-[13px] text-white/70">
                        <input
                          type="checkbox"
                          checked={d.active}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    discounts: prev.discounts.map((x, xi) =>
                                      xi === i ? { ...x, active: e.target.checked } : x
                                    ),
                                  }
                                : prev
                            )
                          }
                          className="w-4 h-4 accent-[#c7ff00]"
                        />
                        Active
                      </label>
                      <label className="inline-flex items-center gap-2 text-[13px] text-white/70">
                        <input
                          type="checkbox"
                          checked={d.public}
                          onChange={(e) =>
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    discounts: prev.discounts.map((x, xi) =>
                                      xi === i ? { ...x, public: e.target.checked } : x
                                    ),
                                  }
                                : prev
                            )
                          }
                          className="w-4 h-4 accent-[#c7ff00]"
                        />
                        Shown publicly
                      </label>
                    </div>
                    <div>
                      <span
                        className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${
                          d.active
                            ? "bg-[#c7ff00]/15 text-[#c7ff00]"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {d.active ? `${d.amount}% off · live` : "off"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              const code = prompt("New discount code (e.g. SPRING10):");
              if (!code || !/^[A-Z0-9]+$/.test(code.trim().toUpperCase())) {
                if (code) alert("Codes can only use letters and numbers.");
                return;
              }
              const upper = code.trim().toUpperCase();
              setDraft((d) =>
                d && !d.discounts.some((x) => x.code === upper)
                  ? {
                      ...d,
                      discounts: [...d.discounts, { code: upper, amount: 10, active: false, public: false }],
                    }
                  : d
              );
            }}
            className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white border border-white/15 rounded-md px-3 py-2 mt-4"
          >
            <Plus className="w-4 h-4" /> Add a discount code
          </button>
          <SaveRow />
        </div>
      )}
    </section>
  );
}
