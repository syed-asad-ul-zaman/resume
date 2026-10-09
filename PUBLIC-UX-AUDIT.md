# Public Website UX Audit

- **Status:** Audit complete; recommendations have not been implemented.
- **Audience:** A future implementation session.
- **Scope:** Public portfolio/chat, readable pages, project details, CV, and
  persona/access routes; admin pages are out of scope.

## How to use this document

Fix P1 items first, then P2, then P3. Keep the existing visual system and
responsive typography unless a task explicitly requires a change. Treat each
acceptance check as a completion gate. Do not infer that a route or feature is
broken just because it is unavailable for the current persona.

### Priority

- **P1 — High:** Misleads visitors, hides an important destination, or damages
  confidence in the portfolio.
- **P2 — Medium:** Adds avoidable friction, repetition, or confusion.
- **P3 — Polish:** Improves clarity or feedback but has a reasonable workaround.

## Audit coverage and limitations

Reviewed the local public experience at `http://localhost:3000/`, including
`/about/`, `/experience/`, `/projects/`, project detail pages, `/skills/`,
`/contact/`, `/cv/`, and `/ask/` answers. Checked narrow and wide layouts,
shared headers, page content, the chat composer and suggestions, and the CV
toolbar. The contact form was inspected but not submitted.

The narrow browser run requested a 390px viewport, but the browser reported
`innerWidth=488` and a 470px document client width (the screenshot is still a
narrow/mobile presentation). This is enough to reproduce the clipped
navigation, but implementation must be verified at actual 320px, 360px, and
390px CSS widths. At the measured narrow size, the document itself did **not**
overflow horizontally: `scrollWidth` equaled `clientWidth`.

The current local persona is the legacy job portfolio. Its `/unlock/` route
returns 404 because access is open, and non-legacy persona section/document
pages are conditional on another persona. Those routes were inspected in
source but could not be visually tested with the current local persona. They
are explicitly marked for follow-up rather than reported as defects.

## Route-by-route observations

| Route/state | What the visitor sees | Audit note |
|---|---|---|
| `/` empty chat | Intro, question composer, five quick prompts plus More, and the topics menu. | The primary task is apparent. The mobile New chat icon is redundant while no conversation exists. |
| `/ask/about/` active answer | The selected question and answer, answer actions, follow-up links, and a persistent composer. | The answer URL updates on selection, so the share action can copy a deep link. The active New chat action is useful. |
| `/about/` | Profile, highlights, skills summary, and education. | Useful overview, but the full profile intro repeats across other routes. |
| `/experience/` | Chronological role history with dates, locations, bullets, and an onward CV/projects link. | Role content is clear; repeated profile/availability copy delays the first role on mobile. |
| `/projects/` | Project cards with names, stack summaries, and descriptions. | Cards are understandable, but their route identifiers do not match the current published project identities (DATA-01). |
| `/projects/[slug]/` | One project summary, technology tags, more-project links, and an Ask link. | Does not yet deliver the case-study depth promised from Experience (PROJECT-02); current cross-links also mix project identities (DATA-01). |
| `/skills/` | Grouped technology tags and a separate Cloud/DevOps section. | Grouping scans well; the Cloud/DevOps inventory is repeated without additional examples (SKILLS-01). |
| `/contact/` | Availability, direct contact/social methods, a CV link, and a message form. | The path to contact is clear; availability repeats, and required fields are not marked before submit. |
| `/cv/` | Standalone CV with Back to chat, Print, and Download PDF actions when a PDF is available. | Purpose and actions are clear; the phone toolbar uses short labels. |
| `/ask/[intent]/` | Deep-linked chat answer, with the same answer actions/composer as the active chat. | Project answers need the stable identity cross-check in DATA-01. |
| `/unlock/` | Not found for the current open-access persona. | Expected for this configuration; gated state requires a separate test persona. |
| Other persona `/<section>/` and document pages | Persona-specific sections/documents in a separate shared shell. | Source inspected only; verify with a safe non-legacy persona before changing the shared shell (DYNAMIC-01). |

## Findings

### NAV-01 — Important page links are clipped in the mobile header

- **Priority:** P1
- **Routes:** `/about/`, `/experience/`, `/projects/`, `/skills/`, `/contact/`

**Evidence:** The shared header uses a horizontally scrollable nav with its
scrollbar hidden (`src/components/site/site-shell.tsx:85-86`; the persona shell
uses the same pattern at `src/components/site/persona-shell.tsx:29-30`). On the
narrow run, the nav viewport was 206px while its content was 362px. The
Experience screenshot showed “Projects” clipped and “Contact” beyond the
visible area; there was no visible cue that the row could be swiped. This is
the reported “header scroll” behavior. It is an internal horizontal nav
overflow, not a page-wide horizontal scrollbar. The far-right vertical
scrollbar on long pages is normal page scrolling.

**Why it matters:** Visitors may not discover Contact or other pages, and a
clipped word looks like a layout defect rather than an intentional menu.

**Recommendation:** Keep the inline navigation at wide widths. At phone
widths, use a compact menu that exposes every destination, or another clearly
signposted pattern; do not rely on hidden horizontal scrolling.

**Acceptance checks:**

- At 320px, 360px, and 390px, every primary destination is fully visible or
  reachable through an obvious, labeled control.
- No page-wide horizontal overflow; no clipped navigation labels.
- Keyboard and screen-reader users can open, traverse, and close the mobile
  navigation.

### DATA-01 — Project slugs and project answers identify different work

- **Priority:** P1
- **Routes:** `/projects/`, `/projects/[slug]/`, `/ask/project-[slug]/`

**Evidence:** The project list associates each published CV entry with a
`src/content/projects.ts` ID by array position (`src/app/(site)/projects/page.tsx:65-66`).
The detail page uses that ID to select an entry from the published CV by its
index (`src/app/(site)/projects/[slug]/page.tsx:43-45`), and constructs the
related chat URL from the same slug at line 106. In the current local published
content:

| List entry | Link URL | Detail page title |
|---|---|---|
| AI-Powered Career Portfolio & Conversational Resume Agent | `/projects/medical-ai-support/` | AI-Powered Career Portfolio & Conversational Resume Agent |
| Healthstay.io - Multi-Tenant Medical Tourism Platform | `/projects/gasvisor-platform/` | Healthstay.io - Multi-Tenant Medical Tourism Platform |
| GasVisor - Smart CO2 Cylinder & Telemetry Management System | `/projects/scala-sports/` | GasVisor - Smart CO2 Cylinder & Telemetry Management System |

The detail page for `/projects/scala-sports/` links to an answer whose question
and opening copy are about Scala Sports but whose embedded project case is
GasVisor. This was observed in the rendered `/ask/project-scala-sports/` page.
The mismatch is in public content and cross-links, not just a cosmetic URL.
Published content can change independently of the fixed ID list, so positional
matching is fragile.

**Why it matters:** Visitors and search engines receive misleading URLs, and
the “Ask about it” journey can mix two different projects. This undermines
trust in the portfolio's most evidence-heavy content.

**Recommendation:** Give each published project a stable identifier/slug and
use it consistently for the list card, detail route, related-project links,
metadata, and matching chat question. Do not use array order to infer identity.
Review and correct the currently published project-to-answer content as part
of the fix.

**Acceptance checks:**

- Every project card's slug, detail H1, breadcrumb, canonical URL, related
  projects, and chat prompt all refer to the same project.
- Reordering, adding, or removing a project does not change another project's
  URL or content.
- Automated coverage checks all published projects, not only the first item.

### NAV-02 — The shared header does not identify the current page

- **Priority:** P3
- **Routes:** Readable portfolio and persona section pages

**Evidence:** Header links all receive the same visual classes, and no link
gets `aria-current`; the only current-page marker is in the lower breadcrumb
(`src/components/site/site-shell.tsx:85-87, 155`). The Experience screenshot
showed no selected state in the header.

**Why it matters:** Visitors returning to the top of a long page have less
orientation, especially after navigating from a project or scrolling.

**Recommendation:** Mark the active destination visually and with
`aria-current="page"` while keeping the state subtle and consistent with the
existing theme.

**Acceptance checks:**

- The active page is distinguishable in both themes and at mobile/desktop
  sizes.
- Exactly one matching primary-nav link has `aria-current="page"`.

### CONTENT-01 — Long profile and availability copy repeat across pages

- **Priority:** P2
- **Routes:** `/about/`, `/experience/`, `/projects/`, `/skills/`, `/contact/`

**Evidence:** About, Projects, and Skills use the full CV profile as their page
intro; Experience prepends that same profile with role and availability
(`src/app/(site)/experience/page.tsx:38,44`); Contact puts role, location, and
availability in its intro and repeats availability in a separate section
(`src/app/(site)/contact/page.tsx:23,43,71-77`). The shared shell may also show
availability in its sticky header.

**Why it matters:** The same biography consumes the first screen on pages
whose job is to show projects, skills, or experience. On Contact, the visitor
sees availability more than once before reaching the contact methods/form.

**Recommendation:** Write a short, page-specific introduction for each route.
Keep the full professional summary on About (and the CV); put availability in
one predictable place per page. Avoid joining unrelated facts into one
long sentence with separators.

**Acceptance checks:**

- Each page's opening copy explains that page's content rather than repeating
  the full CV profile.
- Contact availability appears once in the page content, with any header
  indicator serving a distinct, concise purpose.
- On a phone, the primary content (first role, first project, skills groups,
  or contact methods) is visible sooner without removing useful context.

### PROJECT-02 — “Case study” pages provide only a short overview

- **Priority:** P2
- **Routes:** `/projects/[slug]/`; linked from `/experience/`

**Evidence:** The Experience page calls these “projects and case studies”
(`src/app/(site)/experience/page.tsx:86-88`). A project detail page currently
renders a title, one summary paragraph, technology tags, and links to other
projects/chat (`src/app/(site)/projects/[slug]/page.tsx:58-106`). There is no
visible problem, contribution, outcome, or result section on the detail page.

**Why it matters:** A visitor following a case-study link gets little more
than the card they just left and cannot judge the candidate's specific
contribution or results.

**Recommendation:** Either make these genuine case studies using accurate,
maintained project content (context/problem, personal contribution, outcomes,
and relevant stack), or call them project overviews and set expectations
accordingly. Do not fill the gap by rendering unrelated static project data;
resolve DATA-01 first.

**Acceptance checks:**

- Each detail page adds meaningful, project-specific information beyond its
  list-card summary, or the site no longer promises a case study.
- Every outcome is attributable and consistent with the matching project.
- Mobile reading order is clear and the chat/next-project actions remain
  secondary to the project content.

### SKILLS-01 — Cloud/DevOps technologies are repeated without new context

- **Priority:** P2
- **Route:** `/skills/`

**Evidence:** The page first renders every skill group as tags, then selects
the Cloud/DevOps group and repeats its same values under “Cloud and DevOps in
practice” (`src/app/(site)/skills/page.tsx:39,47,63-69`). The second section
does not currently add examples of how those skills were used.

**Why it matters:** It increases page length while promising “in practice”
examples that the section does not provide.

**Recommendation:** Keep one concise skills inventory. Replace the repeated
Cloud/DevOps list with a small number of evidence-backed examples linked to
experience/projects, or remove the second section if no examples are available.

**Acceptance checks:**

- The same technology inventory is not repeated in two formats.
- Any section labeled “in practice” contains concrete, attributable examples.
- All skills remain readable and navigable on a narrow screen.

### FORM-01 — Required contact fields are not visually marked

- **Priority:** P2
- **Route:** `/contact/`

**Evidence:** Name, email, and message are required in the form, but their
visible labels do not say “required” or use a defined required marker; Company
is explicitly marked optional (`src/components/blocks/forms.tsx:131-176`).

**Why it matters:** A visitor cannot tell which fields are mandatory until
after trying to submit. The form already has inline validation, so this is an
avoidable surprise.

**Recommendation:** Mark required fields consistently and explain the marker
once. Keep Company labeled optional. Preserve the existing inline errors and
focus-first-error behavior.

**Acceptance checks:**

- Required/optional status is clear before typing and is available to assistive
  technology.
- Blank submission still focuses the first invalid field and shows a specific
  error beside each invalid field.

### CHAT-01 — The mobile “New chat” pen is redundant on the landing state

- **Priority:** P2
- **Routes:** `/` and `/ask/[intent]/` on mobile

**Evidence:** The mobile header always renders an icon-only SquarePen button
with the accessible label “New chat” (`src/components/shell/top-bar.tsx:52-54`).
The empty landing state already shows the composer, question suggestions, and
a “More” action (`src/components/chat-app.tsx:303-312`); the same button resets
the conversation and focuses the composer.

**Why it matters:** On the empty state it duplicates the obvious primary
action, while a pen icon alone does not clearly communicate its purpose during
an active conversation.

**Recommendation:** Hide the header action when the conversation is empty.
Keep a clearly identified “New chat” action while a conversation is active;
retain its accessible name and provide visible text/tooltip feedback for
pointer users where practical.

**Acceptance checks:**

- No redundant New chat control appears on the empty landing state.
- During an active conversation, the action is discoverable, named for sighted
  and screen-reader users, and starts a fresh conversation as expected.
- The desktop sidebar action remains consistent with the mobile behavior.

### CHAT-02 — Copy-link failure has no user feedback

- **Priority:** P3
- **Routes:** Chat landing and answer pages

**Evidence:** The share action copies `window.location.href`, briefly shows a
success icon, and silently ignores clipboard errors
(`src/components/shell/top-bar.tsx:27-36,48`). The successful case is
context-appropriate after a question: selecting “About me” navigated to
`/ask/about/`, so the answer URL is copied.

**Why it matters:** When clipboard access is denied or unavailable, the button
does nothing visible and the visitor cannot tell whether the link was copied.

**Recommendation:** Keep the current successful behavior; on failure, provide
an accessible status with a useful next step (for example, select and copy the
URL manually). Do not report success unless copying succeeded.

**Acceptance checks:**

- Clipboard success produces a short announced confirmation.
- Clipboard denial/unavailability produces a visible and announced fallback.
- The copied URL reproduces the answer currently shown.

## Conditional routes: verify before implementation

### DYNAMIC-01 — Other-persona and gated pages need a real persona test

- **Status:** Unverified, not a confirmed issue
- **Routes:** Dynamic `/<section>/`, document page, and `/unlock/`

**Evidence:** `/unlock/` correctly returns 404 for the current open-access
persona. Dynamic readable pages use `PersonaShell` and a different set of
published sections; gated document content and request-access UI only appear
for a persona configured with gated access.

**Next step:** Before changing these shared surfaces, use a safe non-production
persona with at least one readable section, one document page, and one gated
section. Check mobile navigation, language/theme controls, print/download,
locked-state copy, and the access-request journey. Do not use a real access
code or submit a real access request during the audit.

## Implementation task tracker

No UI/code fixes were made during this audit.

| ID | Priority | Task | Status | Depends on |
|---|---|---|---|---|
| T1 | P1 | Replace the clipped mobile page navigation with a discoverable pattern. | Open | T10 before changing the shared persona navigation |
| T2 | P1 | Give projects stable IDs and align cards, detail pages, canonical URLs, related links, and chat answers. | Open | Review current published project/answer data |
| T3 | P2 | Replace repeated CV-profile introductions with concise, page-specific copy and remove duplicate availability. | Open | — |
| T4 | P2 | Add accurate case-study evidence or relabel project detail pages as overviews. | Open | T2 |
| T5 | P2 | Remove repeated Cloud/DevOps inventory or replace it with genuine examples. | Open | — |
| T6 | P2 | Mark required contact fields before submission while preserving inline validation. | Open | — |
| T7 | P2 | Hide New chat on the empty state and clarify it during active chats. | Open | — |
| T8 | P3 | Add accessible clipboard failure feedback and a fallback instruction. | Open | — |
| T9 | P3 | Add visual and semantic current-page state to shared primary navigation. | Open | T10 before changing the shared persona navigation |
| T10 | — | Audit one non-legacy persona and a gated-access flow at mobile and desktop widths. | Open | Safe test persona/access setup |

## Best-practice checklist for the implementation pass

- Keep one clear primary action per state; label controls by their outcome.
- Prefer visible, understandable navigation over hidden overflow.
- Keep URLs, displayed project identity, structured metadata, and related chat
  answers in sync using stable identifiers.
- Make long public pages scannable with page-specific introductions and
  evidence-backed sections.
- Show required form expectations before submission; retain inline errors and
  visible focus.
- Re-test keyboard access, reduced motion, both themes, and real narrow
  viewport widths after implementation.
