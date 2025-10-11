---
description: Stop any running dev servers and start fresh
---

# Start Development Server

Clean up any existing dev server processes and start a fresh instance.

## Steps

### 1. Kill any existing background shells

Check for running background bash shells and kill them using KillShell tool.

### 2. Free up ports

```bash
npx kill-port 4321 8081
```

### 3. Start the dev server

```bash
npm run dev:assessments
```

Run in background with timeout 600000ms (10 minutes).

### 4. Report status

```
Development server started:
- Astro: http://localhost:4321/
- CMS: http://localhost:4321/admin/
```

## Notes

- The `predev:*` hooks automatically kill ports before starting
- Use this command to force a fresh start
