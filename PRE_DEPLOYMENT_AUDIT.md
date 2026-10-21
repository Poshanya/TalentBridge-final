# TalentBridge pre-deployment audit

## Changes applied

- Replaced wildcard CORS with an allowlist controlled by `APP_CORS_ALLOWED_ORIGINS`; disabled cross-origin cookie credentials because the frontend sends JWTs in the Authorization header.
- Removed the embedded JWT secret fallback. `JWT_SECRET` and `DB_PASSWORD` must be supplied through environment variables.
- Added `PORT` and `DDL_AUTO` configuration; disabled verbose Hibernate SQL output by default.
- Tightened route authorization, including protecting recruiter-only job listings and closing broad user/application/candidate/recruiter listing endpoints until an admin/privacy model exists.
- Generic response for unexpected server errors and consistent login failure messages.
- Added a database uniqueness constraint for one application per candidate/job pair.
- Added environment-variable examples and deployment notes.

## Verification limitation

A fresh build could not be completed in this environment. The included `node_modules` lacks platform-specific native optional bindings for Vite/Rolldown and Oxlint, and the Maven Wrapper could not download Maven because network access was unavailable. Do not interpret this audit as proof that the patched source compiles or that all tests pass. The bundled Surefire reports show 4 tests passed in a previous run, but they predate these changes.

## Verify locally before deployment

### Frontend

```bash
cd frontend
npm ci
npm run build
npm run lint
```

### Backend (PowerShell)

Use Java 17 or newer. Set these values in your PowerShell session first; replace sample values with your own secrets.

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/talentbridge?createDatabaseIfNotExist=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_LOCAL_MYSQL_PASSWORD"
$env:JWT_SECRET="YOUR_BASE64_ENCODED_RANDOM_SECRET_OF_AT_LEAST_32_BYTES"
$env:APP_CORS_ALLOWED_ORIGINS="http://localhost:5173"
$env:DDL_AUTO="update"
.\mvnw.cmd test
```

`JWT_SECRET` must be Base64 because the application decodes it before creating the signing key. Generate at least 32 random bytes and Base64-encode them. Never commit real values to Git.

## Deployment notes

- A cloud backend cannot connect to `localhost` on your laptop. Migrate the schema/data you need to a hosted MySQL database and set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` on the backend host.
- Set a private random Base64 `JWT_SECRET` on the backend host.
- Set `APP_CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin, without a trailing slash (for example `https://your-app.example`).
- Set frontend `VITE_API_URL` to the deployed backend base URL, with no trailing slash. This is public configuration, not a secret.
- `DDL_AUTO=update` is convenient for the first demo deployment but is not a substitute for migrations. After schema creation, use `validate` and a migration tool for future changes.
- Before applying the new unique constraint to an existing database, check for and remove duplicate `(candidate_profile_id, job_id)` application rows; schema update can fail if duplicates already exist.
- Test candidate and recruiter authorization using separate accounts before making the site public.
