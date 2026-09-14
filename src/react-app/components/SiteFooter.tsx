import { Link } from "react-router";

/**
 * Apple-style footer: light gray, small type, link columns, fine print.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  const columns: { title: string; links: { label: string; to: string; anchor?: boolean }[] }[] = [
    {
      title: "Services",
      links: [
        { label: "Listing Package", to: "/#package", anchor: true },
        { label: "Add-ons", to: "/#addons", anchor: true },
        { label: "Our Work", to: "/#work", anchor: true },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Partnerships", to: "/special" },
        { label: "Book a Shoot", to: "/book" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "luxentra.media@gmail.com", to: "mailto:luxentra.media@gmail.com" },
        { label: "+1 (347) 837-1257", to: "tel:+13478371257" },
      ],
    },
  ];

  return (
    <footer className="bg-[#f5f5f7] text-[#6e6e73]">
      <div className="max-w-[1024px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-[#1d1d1f] mb-3">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) =>
                  l.to.startsWith("mailto:") || l.to.startsWith("tel:") ? (
                    <li key={l.label}>
                      <a href={l.to} className="text-xs hover:underline underline-offset-2">
                        {l.label}
                      </a>
                    </li>
                  ) : l.anchor ? (
                    <li key={l.label}>
                      <a href={l.to} className="text-xs hover:underline underline-offset-2">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link to={l.to} className="text-xs hover:underline underline-offset-2">
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d2d2d7] pt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-xs">© {year} LuxEntra Media. All rights reserved.</p>
          <p className="text-xs">Real estate photography &amp; film — New York City &amp; Long Island.</p>
        </div>
      </div>
    </footer>
  );
}
