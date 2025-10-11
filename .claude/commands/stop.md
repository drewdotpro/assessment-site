---
description: Stop all running dev servers
---

# Stop Development Server

Clean up all dev server processes without restarting.

## Steps

### 1. Kill any existing background shells running npm run dev

Check for running background bash shells and kill them:

```bash
# List any running background shells
# If any exist with "npm run dev", kill them using KillShell tool
```

### 2. Find and kill processes on ports 8081 and 4321

**Port 8081** (Decap CMS proxy server):

```bash
netstat -ano | findstr :8081
```

If any processes found, kill them:

```bash
taskkill //F //PID <PID>
```

**Port 4321** (Astro dev server):

```bash
netstat -ano | findstr :4321
```

If any processes found, kill them:

```bash
taskkill //F //PID <PID>
```

**Port 4322** (Alternate Astro port, if used):

```bash
netstat -ano | findstr :4322
```

If any processes found, kill them:

```bash
taskkill //F //PID <PID>
```

**Port 4323** (Another alternate Astro port, if used):

```bash
netstat -ano | findstr :4323
```

If any processes found, kill them:

```bash
taskkill //F //PID <PID>
```

### 3. Verify all processes stopped

Run port checks again to confirm no processes remain:

```bash
netstat -ano | findstr :8081
netstat -ano | findstr :4321
```

Both should return no results.

### 4. Report status

Provide clear status message:

```
Development server stopped successfully:
- All Astro dev server processes killed
- Decap CMS proxy server stopped
- Ports 8081 and 4321 are now free
```

If any processes couldn't be killed, report them clearly.

## Error Handling

- If processes can't be killed, report the PID and suggest manual intervention
- If ports show as in use by system processes, warn the user
- Check all common Astro ports (4321, 4322, 4323) in case of port conflicts

## Important Notes

- Always use `//F` (not `-F`) for taskkill on Windows
- Use `findstr` (not `grep`) for Windows port checking
- Background bash IDs can be found using /bashes command if needed
- Check multiple Astro ports as the server may have incremented due to conflicts