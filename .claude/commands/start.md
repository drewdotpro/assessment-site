---
description: Stop any running dev servers and start fresh
---

# Start Development Server

Clean up any existing dev server processes and start a fresh instance.

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

### 3. Start fresh dev server

```bash
npm run dev
```

Run in background with timeout 600000ms (10 minutes).

### 4. Wait and verify

Wait a few seconds, then check output to verify both services started:

- Decap CMS Proxy Server listening on port 8081
- Astro dev server ready on port 4321

### 5. Report status

Provide clear status message:

```
Development server started successfully:
- Astro dev server: http://localhost:4321/
- CMS: http://localhost:4321/admin/
- Decap proxy: port 8081
```

If any issues, report them clearly.

## Error Handling

- If ports are still in use after killing processes, wait 2 seconds and try again
- If processes can't be killed, report the error and suggest manual intervention
- If server fails to start, check the output for error messages and report them

## Important Notes

- Always use `//F` (not `-F`) for taskkill on Windows
- Use `findstr` (not `grep`) for Windows port checking
- Background bash IDs can be found using /bashes command if needed
- The npm run dev command starts BOTH Astro dev server AND CMS proxy concurrently
