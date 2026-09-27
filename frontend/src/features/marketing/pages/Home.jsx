import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Check,
  LayoutDashboard,
  Menu,
  Search,
  X,
} from "lucide-react";
import "../landing.css";

const jobs = [
  ["Northstar Labs", "Product Designer", "Interview"],
  ["Orbit Systems", "UX Researcher", "Applied"],
  ["Evergreen Studio", "Design Lead", "Offer"],
];
const navItems = [
  ["Problem", "#problem"],
  ["Features", "#features"],
  ["How it works", "#how-it-works"],
];

function Brand() {
  return (
    <Link className="brand" to="/">
      <span>
        <BriefcaseBusiness size={18} />
      </span>
      Akrio Job Tracker
    </Link>
  );
}

function DashboardPreview() {
  return (
    <div
      className="dashboard-preview"
      aria-label="Job application dashboard preview"
    >
      <div className="dashboard-bar">
        <span>
          <LayoutDashboard size={16} /> Application overview
        </span>
        <small>September 2026</small>
      </div>
      <div className="dashboard-stats">
        {[
          ["Applications", "24", "+4 this month"],
          ["Interviews", "08", "33% response rate"],
          ["Offers", "02", "Keep going"],
        ].map(([label, value, note]) => (
          <div key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
            <em>{note}</em>
          </div>
        ))}
      </div>
      <div className="dashboard-label">
        <span>Recent applications</span>
        <span>Status</span>
      </div>
      {jobs.map(([company, role, status]) => (
        <div className="job-row" key={company}>
          <span className="company-icon">{company[0]}</span>
          <span className="job-name">
            <b>{company}</b>
            <small>{role}</small>
          </span>
          <em className={`status status-${status.toLowerCase()}`}>{status}</em>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-container nav-inner">
          <Brand />
          <nav className="nav-links">
            {navItems.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <Link to="/login">Sign in</Link>
            <Link className="button button-warm" to="/register">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav">
            {navItems.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
            <Link to="/login">Sign in</Link>
            <Link to="/register">Get started</Link>
          </nav>
        )}
      </header>
      <main>
        <section className="landing-hero">
          <div className="landing-container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                A calmer way to move your search forward
              </p>
              <h1>
                Every application.
                <br />
                <em>One clear view.</em>
              </h1>
              <p>
                Track applications, stay ahead of follow-ups, and see your job
                search gaining momentum without living in a spreadsheet.
              </p>
              <div className="hero-actions">
                <Link className="button button-warm" to="/register">
                  Build your tracker <ArrowRight size={17} />
                </Link>
                <Link className="hero-link" to="/login">
                  Sign in to your workspace
                </Link>
              </div>
              <div className="proof">
                <span>
                  <Check size={14} /> Free to get started
                </span>
                <span>
                  <Check size={14} /> Private by design
                </span>
              </div>
            </div>
            <DashboardPreview />
          </div>
          <div className="hero-ribbon">
            Applications <i /> Interviews <i /> Offers <i /> Momentum
          </div>
        </section>
        <section id="problem" className="landing-section problem-section">
          <div className="landing-container split">
            <div>
              <p className="section-label">The job search is already a lot</p>
              <h2>Stop searching through your search.</h2>
            </div>
            <div className="section-copy">
              <p>
                One application is in your inbox. Another is in a spreadsheet. A
                follow-up is hiding in a note you forgot to open.
              </p>
              <p>
                Akrio brings the moving pieces together so you can spend less
                energy remembering and more energy preparing.
              </p>
            </div>
          </div>
        </section>
        <section id="features" className="landing-section">
          <div className="landing-container">
            <p className="section-label">The control center</p>
            <h2>
              Everything in motion,
              <br />
              at a glance.
            </h2>
            <div className="feature-grid">
              <article className="feature-primary">
                <LayoutDashboard />
                <h3>See your whole pipeline</h3>
                <p>
                  Change each application status as your search progresses, with
                  every current stage visible in one clear view.
                </p>
              </article>
              <article>
                <BellRing />
                <h3>Never miss the next step</h3>
                <p>
                  Keep deadlines, notes, and follow-ups close to the application
                  they belong to.
                </p>
              </article>
              <article>
                <BarChart3 />
                <h3>Read your momentum</h3>
                <p>
                  Understand where your search is moving and where a little
                  focus could help.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="landing-section how-section">
          <div className="landing-container split">
            <div>
              <p className="section-label">How it works</p>
              <h2>A lighter system for a heavy season.</h2>
              <p className="section-copy">
                Set it up once, then let the tracker hold the context while you
                focus on the conversations that matter.
              </p>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "Add the opportunity",
                  "Save the company, role, source, and details.",
                ],
                [
                  "02",
                  "Move it as things change",
                  "Update the status after every reply or interview.",
                ],
                [
                  "03",
                  "Follow the signal",
                  "Decide where your next hour is best spent.",
                ],
              ].map(([number, title, copy]) => (
                <div key={number}>
                  <b>{number}</b>
                  <span>
                    <strong>{title}</strong>
                    {copy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="landing-section dashboard-section">
          <div className="landing-container split">
            <div>
              <p className="section-label">Your search, made visible</p>
              <h2>A dashboard that gives the waiting room a shape.</h2>
              <p className="section-copy">
                See your latest applications, interviews, and offers together,
                so the next step is easier to choose.
              </p>
              <Link className="text-link" to="/register">
                Open your workspace <ArrowRight size={15} />
              </Link>
            </div>
            <DashboardPreview />
          </div>
        </section>
        <section className="landing-cta">
          <div className="landing-container cta-inner">
            <div>
              <p className="section-label">Your next move is easier to see</p>
              <h2>Make the search feel manageable.</h2>
            </div>
            <Link className="button button-warm" to="/register">
              Get started free <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <footer>
        <div className="landing-container footer-inner">
          <Brand />
          <span>Keep track of the work behind the opportunity.</span>
          <Link to="/login">
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
