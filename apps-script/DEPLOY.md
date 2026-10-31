# TTP online application + tour backend — deploy steps
Files: `Code.gs`, `Print.html` (this folder). Website side: `site-config.js` in zialcita/toddler-program-preview.
Nothing here is deployed yet. Do these steps only after Martin confirms the target sheet. Private family data: keep the sheet unshared.

## Choose the target sheet

### Option A: native Google Sheet copy of Becky's "2026-2027 Applicants.xlsx" (new tab only)
1. Open Drive file `1yXimb7vyoQe3faEVT5OgDpo9HQYcdA9-`, then **File > Save as Google Sheets**. This makes a NEW native copy; the .xlsx stays as it is.
2. Rename the copy, for example "2026-2027 Applicants (Google Sheet)". Leave sharing as it is (private).
3. Don't edit any existing tab. The script only creates and writes **Online Applications** and **Tour Requests**.
4. Copy the Sheet ID from the URL (`/spreadsheets/d/<ID>/edit`).
5. Note: Becky's future edits to the .xlsx won't sync to the copy. She should work from the Google Sheet from now on, or use Option B.

### Option B: fresh sheet in a "Toddler Program" Drive folder
1. In Drive, create or open the folder **Toddler Program**, then **New > Google Sheets**, named "TTP Website Submissions".
2. Keep it private. Copy the Sheet ID from the URL.

## Install the script (both options)
1. Open the target Sheet > **Extensions > Apps Script**.
2. Replace `Code.gs` with this folder's `Code.gs`. Then **+ > HTML**, name it `Print` (it becomes Print.html), and paste in `Print.html`. Save.
3. **Project Settings > Script properties**, add:
   - `SPREADSHEET_ID` = the Sheet ID
   - `PRINT_KEY` = a long random string (for example 32+ characters from a password manager). Store it only in the password vault.
   - `GHL_ENABLED` = `false`. Leave it false: the TTP GHL sub-account is blocked by the plan limit.
   - (optional, later) `GHL_WEBHOOK_URL`
4. Run `setup` once from the editor and approve the permissions. This creates the two tabs with headers. **Online Applications** has Timestamp, ID, Status ("Pending review"), Fee status ("Unpaid"), and then the form fields.
5. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**, so parents can submit without a Google login. Copy the `/exec` URL.

## Switch the preview on
1. In `site-config.js` set `backendUrl: "<exec URL>"`, commit and push.
2. Both forms use it: apply.html (`type: application`) and the home-page tour form (`type: tour`). The mailto fallback for tours is used only while backendUrl is "".

## Print one application
`<exec URL>?id=APP-YYYYMMDD-XXXXXX&key=<PRINT_KEY>` opens one application per page, with a Print button. Without the right key it shows "Not authorized." Don't paste this link anywhere public.

## TEST-entry procedure (required, use no real names)
1. On the preview's apply.html, fill every required field with obvious values: child name `TEST – DELETE`, parent `TEST – DELETE`, email `test-delete@example.com`, phones `000-000-0000`, address `TEST – DELETE`, zip `00000`, emergency contact `TEST – DELETE`. Choose "Pay by check". Wait at least 5 seconds before submitting (time trap).
2. Confirm the success screen. Confirm one row appears in **Online Applications** with Status "Pending review" and Fee status "Unpaid".
3. Open the print URL for that ID and check that it renders and prints.
4. Submit the home-page tour form with name `TEST – DELETE` and confirm a row appears in **Tour Requests**.
5. **Delete both TEST rows** (right-click the row number > Delete row). Don't delete the header row.

## Updating later
Deploy > Manage deployments > Edit > Version: New version. The URL stays the same.
