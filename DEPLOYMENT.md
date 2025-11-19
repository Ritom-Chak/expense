# Deployment Guide

This project is a NestJS application containerized with Docker, making it easy to deploy to various platforms.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your machine or server.
- A MySQL database (if not running via Docker Compose).

## Option 1: Docker (Recommended)

The project includes a multi-stage `Dockerfile` optimized for production.

### 1. Build the Image

```bash
docker build -t expense-backend .
```

### 2. Run the Container

You need to provide environment variables for the database connection. Create a `.env` file or pass them directly.

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name expense-backend \
  expense-backend
```

Ensure your `.env` file contains necessary variables (e.g., `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`).

## Option 2: Docker Compose

If you have a `docker-compose.yml` file, you can spin up the backend and the database together.

```bash
docker-compose up -d
```

## Option 3: Cloud Providers

### Railway / Render / Heroku

1.  Connect your GitHub repository.
2.  These platforms usually auto-detect the `Dockerfile`.
3.  Add a MySQL database service within the platform.
4.  Set environment variables (`DB_HOST`, etc.) to point to the managed database.

### DigitalOcean / AWS EC2 (VPS)

1.  Provision a server (Droplet/EC2).
2.  Install Docker & Docker Compose.
3.  Clone the repo.
4.  Run `docker-compose up -d --build`.

## Environment Variables

Make sure the following variables are set in your production environment:

- `PORT` (defaults to 3000)
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`
- `JWT_SECRET` (if using JWT)

## Automated Deployment (CI/CD)

### GitHub Actions (CI)

A `.github/workflows/ci.yml` file is included to automatically build and lint your code on every push. This ensures that only valid code is deployed.

### Continuous Deployment (CD) with Cloud Providers

For a "Push to Deploy" experience on major cloud providers, we recommend **AWS App Runner** or **Google Cloud Run**. These services handle container orchestration and scaling automatically.

#### Option 1: AWS App Runner (Recommended for AWS)

AWS App Runner is the easiest way to deploy containerized web applications on AWS.

1.  **Console**: Go to the [AWS App Runner Console](https://console.aws.amazon.com/apprunner).
2.  **Create Service**: Click "Create service".
3.  **Source**: Select "Source code repository" and connect your GitHub account.
4.  **Repo**: Select `expense` and the branch `main` (or `rel-v1.0.0`).
5.  **Deployment Settings**: Choose "Automatic" to deploy on every push.
6.  **Build Settings**:
    - **Runtime**: Select "Node.js 18".
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm run start:prod` (ensure this script exists in package.json, or use `node dist/main.js`)
    - *Alternative*: You can also choose "Source image" if you push your Docker image to ECR, but "Source code" is easier.
7.  **Variables**: Add your environment variables (`DB_HOST`, `DB_PASSWORD`, etc.) in the "Configuration" step.
8.  **Create**: Click "Create & deploy".

**Custom Domain on AWS:**
1.  Go to your App Runner service -> "Custom domains".
2.  Add your domain (e.g., `api.example.com`).
3.  AWS will provide CNAME records. Add these to your DNS provider (Route53, GoDaddy, etc.).
4.  Certificate validation and SSL setup are automatic.

#### Option 2: Google Cloud Run (Recommended for GCP)

1.  **Console**: Go to [Google Cloud Run](https://console.cloud.google.com/run).
2.  **Create Service**: Click "Create Service".
3.  **Source**: Click "Continuously deploy new revisions from a source repository".
4.  **Cloud Build**: Click "Set up with Cloud Build".
    - Connect your GitHub repository.
    - Select the branch.
    - **Build Type**: Select "Dockerfile" (it will use the one in your repo).
5.  **Authentication**: Allow unauthenticated invocations (so it's public).
6.  **Variables**: Expand "Container, Variables & Secrets" -> "Variables" tab to add `DB_HOST`, etc.
7.  **Create**: Click "Create". Cloud Build will build your Docker image and deploy it to Cloud Run.

**Custom Domain on GCP:**
1.  Go to "Manage Custom Domains" in the Cloud Run console.
2.  Click "Add Mapping".
3.  Select your service and domain.
4.  Add the provided DNS records to your domain registrar.

## Custom Domain Setup

Once your application is deployed on a PaaS, you can map it to your own domain (e.g., `api.yourdomain.com`).

### 1. Configure Provider

**Railway:**
- Go to your project settings -> "Domains".
- Click "Custom Domain" and enter your domain (e.g., `api.example.com`).
- Railway will provide a DNS record (usually a CNAME) to configure.

**Render:**
- Go to "Settings" -> "Custom Domains".
- Add your domain.
- Render will show the necessary DNS records (A record or CNAME).

### 2. Configure DNS (Domain Registrar)

Log in to where you bought your domain (GoDaddy, Namecheap, Cloudflare, etc.).

1.  **Find DNS Settings**: Look for "DNS Management" or "Name Servers".
2.  **Add Record**:
    - **Type**: `CNAME` (usually)
    - **Name/Host**: `api` (if using `api.example.com`) or `@` (if using `example.com`)
    - **Value/Target**: The URL provided by Railway/Render (e.g., `expense-production.up.railway.app`).
    - **TTL**: Default or Automatic.
3.  **Save**: It may take a few minutes to 48 hours for propagation.

Once verified, your API will be accessible at `https://api.yourdomain.com`. SSL certificates are usually provisioned automatically by the PaaS provider.
