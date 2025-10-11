---
description: Stop any running dev servers and start fresh
---

# Start Development Server

Clean up any existing dev server processes and start a fresh instance.

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

### 3. Start the dev server

```bash
npm run dev
```

Run in background with timeout 600000ms (10 minutes).

### 4. Report status

```
Development server started:
- Astro: http://localhost:4321/
- CMS: http://localhost:4321/admin/
```

## Important Notes

- Don't add waits or timeouts between killing and starting
- Just kill the processes then immediately start the server
- Use `//F` (not `-F`) for taskkill on Windows
- Use `findstr` (not `grep`) for Windows port checking
