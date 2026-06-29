import { Wrench, CloudRain, Globe, Map, Crown, type LucideIcon } from "lucide-react";

export type AppStatus = "Live" | "WIP" | "Private";
export type AppKind = "Free" | "Private";

export type AppEntry = {
  slug: string;
  title: string;
  description: string;
  href: string; // internal route
  external?: string; // optional external streamlit url
  icon: LucideIcon;
  status: AppStatus;
  kind: AppKind;
  stack: string[];
  category: string;
};

export const APPS: AppEntry[] = [
  // Private
  {
    slug: "canopy-configurator",
    title: "Canopy Configurator",
    description:
      "Configure canopy specifications interactively — pick dimensions, materials, and options to generate a tailored canopy build.",
    href: "/apps/canopy-configurator",
    icon: Wrench,
    status: "Live",
    kind: "Private",
    stack: ["Python", "Railway"],
    category: "Engineering",
  },
  {
    slug: "rain-risk",
    title: "Rain Risk Board",
    description:
      "Multi-model rain consensus for construction scheduling — scored on your work hours.",
    href: "/apps/rain-risk",
    icon: CloudRain,
    status: "Live",
    kind: "Private",
    stack: ["JavaScript", "Leaflet"],
    category: "Construction",
  },
  {
    slug: "site360",
    title: "SITE 360",
    description: "Atlanta Petroleum Equipment Company (APEC) Site Profile Database over 1,400+ POS install records and service calls.",
    href: "/apps/site360",
    icon: Globe,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS"],
    category: "Database",
  },
  {
    slug: "project-updates",
    title: "PULSE 360",
    description:
      "Interactive map of every site with crew proximity and 48-hour rain risk, plus a dedicated Claude AI assistant.",
    href: "/apps/project-updates",
    icon: Map,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS", "Claude", "Python"],
    category: "Management",
  },
  {
    slug: "ruby-queen",
    title: "Ruby Queen",
    description:
      "POS Troubleshooting Assistant. Built from Ms. Peggy's 235-file library.",
    href: "/apps/ruby-queen",
    icon: Crown,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS", "Claude"],
    category: "Support",
  },

  // Free
  // (none yet)
];

export const STREAMLIT_URLS: Record<string, string> = {
  "canopy-configurator":
    "https://apec-canopy-configurator.up.railway.app/?embed=true",
};
