import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ExternalLink, Mail, Sparkles } from "lucide-react";
import AnimatedBackdrop from "./AnimatedBackdrop.jsx";

const email = "contact@metkapps.com";
const duelioUrl = "https://duelioapp.com";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.22, active: false });

  const motionTransition = useMemo(
    () => ({
      duration: reduceMotion ? 0 : 0.65,
      ease: [0.22, 1, 0.36, 1],
    }),
    [reduceMotion],
  );

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      active: true,
    });
  };

  return (
    <main
      className="site-shell"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer((current) => ({ ...current, active: false }))}
    >
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand-lockup" href="#top" aria-label="METk home">
          <span className="brand-mark" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}images/metk-logo.png`} alt="" />
          </span>
          <span>METk LLC</span>
        </a>

        <div className="nav-actions">
          <a href={duelioUrl} target="_blank" rel="noreferrer">
            Duelio
            <ExternalLink size={15} strokeWidth={2.2} />
          </a>
        </div>
      </nav>

      <section id="top" className="hero" aria-labelledby="hero-title">
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
            Official home of METk LLC
          </div>

          <h1 id="hero-title">METk</h1>

          <p className="hero-copy">
            Independent mobile game studio
          </p>

          <a className="primary-action" href={duelioUrl} target="_blank" rel="noreferrer">
            Visit Duelio
            <ArrowRight size={20} strokeWidth={2.4} />
          </a>
        </motion.div>

        <motion.article
          className="duelio-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...motionTransition, delay: reduceMotion ? 0 : 0.12 }}
          aria-labelledby="duelio-title"
        >
          <div className="icon-stage" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}images/duelio-app-icon.png`} alt="" />
          </div>

          <div className="duelio-copy">
            <h2 id="duelio-title">Duelio</h2>
            <p>
              A new iOS iMessage game from METk, built for quick competitive
              duels inside your conversations.
            </p>
          </div>
        </motion.article>
      </section>

      <footer className="footer">
        <span>METk LLC</span>
        <span>Founded by Tarek Khalifa</span>
        <a href={`mailto:${email}`}>
          <Mail size={16} strokeWidth={2.2} />
          {email}
        </a>
      </footer>
    </main>
  );
}

export default App;
