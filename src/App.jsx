import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Clock3,
  ExternalLink,
  Gamepad2,
  Grid2X2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  Watch,
  Zap,
} from "lucide-react";
import AnimatedBackdrop from "./AnimatedBackdrop.jsx";

const email = "contact@metkapps.com";
const phoneDisplay = "(202) 290-8412";
const phoneLink = "+12022908412";
const wordfitAppStoreUrl = "https://apps.apple.com/app/id6807604940";
const duelioAppStoreUrl = "https://apps.apple.com/app/id6792538416";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const pagePath = window.location.pathname.replace(/\/+$/, "") || "/";

function BrandNav() {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <a className="brand-lockup" href="/" aria-label="METk home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/images/metk-logo.png" alt="" />
        </span>
        <span>METk LLC</span>
      </a>

      <div className="nav-actions">
        <a className="nav-link" href="/#apps">Apps</a>
        <a className="nav-link nav-wordfit" href="/wordfit/">WordFit</a>
        <a className="nav-link nav-duelio" href={duelioAppStoreUrl} target="_blank" rel="noreferrer">
          Duelio
          <ExternalLink size={14} strokeWidth={2.2} />
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-identity">
        <strong>METk LLC</strong>
        <span>Independent games by Tarek Khalifa</span>
      </div>
      <div className="footer-links" aria-label="Footer navigation">
        <a href={wordfitAppStoreUrl} target="_blank" rel="noreferrer">WordFit on the App Store</a>
        <a href={duelioAppStoreUrl} target="_blank" rel="noreferrer">Duelio on the App Store</a>
        <a href="/wordfit/support/">WordFit Support</a>
        <a href="/wordfit/privacy/">Privacy</a>
        <a href={`mailto:${email}`}>
          <Mail size={15} strokeWidth={2.2} />
          {email}
        </a>
      </div>
      <span className="copyright">© 2026 METk LLC</span>
    </footer>
  );
}

function AppCard({ app, reduceMotion, delay = 0 }) {
  const isWordFit = app.name === "WordFit";
  return (
    <motion.article
      className={`app-card ${isWordFit ? "app-card-wordfit" : "app-card-duelio"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay }}
    >
      <div className="app-card-top">
        <div className="app-icon">
          <img src={app.icon} alt={`${app.name} app icon`} />
        </div>
        <span className="status-pill">{app.status}</span>
      </div>
      <div className="app-card-copy">
        <p className="card-kicker">{app.kicker}</p>
        <h3>{app.name}</h3>
        <p>{app.description}</p>
      </div>
      <div className="platform-row" aria-label={`${app.name} platforms`}>
        {app.platforms.map((platform) => (
          <span key={platform}>{platform}</span>
        ))}
      </div>
      <div className="card-actions">
        <a className="card-link" href={app.href} target="_blank" rel="noreferrer">
          {app.action}
          <ExternalLink size={17} />
        </a>
        {app.secondaryHref ? (
          <a className="card-secondary-link" href={app.secondaryHref}>
            {app.secondaryAction}
            <ArrowRight size={16} />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function HomePage({ pointer, reduceMotion, motionTransition }) {
  const apps = [
    {
      name: "WordFit",
      kicker: "Trivia • Logic • Wordplay",
      description:
        "Fast, focused brain sprints powered by thousands of trivia, logic, number, visual, word, and myth-busting puzzles.",
      platforms: ["iPhone", "iPad", "Apple Watch"],
      status: "Coming soon",
      href: wordfitAppStoreUrl,
      action: "View on the App Store",
      secondaryHref: "/wordfit/",
      secondaryAction: "Learn more",
      icon: "/images/wordfit-app-icon.png",
    },
    {
      name: "Duelio",
      kicker: "Quick competitive duels",
      description:
        "An iOS iMessage game made for quick head-to-head competition without leaving your conversations.",
      platforms: ["iPhone", "iMessage"],
      status: "Available now",
      href: duelioAppStoreUrl,
      action: "View on the App Store",
      icon: "/images/duelio-app-icon.png",
    },
  ];

  return (
    <>
      <section className="hero home-hero" aria-labelledby="hero-title">
        <AnimatedBackdrop pointer={pointer} />
        <div className="hero-shade" />
        <div className="hero-grid" aria-hidden="true" />

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={motionTransition}
        >
          <div className="eyebrow">
            <Sparkles size={16} strokeWidth={2.2} />
            Independent mobile game studio
          </div>
          <h1 id="hero-title">Playful ideas, built to last.</h1>
          <p className="hero-copy">
            METk makes focused, polished games that fit naturally into your day—whether
            you have forty seconds to think or a friend ready to duel.
          </p>
          <div className="action-row">
            <a className="primary-action" href="#apps">
              Meet our games
              <ArrowRight size={20} strokeWidth={2.4} />
            </a>
            <a className="secondary-action" href={`mailto:${email}`}>
              Contact METk
            </a>
          </div>
        </motion.div>

        <motion.div
          className="studio-showcase"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...motionTransition, delay: reduceMotion ? 0 : 0.12 }}
          aria-label="METk games"
        >
          <div className="showcase-icons">
            <img className="showcase-icon showcase-wordfit" src="/images/wordfit-app-icon.png" alt="WordFit" />
            <img className="showcase-icon showcase-duelio" src="/images/duelio-app-icon.png" alt="Duelio" />
          </div>
          <div className="showcase-copy">
            <span>Two original games</span>
            <strong>Think fast. Play together.</strong>
            <p>Designed and developed independently by METk LLC.</p>
          </div>
        </motion.div>
      </section>

      <section id="apps" className="section apps-section" aria-labelledby="apps-title">
        <div className="section-heading">
          <p className="section-kicker">Our games</p>
          <h2 id="apps-title">Different ways to make a moment more fun.</h2>
          <p>
            Every METk title starts with one simple promise: easy to pick up, satisfying
            to return to, and carefully made for Apple devices.
          </p>
        </div>
        <div className="app-grid">
          {apps.map((app, index) => (
            <AppCard key={app.name} app={app} reduceMotion={reduceMotion} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section className="section studio-note" aria-labelledby="studio-title">
        <div>
          <p className="section-kicker">Small studio, deliberate work</p>
          <h2 id="studio-title">Every detail has an owner.</h2>
        </div>
        <p>
          METk LLC is an independent game studio founded by Tarek Khalifa. Product,
          design, engineering, and player support all live under one roof, keeping each
          game personal and accountable.
        </p>
      </section>
    </>
  );
}

const features = [
  { icon: BrainCircuit, title: "3,200 challenges", copy: "A deep pool of original questions built for repeat play." },
  { icon: Grid2X2, title: "Nine categories", copy: "Trivia, logic, words, numbers, visuals, riddles, and more." },
  { icon: Clock3, title: "Forty-second sprints", copy: "Twelve quick questions make every run easy to fit into your day." },
  { icon: Trophy, title: "Personal bests", copy: "Track your top score and see how you stack up on the leaderboard." },
  { icon: Watch, title: "Made for Apple devices", copy: "Play on iPhone, iPad, and Apple Watch with a familiar experience." },
  { icon: ShieldCheck, title: "Privacy by design", copy: "No ads, no third-party analytics, and no cross-app tracking." },
];

function WordFitPage({ pointer, reduceMotion, motionTransition }) {
  return (
    <>
      <section className="product-hero" aria-labelledby="wordfit-title">
        <AnimatedBackdrop pointer={pointer} />
        <div className="wordfit-glow" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <motion.div
          className="product-hero-copy"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={motionTransition}
        >
          <div className="eyebrow wordfit-eyebrow">
            <Zap size={16} strokeWidth={2.3} />
            Coming soon to the App Store
          </div>
          <p className="wordfit-name">WordFit</p>
          <h1 id="wordfit-title">A better brain break.</h1>
          <p className="hero-copy">
            Race through a fresh mix of trivia, logic, word, number, visual, and
            myth-busting puzzles—twelve questions and forty seconds at a time.
          </p>
          <div className="action-row">
            <a className="primary-action wordfit-action" href={wordfitAppStoreUrl} target="_blank" rel="noreferrer">
              View on the App Store
              <ExternalLink size={19} strokeWidth={2.4} />
            </a>
            <a className="secondary-action" href="#features">See what’s inside</a>
          </div>
        </motion.div>

        <motion.div
          className="wordfit-device-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...motionTransition, delay: reduceMotion ? 0 : 0.12 }}
        >
          <img src="/images/wordfit-app-icon.png" alt="WordFit app icon" />
          <div className="wordfit-stat stat-top"><strong>3,200</strong><span>questions</span></div>
          <div className="wordfit-stat stat-bottom"><strong>40 sec</strong><span>per run</span></div>
        </motion.div>
      </section>

      <section id="features" className="section feature-section" aria-labelledby="features-title">
        <div className="section-heading compact-heading">
          <p className="section-kicker wordfit-kicker">Built for quick thinking</p>
          <h2 id="features-title">Big variety. Zero setup.</h2>
          <p>Open WordFit, choose your mode, and let instinct take over.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                className="feature-card"
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : (index % 3) * 0.06 }}
              >
                <span className="feature-icon"><Icon size={23} strokeWidth={2.1} /></span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section category-section" aria-labelledby="categories-title">
        <div className="category-copy">
          <p className="section-kicker wordfit-kicker">Never the same run twice</p>
          <h2 id="categories-title">There’s always another angle.</h2>
          <p>Switch from quick facts to visual thinking, then into a riddle or a number pattern before the clock runs out.</p>
        </div>
        <div className="category-cloud" aria-label="WordFit puzzle categories">
          {["Visual", "Logic", "Odd One Out", "Number Play", "Math Problems", "Myth Buster", "Codebreakers", "Fits or Not", "Rebus Puzzles"].map((category) => (
            <span key={category}><Check size={15} />{category}</span>
          ))}
        </div>
      </section>

      <section className="section privacy-callout" aria-labelledby="privacy-title">
        <div className="privacy-callout-icon"><ShieldCheck size={30} strokeWidth={1.9} /></div>
        <div>
          <p className="section-kicker wordfit-kicker">Your play stays yours</p>
          <h2 id="privacy-title">No ads. No tracking. No noise.</h2>
          <p>WordFit collects only the limited information needed to run optional leaderboard and sync features. It does not use advertising identifiers or third-party analytics.</p>
        </div>
        <a className="secondary-action" href="/wordfit/privacy/">Read the privacy policy</a>
      </section>
    </>
  );
}

function SupportPage() {
  return (
    <div className="content-page">
      <header className="page-header support-header">
        <div className="page-icon"><img src="/images/wordfit-app-icon.png" alt="WordFit app icon" /></div>
        <div>
          <p className="section-kicker wordfit-kicker">WordFit</p>
          <h1>Support</h1>
          <p>Questions, feedback, or something not working? You’ll reach METk directly.</p>
        </div>
      </header>

      <section className="contact-grid" aria-label="WordFit support contacts">
        <a className="contact-card" href={`mailto:${email}?subject=WordFit%20Support`}>
          <span><Mail size={22} /></span>
          <div><strong>Email support</strong><small>{email}</small></div>
          <ArrowRight size={19} />
        </a>
        <a className="contact-card" href={`tel:${phoneLink}`}>
          <span><Phone size={22} /></span>
          <div><strong>Call METk</strong><small>{phoneDisplay}</small></div>
          <ArrowRight size={19} />
        </a>
      </section>

      <section className="support-section" aria-labelledby="help-title">
        <div className="section-heading compact-heading">
          <p className="section-kicker">Quick answers</p>
          <h2 id="help-title">Before you reach out</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Do I need to create an account?</summary>
            <p>No. WordFit does not require a separate METk account or password.</p>
          </details>
          <details>
            <summary>How does the leaderboard name work?</summary>
            <p>You can use an anonymous name or choose the iCloud display name available on your device. Only the name you choose and your best score appear publicly.</p>
          </details>
          <details>
            <summary>Can I play without an internet connection?</summary>
            <p>Core puzzle rounds work without a METk account. Internet access is needed for leaderboard updates and Apple sync features.</p>
          </details>
          <details>
            <summary>How do I request deletion of leaderboard data?</summary>
            <p>Email <a href={`mailto:${email}?subject=WordFit%20Data%20Deletion`}>{email}</a> with “WordFit data deletion” and your current leaderboard display name. We may ask for limited information needed to locate and verify the record.</p>
          </details>
        </div>
      </section>

      <section className="support-note">
        <Gamepad2 size={24} />
        <div>
          <strong>Helpful details speed things up.</strong>
          <p>When reporting a problem, include your device model, iOS or watchOS version, and what you were doing when it happened.</p>
        </div>
      </section>
    </div>
  );
}

function PrivacyPage() {
  return (
    <article className="content-page legal-page">
      <header className="page-header legal-header">
        <div className="page-icon privacy-page-icon"><ShieldCheck size={34} strokeWidth={1.8} /></div>
        <div>
          <p className="section-kicker wordfit-kicker">WordFit</p>
          <h1>Privacy Policy</h1>
          <p>Effective September 1, 2026 · Last updated September 1, 2026</p>
        </div>
      </header>

      <div className="policy-intro">
        <p>METk LLC (“METk,” “we,” “us,” or “our”) built WordFit to be enjoyable without advertising, cross-app tracking, or unnecessary data collection. This policy explains the limited information WordFit uses and the choices available to you.</p>
        <div className="policy-principles">
          <span><Check size={17} /> No advertising</span>
          <span><Check size={17} /> No third-party analytics</span>
          <span><Check size={17} /> No cross-app tracking</span>
        </div>
      </div>

      <section className="policy-section">
        <h2>Information WordFit uses</h2>
        <p>Most gameplay happens on your device. If you use the optional leaderboard or Apple sync features, WordFit processes the following limited information:</p>
        <div className="data-table" role="table" aria-label="WordFit data types and uses">
          <div className="data-row data-head" role="row"><span role="columnheader">Data type</span><span role="columnheader">What it is used for</span></div>
          <div className="data-row" role="row"><strong role="cell">Name</strong><span role="cell">The anonymous or iCloud display name you choose for the public leaderboard.</span></div>
          <div className="data-row" role="row"><strong role="cell">User identifier</strong><span role="cell">A one-way SHA-256 hash derived from a player identifier, used to update your leaderboard record without sending the raw identifier to METk.</span></div>
          <div className="data-row" role="row"><strong role="cell">Product interaction</strong><span role="cell">Your best score, used to calculate and display leaderboard ranking.</span></div>
        </div>
        <p>WordFit may also save settings, preferences, and best-score information on your device and through Apple’s iCloud key-value storage when those services are available.</p>
      </section>

      <section className="policy-section">
        <h2>How information is collected and used</h2>
        <p>WordFit receives leaderboard information when you choose a display-name option and submit or improve a score. We use it only to provide app functionality: showing leaderboard rankings, preserving a best score, and syncing supported preferences. We do not use this information to advertise to you or build a profile of your activity across other companies’ apps or websites.</p>
      </section>

      <section className="policy-section">
        <h2>Service providers</h2>
        <p>WordFit relies on Apple services, including iCloud and CloudKit, for supported device sync and for resolving an optional iCloud display name. Its leaderboard infrastructure is hosted using Cloudflare services. These providers process information on METk’s behalf or under their own terms to deliver those features.</p>
        <p>METk does not sell or rent WordFit data. We may disclose information if required by law, to protect users or the service, or as part of a corporate transaction where the recipient must honor this policy.</p>
      </section>

      <section className="policy-section">
        <h2>Retention and deletion</h2>
        <p>On-device and iCloud preferences remain until you remove the app data, change your iCloud settings, or Apple removes them under its policies. Leaderboard records are retained while the leaderboard operates or until a verified deletion request is completed, unless a longer period is required for security or legal reasons.</p>
        <p>To request deletion or correction of WordFit leaderboard data, email <a href={`mailto:${email}?subject=WordFit%20Data%20Request`}>{email}</a> with “WordFit data request” and your current leaderboard display name. We may request limited information needed to locate and verify the record. You can stop future leaderboard submissions by no longer using the leaderboard feature.</p>
      </section>

      <section className="policy-section">
        <h2>Security</h2>
        <p>We use reasonable technical and organizational safeguards designed to protect the limited data WordFit processes. No storage or transmission method is completely secure, so we cannot guarantee absolute security.</p>
      </section>

      <section className="policy-section">
        <h2>Children’s privacy</h2>
        <p>WordFit is not directed to children under 13, and METk does not knowingly collect personal information from children under 13. If you believe a child provided personal information, contact us so we can investigate and delete it where required.</p>
      </section>

      <section className="policy-section">
        <h2>International processing</h2>
        <p>Depending on where you live, information may be processed in the United States and other locations where Apple, Cloudflare, or their service providers operate. Data-protection rights vary by region. You may contact us to exercise rights available under applicable law.</p>
      </section>

      <section className="policy-section">
        <h2>Changes to this policy</h2>
        <p>We may update this policy as WordFit or legal requirements change. The updated version will be posted here with a revised “Last updated” date. Material changes may also be communicated in the app when appropriate.</p>
      </section>

      <section className="policy-section policy-contact">
        <h2>Contact METk</h2>
        <p>Questions or privacy requests can be sent to:</p>
        <address><strong>METk LLC</strong><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phoneLink}`}>{phoneDisplay}</a></address>
      </section>
    </article>
  );
}

function NotFoundPage() {
  return (
    <div className="content-page not-found">
      <p className="section-kicker">404</p>
      <h1>That page took a wrong turn.</h1>
      <p>Head back to METk to find WordFit, Duelio, and support.</p>
      <a className="primary-action" href="/">Return home <ArrowRight size={19} /></a>
    </div>
  );
}

function App() {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.22, active: false });

  const motionTransition = useMemo(() => ({
    duration: reduceMotion ? 0 : 0.65,
    ease: [0.22, 1, 0.36, 1],
  }), [reduceMotion]);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      active: true,
    });
  };

  let page;
  if (pagePath === "/") {
    page = <HomePage pointer={pointer} reduceMotion={reduceMotion} motionTransition={motionTransition} />;
  } else if (pagePath === "/wordfit") {
    page = <WordFitPage pointer={pointer} reduceMotion={reduceMotion} motionTransition={motionTransition} />;
  } else if (pagePath === "/wordfit/support") {
    page = <SupportPage />;
  } else if (pagePath === "/wordfit/privacy") {
    page = <PrivacyPage />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <main
      className={`site-shell page-${pagePath === "/" ? "home" : pagePath.split("/").filter(Boolean).join("-") || "home"}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer((current) => ({ ...current, active: false }))}
    >
      <BrandNav />
      {page}
      <Footer />
    </main>
  );
}

export default App;
