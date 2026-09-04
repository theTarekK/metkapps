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

  );
}

function AppCard({ name, icon, description, platforms, primaryUrl, primaryLabel = "App Store", secondaryHref, secondaryLabel }) {
  return (
    <article className={"app-card app-" + name.toLowerCase()}>
      <div className="app-main">
        <img className="app-icon" src={icon} alt={name + " app icon"} />
        <div className="app-copy">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="platforms" aria-label={name + " platforms"}>
        {platforms.map((platform) => <span key={platform}>{platform}</span>)}
      </div>
      <div className="app-actions">
        <a className="app-store-link" href={primaryUrl} target="_blank" rel="noreferrer">
          {primaryLabel}
          <ExternalLink size={16} strokeWidth={2.2} />
        </a>
        {secondaryHref ? (
          <a className="text-link" href={secondaryHref}>
            {secondaryLabel}
            <ArrowRight size={15} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function AppsPage() {
  return (
    <div className="home-page">
      <header className="intro">
        <div>
          <p className="eyebrow">METk LLC</p>
          <h1>Apps by METk.</h1>
        </div>
        <p>Independent games for Apple devices.</p>
      </header>

      <section id="apps" className="apps-grid" aria-label="METk apps">
        <AppCard
          name="Duelio"
          icon="/images/duelio-app-icon.png"
          description="Quick competitive games with friends inside iMessage."
          platforms={["iPhone", "iMessage"]}
          primaryUrl={duelioWebsiteUrl}
          primaryLabel="Website"
          secondaryHref="/support/#duelio"
          secondaryLabel="Support"
        />
        <AppCard
          name="WordFit"
          icon="/images/wordfit-app-icon.png"
          description="Fast trivia, logic, number, visual, and word puzzles."
          platforms={["iPhone", "iPad", "Apple Watch"]}
          primaryUrl={wordfitAppStoreUrl}
          secondaryHref="/support/#wordfit"
          secondaryLabel="Support"
        />
      </section>
    </div>
  );
}

function SupportPage() {
  return (
    <article className="subpage support-page">
      <header className="subpage-header">
        <img src="/images/metk-logo.png" alt="METk logo" />
        <div>
          <p className="eyebrow">METk LLC</p>
          <h1>Support</h1>
          <p>Choose an app.</p>
        </div>
      </header>

      <div className="support-apps">
        <section id="duelio" className="support-app">
          <img src="/images/duelio-app-icon.png" alt="Duelio app icon" />
          <div>
            <h2>Duelio</h2>
            <a href={"mailto:" + email + "?subject=Duelio%20Support"}><Mail size={16} />Email support</a>
          </div>
          <a className="text-link" href={duelioAppStoreUrl} target="_blank" rel="noreferrer">App Store <ExternalLink size={14} /></a>
        </section>

        <section id="wordfit" className="support-app">
          <img src="/images/wordfit-app-icon.png" alt="WordFit app icon" />
          <div>
            <h2>WordFit</h2>
            <a href={"mailto:" + email + "?subject=WordFit%20Support"}><Mail size={16} />Email support</a>
          </div>
          <a className="text-link" href={wordfitAppStoreUrl} target="_blank" rel="noreferrer">App Store <ExternalLink size={14} /></a>
        </section>
      </div>

      <div className="support-contact">
        <a href={"mailto:" + email}><Mail size={16} />{email}</a>
      </div>
    </article>
  );
}

function PrivacyPage() {
  return (
    <article className="subpage privacy-page">
      <header className="subpage-header policy-header">
        <span className="policy-icon"><ShieldCheck size={30} /></span>
        <div>
          <p className="eyebrow">WordFit</p>
          <h1>Privacy</h1>
          <p>Effective September 1, 2026</p>
        </div>
      </header>

      <section className="policy-summary">
        <strong>No ads. No analytics. No tracking.</strong>
        <p>WordFit only uses limited data for its optional leaderboard and Apple sync.</p>
      </section>

      <section className="policy-section">
        <h2>Data used</h2>
        <ul className="data-list">
          <li><strong>Name</strong><span>Your chosen anonymous or iCloud leaderboard name.</span></li>
          <li><strong>User ID</strong><span>A one-way SHA-256 hash used to update your leaderboard record.</span></li>
          <li><strong>Score</strong><span>Your best score for leaderboard ranking.</span></li>
        </ul>
        <p>Settings and best scores may also be stored on your device and in Apple iCloud key-value storage.</p>
      </section>

      <section className="policy-section">
        <h2>Use and services</h2>
        <p>Data is used only for app functionality. Apple provides iCloud and CloudKit services. Cloudflare hosts the leaderboard. METk does not sell or rent WordFit data.</p>
      </section>

      <section className="policy-section">
        <h2>Your choices</h2>
        <p>The leaderboard is optional. To request deletion or correction, email <a href={"mailto:" + email + "?subject=WordFit%20Data%20Request"}>{email}</a> with your current leaderboard name. We may request limited information to verify the record.</p>
      </section>

      <section className="policy-section">
        <h2>Retention and security</h2>
        <p>Leaderboard records remain while the service operates or until a verified deletion request is completed, unless law or security requires longer retention. We use reasonable safeguards, but no system is completely secure.</p>
      </section>

      <section className="policy-section">
        <h2>Other information</h2>
        <p>WordFit is not directed to children under 13. Data may be processed where Apple or Cloudflare operates. This policy may change; the date above will be updated.</p>
      </section>

      <section className="policy-section policy-contact">
        <h2>Contact</h2>
        <p><strong>METk LLC</strong><br /><a href={"mailto:" + email}>{email}</a></p>
      </section>
    </article>
  );
}

function NotFoundPage() {
  return (
    <div className="subpage not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found.</h1>
      <a className="app-store-link" href="/">View METk apps <ArrowRight size={16} /></a>
    </div>
  );
}

function App() {
  let page;
  if (pagePath === "/" || pagePath === "/wordfit") page = <AppsPage />;
  else if (pagePath === "/support" || pagePath === "/wordfit/support") page = <SupportPage />;
  else if (pagePath === "/wordfit/privacy") page = <PrivacyPage />;
  else page = <NotFoundPage />;

  return (
    <main className="site-shell">
      <Nav />
      {page}
      <Footer />
    </main>
  );
}

export default App;
