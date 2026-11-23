# AI Teacher — Full User Requirements (source of truth)

Status: Requirements captured; implementation and deployment verification are separate tasks.

## Preserve existing app
- Do not break existing AI Teacher Live Voice, existing AI voice/system (no extra TTS or assistant), Kore Voice, teaching/learning features, profile flow, current design, and existing app behavior.
- The app already asks users conversationally for name and class. Persist those details and show them in Admin without changing that interaction.
- Maintain Chand Admin identity security and 6-digit password verification (existing password flow; never bypass it).
- Admin Panel UI must have titles only: no descriptions, subtitles, or extra explanatory text beside sections, titles, buttons, or popups.
- Mobile-friendly, usable controls.

## Admin dashboard
- Show totals: total users, online, offline, blocked.
- Show student/user records.
- Each record/details view includes name, class, device ID, language, first/last use/activity, sessions, lessons/topics and available usage/activity history.
- Keep separate student records when multiple students use a device.

## User management
- Block and unblock users; blocked users must be denied app access.
- Show blocked users separately.
- Permanent delete with explicit confirmation; remove the relevant user data according to the delete action.
- Keep per-user controls and details.

## Download button control
- Hide/show Download button globally.
- Hide/show Download button per user, including users who have already downloaded/installed the app.
- Persist these settings server-side.

## Ads management
- Admin can add, edit, delete ads.
- Enable/disable ads.
- Target ads to all users, a class, selected users, or a single user.
- Disable ads for a particular user.
- Record and display ad impression/analytics data where available.

## Name/profile changes and multi-student handling
- For both voice and manual name changes, present Keep / Delete / Add confirmation.
- AI Teacher must explain the choices aloud before/when showing the popup.
- Keep: old name/profile remains; reject proposed change.
- Delete: replace old profile/name with proposed one and remove previous-name record as intended.
- Add: retain old student and append new student without duplicates.
- If no choice, old profile remains unchanged.
- Store separate name, class, role/language and device associations for multiple students.
- Chand/Admin identity changes must not bypass verified 6-digit password security.

## Persistence/deployment
- Persist user, block, download-control, ad and analytics/configuration data on backend/database; it must survive app/server restart and deployments.
- Avoid ephemeral deployment filesystem for persistent data; use a persistent DB/storage.
- Ensure APIs enforce admin permissions server-side, not UI-only.

## Verification required before calling complete
- Build succeeds.
- Deployment succeeds on intended production host(s), Render and Vercel as applicable.
- Live voice input/output works on Vercel and Render.
- Test multiple students (2–3), manual and voice name-change flows Keep/Delete/Add and no-choice behavior.
- Verify Admin authentication, user details, block/unblock, confirmed delete, global/per-user Download controls, ads targeting/disable/analytics, persistence after restart/deploy.
- Check existing AI/voice/teaching/profile features remain functional.
- Do not claim a feature or deployment is complete until it has been actually tested.
