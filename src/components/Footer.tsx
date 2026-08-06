import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Studio<span className="text-primary">.</span>
            </p>
            <p className="mt-6 max-w-md text-muted-foreground">
              An independent design studio working with founders and brand leaders on the things that matter.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Navigate</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/work" className="story-link">Work</Link></li>
              <li><Link to="/services" className="story-link">Services</Link></li>
              <li><Link to="/about" className="story-link">Studio</Link></li>
              <li><Link to="/contact" className="story-link">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Elsewhere</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="story-link">Instagram</a></li>
              <li><a href="#" className="story-link">Are.na</a></li>
              <li><a href="#" className="story-link">LinkedIn</a></li>
              <li><a href="#" className="story-link">Vimeo</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Studio — All rights reserved</span>
          <span>London · Lisbon</span>
        </div>
      </div>
    </footer>
  );
}
