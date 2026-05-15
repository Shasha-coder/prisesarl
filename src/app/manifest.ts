import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PRISE Sarl — Engineering & Infrastructure",
    short_name: "PRISE",
    description:
      "PRISE Sarl — entreprise congolaise spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e6",
    theme_color: "#0a2240",
    orientation: "portrait-primary",
    lang: "fr",
    categories: ["business", "productivity", "education"],
    icons: [
      { src: "/icon", sizes: "any", type: "image/svg+xml" },
      { src: "/icon?size=192", sizes: "192x192", type: "image/png" },
      { src: "/icon?size=512", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
