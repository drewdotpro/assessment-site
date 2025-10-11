---
description: Stop all running dev servers
---

# Stop Development Server

Clean up all dev server processes without restarting.

## Steps

### 1. Kill any existing background shells

Check for running background bash shells and kill them using KillShell tool.

### 2. Kill processes on ports 8081 and 4321

Check and kill port 8081 (Decap CMS proxy server):

```bash
netstat -ano | findstr :8081
taskkill //F //PID <PID>
```

Check and kill port 4321 (Astro dev server):

```bash
netstat -ano | findstr :4321
taskkill //F //PID <PID>
```

Also check alternate ports if needed (4322, 4323):

```bash
netstat -ano | findstr :4322
netstat -ano | findstr :4323
```

### 3. Report status

```
Development server stopped:
- All processes killed
- Ports 8081 and 4321 are free
```

## Important Notes

- Just kill the processes, no waiting or verification needed
- Use `//F` (not `-F`) for taskkill on Windows
- Use `findstr` (not `grep`) for Windows port checking
