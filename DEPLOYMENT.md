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

A `.github/workflows/ci.yml` file is included to automatically build and lint your code on every push to `main`. This ensures that only valid code is deployed.

### Continuous Deployment (CD) with PaaS

For the easiest "Push to Deploy" experience, we recommend using a PaaS provider like **Railway** or **Render**.

#### Railway.app (Recommended)

1.  **Sign Up/Login**: Go to [Railway.app](https://railway.app/) and log in with GitHub.
2.  **New Project**: Click "New Project" -> "Deploy from GitHub repo".
3.  **Select Repo**: Choose your `expense` repository.
4.  **Configuration**: Railway will automatically detect the `Dockerfile`.
5.  **Variables**: Go to the "Variables" tab and add your environment variables (`DB_HOST`, `DB_PASSWORD`, etc.).
    *   *Tip*: You can also add a MySQL plugin directly in Railway and link it to your project.
6.  **Deploy**: Railway will automatically deploy. Future pushes to `main` will trigger a redeploy.

#### Render.com

1.  **New Web Service**: Go to [Render](https://render.com/) -> "New" -> "Web Service".
2.  **Connect Repo**: Connect your GitHub account and select the repo.
3.  **Runtime**: Select "Docker".
4.  **Environment**: Add your environment variables in the "Environment" section.
5.  **Create**: Click "Create Web Service". Render will watch your branch and auto-deploy on push.

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
