import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { SkipLink } from "@/components/ui/SkipLink";
import { site } from "@/config/site";
import { fraunces, interTight } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Educação popular e agroecologia desde 1983`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
};

// Runs before first paint: flags JS so [data-reveal] can start hidden, with a
// failsafe that un-hides everything if the motion layer never boots.
const bootScript = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js')},4000)})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${interTight.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="grain">
        <SkipLink />
        <SmoothScroll>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
