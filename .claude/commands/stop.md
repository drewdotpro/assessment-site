---
description: Stop all running dev servers and clean up ports
---

# Stop Development Servers

Cleanly stop all running dev servers and free up ports.

## Steps

1. Kill any existing background shells using KillShell tool
2. Free up ports: `npx kill-port 4321 8081`
3. Confirm: "All dev servers stopped. Ports 4321 and 8081 are now free."
