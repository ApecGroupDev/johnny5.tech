import {
  Wrench,
  CloudRain,
  Globe,
  Map,
  Crown,
  type LucideIcon,
} from "lucide-react";

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
    slug: "ruby-queen",
    title: "Ruby Queen",
    description:
      "POS Troubleshooting Assistant built from Ms. Peggy's 235-file library.",
    href: "/apps/ruby-queen",
    icon: Crown,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS", "Claude"],
    category: "Support",
  },
  {
    slug: "site-360",
    title: "SITE 360",
    description:
      "APEC Site Profile Database with over 1,400+ POS install records and service calls.",
    href: "/apps/site-360",
    icon: Globe,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS"],
    category: "Database",
  },
  {
    slug: "pulse-360",
    title: "PULSE 360",
    description:
      "Interactive map tracking crew proximity, 48-hour rain risk, and Claude AI assistance.",
    href: "/apps/pulse-360",
    icon: Map,
    status: "Live",
    kind: "Private",
    stack: ["Vanilla JS", "Claude", "Python"],
    category: "Management",
  },
  {
    slug: "canopy-configurator",
    title: "Canopy Configurator",
    description:
      "Interactively pick canopy dimensions, materials, and options to generate tailored specifications.",
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
      "Multi-model rain consensus scored on custom work hours for construction scheduling.",
    href: "/apps/rain-risk",
    icon: CloudRain,
    status: "Live",
    kind: "Private",
    stack: ["JavaScript", "Leaflet"],
    category: "Construction",
  },

  // Free
  // (none yet)
];

export const STREAMLIT_URLS: Record<string, string> = {
  "canopy-configurator":
    "https://apec-canopy-configurator.up.railway.app/?embed=true",
};
