import { useState } from 'react';
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';

export function Brand() {
  return <Link to="/" className="brand" aria-label="LuxEntra Media home"><img src="/brand/symbol-lime.png" alt="" width="36" height="36" /><img src="/brand/wordmark-lime.png" alt="LuxEntra Media" width="152" height="46" /></Link>;
}
const links = [{ href: '/#work', label: 'Work' }, { href: '/#services', label: 'Services' }, { href: '/#package', label: 'Pricing' }, { href: '/about', label: 'About' }];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="nav-inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.label} to={link.href}>{link.label}</Link>)}</nav><div className="nav-actions"><Link to="/order" className="pill pill-lime nav-book">Book a Shoot</Link><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="menu-trigger" aria-label="Open navigation"><Menu size={22} /></button></DialogTrigger><DialogContent className="mobile-dialog"><DialogTitle>Explore LuxEntra</DialogTitle><DialogDescription>Photography, films and media for your next listing.</DialogDescription><nav aria-label="Mobile navigation">{links.map(link => <Link key={link.label} to={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link to="/order" onClick={() => setOpen(false)}>Book a Shoot</Link><a href="tel:+13478371257">Call us</a></nav></DialogContent></Dialog></div></div></header></>;
}
export function SiteFooter() {
  return <footer className="site-footer"><div className="wrap"><div className="footer-top"><Brand /><p>Real estate photography & film.<br />New York City & Long Island.</p><div className="footer-contact"><a href="mailto:luxentra.media@gmail.com">luxentra.media@gmail.com</a><a href="tel:+13478371257">+1 (347) 837-1257</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} LuxEntra Media.</span><nav aria-label="Footer"><Link to="/special">Partnerships</Link><Link to="/about">Our team</Link><Link to="/book">Contact</Link></nav></div></div></footer>;
}
