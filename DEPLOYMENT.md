# GitHub Pages Deployment

This folder is ready for a free public GitHub Pages deployment.

## 1. Create the GitHub repo

Create a new public repository on GitHub. Example name:

```text
metkapps
```

Do not initialize it with a README, license, or gitignore.

## 2. Push this folder

Replace `YOUR_USERNAME` with your GitHub username:

```bash
cd /Users/tarekhalifa/Downloads/metkapps
git init
git add .
git commit -m "Initial METK site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/metkapps.git
git push -u origin main
```

## 3. Enable GitHub Pages

In the GitHub repo:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

The workflow in `.github/workflows/pages.yml` will build and publish the site automatically.

## 4. Connect your domain

In the GitHub repo:

```text
Settings -> Pages -> Custom domain
```

Enter your domain and save it.

Then update DNS in GoDaddy using GitHub's Pages records:

```text
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153
CNAME www    YOUR_USERNAME.github.io
```

After DNS verifies in GitHub Pages settings, enable:

```text
Enforce HTTPS
```
