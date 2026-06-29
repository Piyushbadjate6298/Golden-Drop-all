import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  schema?: Record<string, unknown>;
};

const siteUrl = "https://goldendrop.example.com";
const defaultImage = `${siteUrl}/images/groundnut-oil-bottle.png`;

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function Seo({ title, description, path, image = defaultImage, schema }: SeoProps) {
  useEffect(() => {
    const canonical = `${siteUrl}${path === "/" ? "" : path}`;
    const fullTitle = `${title} | Golden Drop`;
    const structuredData = schema ?? {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Golden Drop",
      url: siteUrl,
      logo: defaultImage
    };

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertLink("canonical", canonical);
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image"
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

    let script = document.head.querySelector<HTMLScriptElement>("#golden-drop-schema");
    if (!script) {
      script = document.createElement("script");
      script.id = "golden-drop-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [description, image, path, schema, title]);

  return null;
}
