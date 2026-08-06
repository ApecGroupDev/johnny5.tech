import os

hero_file = "c:/Projects/johnny5.tech/app/components/hero.tsx"
with open(hero_file, "r") as f:
    lines = f.readlines()

def write_component(start, end, imports, file_path, replace_from, replace_to):
    content = imports + "".join(lines[start:end])
    content = content.replace(replace_from, replace_to, 1)
    with open(file_path, "w") as f:
        f.write(content)

imports = '"use client";\n\nimport { forwardRef, useEffect, useRef } from "react";\nimport Image from "next/image";\n\n'

# GlobeCanvas: lines 10 to 358 (0-indexed)
write_component(10, 358, imports, "c:/Projects/johnny5.tech/app/components/hero/globe-canvas.tsx", "function GlobeCanvas() {", "export function GlobeCanvas() {")
# ConnectorCanvas: lines 361 to 574
write_component(361, 574, imports, "c:/Projects/johnny5.tech/app/components/hero/connector-canvas.tsx", "function ConnectorCanvas({", "export function ConnectorCanvas({")
# EcosystemNode & StatBadge: lines 576 to 667
write_component(576, 667, imports, "c:/Projects/johnny5.tech/app/components/hero/ecosystem-node.tsx", "const EcosystemNode = forwardRef<", "export const EcosystemNode = forwardRef<")

# Update hero.tsx
new_hero = lines[:10] + [
    "import { GlobeCanvas } from \"./hero/globe-canvas\";\n",
    "import { ConnectorCanvas } from \"./hero/connector-canvas\";\n",
    "import { EcosystemNode } from \"./hero/ecosystem-node\";\n\n"
] + lines[667:]

with open(hero_file, "w") as f:
    f.writelines(new_hero)
