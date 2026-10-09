# The Brew Cup Cafe - one-page website

A single static page. No server, no build step, no dependencies. Works on GitHub Pages, Netlify, Vercel, or any plain web host.

Files:

```
index.html      the whole site
css/style.css   styles (colours and fonts are the variables at the top)
js/main.js      menu tabs, slider, gallery, reservation form
favicon.svg
```

## Preview locally

Just open `index.html` in a browser. That is it.

## How the reservation form works

There is no server, so the form does one of two things:

1. **WhatsApp (default, works immediately).** "Send on WhatsApp" opens WhatsApp with the request already typed out (name, phone, date, time, guests, occasion, notes). The guest presses send and the cafe receives it on the number set at the top of `js/main.js`:

   ```js
   const CONFIG = {
     whatsapp: '918884115566',   // country code + number, digits only
     web3formsKey: '',
   };
   ```

2. **Email (optional).** Sign up free at https://web3forms.com with the cafe's email address, copy the access key, and paste it into `web3formsKey`. A "Send by Email" button then appears next to the WhatsApp one and requests are emailed to the cafe.

## Put it on GitHub Pages (free hosting)

1. Create a GitHub account if you do not have one, then click **New repository**. Name it, for example, `brew-cup-cafe`. Keep it Public. Click **Create repository**.
2. On the new repo page click **uploading an existing file**. Drag in everything inside this folder (`index.html`, `favicon.svg`, `README.md`, `.nojekyll`, and the `css` and `js` folders). Click **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**. Click **Save**.
4. Wait a minute, then refresh. The page shows your link, like `https://yourname.github.io/brew-cup-cafe/`.

Every time you upload a changed file to the repo, the live site updates within a minute or two.

Using git from a terminal instead:

```bash
git init
git add .
git commit -m "Brew Cup Cafe website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/brew-cup-cafe.git
git push -u origin main
```

Then do step 3 above.

### Custom domain (optional)

In **Settings > Pages > Custom domain** enter the domain (for example `thebrewcupcafe.com`), then at your domain registrar add a CNAME record pointing `www` to `yourname.github.io` and the four GitHub Pages A records for the root domain. GitHub issues the HTTPS certificate automatically.

## Editing content

Everything is in `index.html`. Search for the text you want to change. The menu is a list of `<li class="menu-item">` blocks inside each category panel; copy one to add an item. Hours and address appear in three places (info cards, the Hours & location section, and the footer), so update all three. The map is a plain Google Maps embed; change the `q=` text in the iframe `src` and the Get Directions link to move it.

Menu item photos are the cafe's own, stored in `images/menu/` (taken from the Petpooja dine-in menu). Other photos (hero, gallery, category banners) are loaded from Unsplash. To swap any of them, drop a file into `images/` and change the `src` URL.

The site currently shows only the hot coffee, cold coffee and pastry sections of the full menu. To add more, copy a `<li class="menu-item">` block or a whole `menu-panel` + tab button pair.
