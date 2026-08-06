import os

hero_file = "c:/Projects/johnny5.tech/app/components/hero.tsx"
with open(hero_file, "r") as f:
    lines = f.readlines()

# The imports are at the top (lines 0 to 7)
# GlobeCanvas starts at line 10
# EcosystemNode ends at line 665
# We want to keep lines 0 to 7, insert the new imports, and then append lines 665 to end.
# Wait, let's verify line indexes.

# To be safe, let's search for "function GlobeCanvas" and "export function Hero"
start_idx = 0
for i, line in enumerate(lines):
    if "function GlobeCanvas" in line:
        start_idx = i - 3 # include the comment block before it
        break

end_idx = 0
for i, line in enumerate(lines):
    if "export function Hero" in line:
        end_idx = i - 2 # include the comment block before it
        break

new_content = lines[:start_idx] + [
    "import { GlobeCanvas } from \"./hero/globe-canvas\";\n",
    "import { ConnectorCanvas } from \"./hero/connector-canvas\";\n",
    "import { EcosystemNode } from \"./hero/ecosystem-node\";\n\n"
] + lines[end_idx:]

with open(hero_file, "w") as f:
    f.writelines(new_content)
