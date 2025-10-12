---
description: Update technical documentation after completing a task
---

# Documentation Update Command

You are being run AFTER a task has been completed in this session. Your job is to ensure all technical documentation remains accurate and up-to-date for future Claude sessions.

## Step 1: Analyze What Was Done

**CRITICAL**: Review the **ENTIRE SESSION** from the very beginning, not just recent conversation since the last compaction.

**How to find the full session history:**
- Look for plan documents in the `temp/` folder (e.g., `temp/*-PLAN.md`) that may have been created at session start
- Check the conversation summary that appears after compaction - it contains the full session history
- Review ALL file changes made during the session, not just recent ones
- If unsure about session start, ask the user: "Did this session start with earlier work before compaction?"

Review the complete conversation history and identify:

1. **What was the end result?** (Not the journey, but what now exists or changed)
   - New pages added?
   - New components created?
   - Configuration changes?
   - CMS collections added/modified?
   - Colour system changes?
   - Architecture changes?
   - Accessibility features added?
   - Major refactoring or reorganisation?

2. **What files were created or modified?**
   - List all new files created during the session
   - List all modified files throughout the session
   - Understand the purpose of each change
   - Check for deleted files (obsolete components removed)

3. **What was the original plan or intent?**
   - Look for plan documents in `temp/` folder
   - Understand the full scope of what was implemented
   - Identify which planned features were completed vs. placeholder UI

## Step 2: Map Changes to Documentation Files

Determine which documentation files in `technical-docs/` need updating:

| Change Type               | Documentation File   | Update When...                                                             |
| ------------------------- | -------------------- | -------------------------------------------------------------------------- |
| New pages, routes         | **WEBSITE.md**       | Pages added, routes changed, CMS collections modified, navigation updated  |
| New/modified components   | **CHEATSHEET.md**    | Components added, component props changed, usage patterns changed          |
| Colour/theme changes      | **COLOURS.md**       | Colours added/changed, dark mode modified, theme system updated            |
| Config/build/architecture | **ARCHITECTURE.md**  | Configuration changed, build system modified, directory structure changed  |
| CMS changes               | **CMS.md**           | CMS collections added, editorial workflow changed, authentication modified |
| Accessibility changes     | **ACCESSIBILITY.md** | Fonts added, WCAG features implemented, accessibility features changed     |

**IMPORTANT - Documentation Boundaries and Single Source of Truth:**

Each documentation file has a defined scope. **Never duplicate information** across files. Use cross-references instead:

- **Multi-site architecture** → ARCHITECTURE.md only (CMS.md and WEBSITE.md reference it)
- **Environment variables** → ARCHITECTURE.md only (don't duplicate in Build & Deployment section)
- **Dark mode implementation** → COLOURS.md only (ACCESSIBILITY.md explains user benefits + references COLOURS.md)
- **Blog system technical details** → ARCHITECTURE.md (WEBSITE.md describes content structure)
- **Content collection schemas** → ARCHITECTURE.md (WEBSITE.md describes what collections control)
- **Image optimization** → CMS.md (ARCHITECTURE.md brief mention only)
- **Editorial workflow** → CMS.md only (WEBSITE.md references it)

When content could fit in multiple docs, ask yourself:

1. Which doc is the "single source of truth" for this information?
2. Can other docs reference it instead of duplicating it?

**Always use cross-references like:** "For complete details, see [FILENAME.md](./FILENAME.md#section)"

## Step 3: Update Relevant Documentation

For EACH relevant documentation file:

1. **Read the entire file** to understand current structure and content
2. **Identify where the update belongs** (which section)
3. **Add or update information**:
   - Be specific and accurate
   - Include file paths with line numbers where relevant
   - Use British English spelling
   - Follow the existing format and style of the file
   - Add code examples if relevant
4. **Update "Last Updated" date** at bottom of file to today's date (format: YYYY-MM-DD)

### Documentation File Formats

**WEBSITE.md**: Content-focused, describes WHAT exists and WHERE to find it

- Update page tables with new routes
- Add new CMS collections to the CMS section
- Update navigation structure if changed
- Keep focused on what content editors need to know

**CHEATSHEET.md**: Implementation-focused, HOW to use components

- Add component with import statement
- List all props with types and defaults
- Include usage example
- Note any special behaviour or requirements

**COLOURS.md**: Design system-focused, colour architecture

- Document new colour variables
- Update RGB value tables
- Add usage examples
- Include both light and dark mode values

**ARCHITECTURE.md**: Architecture-focused, technical structure

- Update directory structure if changed
- Document configuration changes
- Update build/deployment info
- Keep technically detailed

**CMS.md**: Workflow-focused, content management processes

- Document new collection types
- Update workflow information
- Add configuration examples
- Include troubleshooting if relevant

**ACCESSIBILITY.md**: Compliance-focused, accessibility features

- Document new accessibility features
- Update font system if changed
- Include WCAG compliance notes
- Add testing procedures if relevant

## Step 4: Handle Changes That Don't Fit Existing Docs

If the changes don't logically fit into any existing documentation file:

1. **Create a new documentation file** in `technical-docs/`
   - Use a clear, descriptive filename (e.g., `AUTHENTICATION.md`, `API.md`, `TESTING.md`)
   - Follow the structure of existing docs:
     - Title
     - Brief introduction
     - Table of Contents
     - Detailed sections
     - "Last Updated" date at bottom
   - Write in British English
   - Be comprehensive but concise

2. **Update CLAUDE.md** to reference the new documentation:
   - Add entry to the "Quick Reference: Where to Find Information" table
   - Add to "Documentation Structure" section under "Maintaining Documentation"
   - Add to "Documentation Philosophy" list

3. **Git add the new file**:
   ```bash
   git add technical-docs/NEWFILE.md
   ```

## Step 5: Optionally Update CLAUDE.md

Only update CLAUDE.md if:

- You created a new documentation file (REQUIRED - add references as described above)
- New development workflows or commands were added (e.g., new npm scripts)
- New development tools were integrated (e.g., new MCP servers)
- The guidance on WHERE to find information needs updating

DO NOT update CLAUDE.md for:

- Implementation details (those go in technical-docs/)
- Content changes (those are documented in WEBSITE.md)
- Component details (those are documented in CHEATSHEET.md)

## Step 6: Git Add New Documentation Files

If you created any new documentation files:

```bash
git add technical-docs/NEWFILE.md
```

If you updated CLAUDE.md:

```bash
git add CLAUDE.md
```

DO NOT commit - just stage the files. The user will review and commit.

## Step 7: Provide Summary

After completing all updates, provide a clear summary to the user:

```markdown
## Documentation Updated

**Files updated:**

- technical-docs/WEBSITE.md - Added Credits page to all relevant sections
- technical-docs/COLOURS.md - Updated with new accent colour

**Files created:**

- technical-docs/AUTHENTICATION.md - New documentation for auth system
- Updated CLAUDE.md to reference new authentication docs

**Files staged for commit:**

- technical-docs/AUTHENTICATION.md
- CLAUDE.md

**Next steps:**
Review the documentation changes and commit when ready.
```

## Important Guidelines

1. **Be thorough**: Check ALL potentially affected documentation files
2. **Be accurate**: Base updates on actual implementation, not assumptions
3. **Be consistent**: Match the style and format of existing documentation
4. **Be specific**: Include file paths, line numbers, and code examples where helpful
5. **Think forward**: Write documentation that will be useful to future Claude sessions
6. **Don't guess**: If unsure about something, note it in your summary for the user to verify
7. **NEVER reference temp folder**: The `temp/` folder contains temporary working files that are not tracked by git and will be deleted. Never create cross-references to files in `temp/` from permanent documentation. All important information must be documented in `technical-docs/` instead.

## Quality Checklist

Before finishing, verify:

- [ ] All relevant technical-docs/ files have been updated
- [ ] Updates are accurate based on what was actually implemented
- [ ] British English spelling used throughout
- [ ] "Last Updated" dates updated
- [ ] New files added to git (if created)
- [ ] CLAUDE.md updated if new doc files created
- [ ] **No information is duplicated across multiple files** (use cross-references instead)
- [ ] Each piece of information has a single source of truth
- [ ] Scope statements exist at the top of each file (after intro, before TOC)
- [ ] Cross-references use proper markdown links to specific sections
- [ ] Clear summary provided to user

Remember: Your goal is to ensure the next Claude session has accurate, complete documentation to work with. Take the time to do this thoroughly.
