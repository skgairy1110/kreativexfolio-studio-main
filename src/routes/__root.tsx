import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Loader } from "@/components/Loader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { RouteTransition } from "@/components/RouteTransition";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">This page wandered off the map.</p>
        <a href="/" className="mt-6 inline-block story-link uppercase tracking-[0.2em] text-sm">Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-display text-4xl">Something broke.</h1>
        <p className="mt-2 text-muted-foreground">Please try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full border border-border px-5 py-2 text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gairy Studio — Independent Design Studio" },
      { name: "description", content: "Gairy Studio is an independent design studio crafting brand, web, motion and digital product for ambitious teams." },
      { property: "og:title", content: "Gairy Studio — Independent Design Studio" },
      { property: "og:description", content: "Gairy Studio is an independent design studio crafting brand, web, motion and digital product for ambitious teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Gairy Studio — Independent Design Studio" },
      { name: "twitter:description", content: "Gairy Studio is an independent design studio crafting brand, web, motion and digital product for ambitious teams." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/EGrmvqK72bfA041xo33M6wts9o33/social-images/social-1780679326340-Logo-1200x628.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/EGrmvqK72bfA041xo33M6wts9o33/social-images/social-1780679326340-Logo-1200x628.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter+Tight:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        {/* Organization structured data (JSON-LD) for richer Google search results.
            Static data mirroring public/data/site.json — update both if the
            studio's contact/social details change. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Gairy Studio",
              url: "https://gairystudio.com",
              logo: "https://gairystudio.com/logo.svg",
              description:
                "An independent design studio working with founders and brand leaders on brand, web, motion and digital product.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Noida",
                addressRegion: "Uttar Pradesh",
                addressCountry: "IN",
              },
              sameAs: [
                "https://www.linkedin.com/company/gairystudio",
                "https://www.instagram.com/gairystudio",
                "https://www.facebook.com/gairystudio",
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Loader />
      <RouteTransition />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
