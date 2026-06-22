# ANBU DURGA R - Data Engineer Portfolio

This repository contains the source code for the professional portfolio website of ANBU DURGA R. It features a center-aligned modern grid layout, interactive stats, dynamic resume configurator (URL or file uploads), and a built-in serverless CMS backend powered by Vercel and the GitHub Contents API.

---

## Admin CMS Setup

The Admin Panel writes portfolio changes directly back to your GitHub repository by committing updates to `app/public/portfolio-data.json`. Follow these steps to configure the integration on Vercel:

### 1. Generate a GitHub Personal Access Token (PAT)
To allow Vercel to write changes back to your repository:
1. Go to your GitHub account: **Settings** > **Developer settings** > **Personal Access Tokens** > **Fine-grained tokens**.
2. Click **Generate new token**.
3. Name your token (e.g. `Portfolio CMS Token`) and set the expiration duration.
4. Under **Repository access**, select **Only select repositories** and choose `ANBUDURGA/PORTFOLIO-`.
5. Under **Permissions**, click **Repository permissions**:
   - Locate **Contents** and set it to **Read and write**.
6. Click **Generate token** and copy the generated token immediately.

### 2. Configure Vercel Environment Variables
Set the following environment variables (with **no** `VITE_` prefix) inside your Vercel Project Dashboard under **Project Settings** > **Environment Variables**:

| Variable | Description | Example / Value |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | The GitHub Fine-grained PAT generated in Step 1. | `github_pat_...` |
| `GITHUB_OWNER` | Your GitHub account username. | `ANBUDURGA` |
| `GITHUB_REPO` | The name of the portfolio repository. | `PORTFOLIO-` |
| `GITHUB_BRANCH` | The target branch for updates (defaults to `main`). | `main` |
| `ADMIN_PASSWORD` | The server-side password used to authorize commits. | *[Your custom secure password]* |

---

## Verification & Architecture Notes
- **Direct Local JSON Loader:** When loaded, the site queries `/portfolio-data.json` locally and caches it, ensuring sub-second load times.
- **Serverless GitHub Committer:** When you click save in the admin dashboard, Vercel initiates a secure transition with GitHub to update the repository database file, automatically triggering a Vercel redeployment to update the live site.