import { RevealFx, ThemeSwitcher } from "@once-ui-system/core";

const navItems = [
  { name: "Contact", href: "https://prgsn.dev/contact" },
  { name: "About Us", href: "https://prgsn.dev/about" },
  { name: "OK Mall", href: "https://okmall.prgsn.dev", external: true },
  { name: "Walden Heights Building", href: "https://prgsn.dev/whb" },
  { name: "Bromsgrove District", href: "https://prgsn.dev/bd" },
  { name: "ProgressionTools", href: "/" },
  { name: "Projects", href: "https://prgsn.dev/projects" },
  { name: "Discord", href: "https://discord.prgsn.dev/rd", external: true },
  { name: "Status", href: "https://status.prgsn.dev", external: true },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <RevealFx speed={1600} translateY={0.5}>
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="site-brand" href="/">
            <img src="https://prgsn.dev/pdweblogo.png" alt="Progression Developments" />
          </a>
          <div className="site-nav-links desktop-nav">
            {navItems.map((item) => (
              <span className="nav-item" key={item.name}>
                {(item.name === "OK Mall" || item.name === "Discord") && (
                  <span className="nav-divider" aria-hidden="true" />
                )}
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {item.name}
                </a>
              </span>
            ))}
          </div>
          <ThemeSwitcher
            collapsed
            direction="column"
            className="site-theme-switcher"
            style={{
              position: "absolute",
              top: 5,
              right: "var(--site-theme-switcher-right, 12px)",
            }}
          />
          <details className="mobile-nav">
            <summary aria-label="Toggle menu">
              <span />
              <span />
              <span />
            </summary>
            <div className="mobile-nav-menu">
              {navItems.map((item) => (
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  key={item.name}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </details>
        </nav>
      </RevealFx>
    </header>
  );
}
