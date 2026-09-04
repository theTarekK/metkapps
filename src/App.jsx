import { ArrowRight, ExternalLink, Mail, ShieldCheck } from "lucide-react";


const email = "contact@metkapps.com";
const wordfitAppStoreUrl = "https://apps.apple.com/app/id6807604940";
const duelioAppStoreUrl = "https://apps.apple.com/app/id6792538416";
const duelioWebsiteUrl = "https://duelioapp.com/";
const pagePath = window.location.pathname.replace(/\/+$/, "") || "/";


function Nav() {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="METk home">
        <img src="/images/metk-logo.png" alt="" />
        <strong>METk</strong>
      </a>
      <div className="nav-links">
        <a href="/#apps">Apps</a>
        <a href="/support/">Support</a>
        <a href="/wordfit/privacy/">Privacy</a>
      </div>
    </nav>
  );
}


function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 METk LLC</span>
      <div>
        <a href="/support/">Support</a>
        <a href="/wordfit/privacy/">Privacy</a>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </footer>
