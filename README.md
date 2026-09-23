# Busy Bee Lawn — homepage concept

A proposal preview of a new homepage for Busy Bee Lawn (Murfreesboro, Smyrna, and
Christiana, TN). Built with React and Vite.

Intended URL: https://productoffer.jamesmcgonigal.com

> **The quote form is a preview.** It validates input and walks through all three
> steps, but it never sends or stores an inquiry. The page says so next to the form.

## Run locally

Requires Node.js 18.18 or newer.

```sh
npm install
npm run dev        # http://localhost:5190
npm run build      # production build → dist/
npm run preview    # serve the build → http://localhost:5191
```

Business copy, services, portfolio items, and team details live in `src/content.js`.

## Connect the GitHub repository

After creating the empty repository on GitHub (no README, license, or .gitignore):

```sh
git init
git add .
git commit -m "Initial commit: Busy Bee Lawn proposal site"
git branch -M main
git remote add origin https://github.com/JamesMac3/Busybee.git
git push -u origin main
```

## Publish with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every
   push to `main`. You can also run it from the **Actions** tab (**Run workflow**).
3. Under **Custom domain**, enter `productoffer.jamesmcgonigal.com` and click **Save**.
   The domain is also committed in `public/CNAME`, so each build keeps it.

### DNS

At your DNS provider for `jamesmcgonigal.com`, add:

| Type  | Name           | Target / value         |
| ----- | -------------- | ---------------------- |
| CNAME | `productoffer` | `jamesmac3.github.io`  |

### HTTPS

DNS can take a while to propagate. Once GitHub shows the domain check as successful
on **Settings → Pages**, tick **Enforce HTTPS**. The certificate can take a few
minutes to issue after the domain verifies.

## Assets

- Logo, favicon, the Busy Bee mascot, and John and Jared Fricke's portraits come from
  busybeelawn.net. Confirm approval with Busy Bee Lawn before this goes public.
- Hero and portfolio photos are illustrative Unsplash images (Unsplash License), not
  Busy Bee projects, and are labeled that way on the page.
