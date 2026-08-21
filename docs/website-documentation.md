# Ganesh Doors Website Documentation

## Project Overview

This is a mobile-first static shop website for **Ganesh Doors**, built using HTML, CSS, Bootstrap, and JavaScript.

The website is designed primarily for mobile users while remaining responsive across tablets, laptops, desktops, and other screen sizes.

The website includes:

* Sticky responsive header
* Hero/banner section
* Product categories
* Wooden door collection
* Product detail pages
* About Us section
* Customer reviews
* Gallery
* Trust/statistics section
* Contact information
* WhatsApp enquiry options
* Footer
* SEO and structured data
* Responsive layouts for different devices

The website is completely static and does not require a server-side database or backend.

---

## Final Project Structure

The current project structure is organized as follows:

```text
Ganesh Doors Website/
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│       ├── 5-inch-wooden-door-frames/
│       ├── 6-inch-wooden-door-frames/
│       ├── banners/
│       ├── company-logos/
│       ├── gallery/
│       ├── laminate-doors/
│       ├── laminate-router-doors/
│       ├── lamination-doors/
│       ├── mesonite-doors/
│       ├── wood-finishing-doors/
│       ├── wooden-doors/
│       └── wpvc-doors/
│
├── contact/
│   └── index.html
│
├── docs/
│   └── website-documentation.md
│
├── gallery/
│
├── our-products/
│
├── products/
│   ├── 5-inch-wooden-door-frames/
│   ├── 6-inch-wooden-door-frames/
│   ├── laminate-premium-door/
│   ├── laminate-router-door/
│   ├── lamination-door/
│   ├── mesonite-polished-door/
│   ├── wood-finishing-door/
│   ├── wooden-door/
│   └── wpvc-doors/
│
├── tools/
│
├── .nojekyll
├── CNAME
├── index.html
├── robots.txt
└── sitemap.xml
```

### Important Root Files

* `index.html` — Main homepage of the website.
* `robots.txt` — Provides crawling instructions for search engines.
* `sitemap.xml` — Contains the website URLs intended for search-engine discovery.
* `.nojekyll` — Prevents GitHub Pages from processing the website through Jekyll.
* `CNAME` — Used for the custom domain when the website is connected to a custom domain.

---

# Main Website Sections

## Homepage

### `index.html`

The homepage contains the main website sections, including:

* Header/navigation
* Hero section
* Benefits/features
* Product categories
* Product collection links
* About Us
* Customer reviews
* Gallery
* Trust/statistics section
* Contact information
* Footer

The homepage also contains internal links to the major product categories, gallery, and contact page.

---

## Contact Page

### `contact/index.html`

The contact page contains the business contact information, including:

* Phone number
* WhatsApp enquiry options
* Business address
* Shop hours
* Location information
* Contact details
* LocalBusiness structured data

The contact page is intended to provide users with a direct way to contact or locate Ganesh Doors.

---

## Gallery

### `gallery/`

This section contains the website gallery page and related gallery content.

Gallery images are stored separately inside:

```text
assets/images/gallery/
```

---

## Our Products

### `our-products/`

This section contains the main product-category navigation/overview page.

It provides users with access to the different Ganesh Doors product categories.

---

# Product Structure

All product-category pages are organized under:

```text
products/
```

The current product categories are:

```text
products/
├── 5-inch-wooden-door-frames/
├── 6-inch-wooden-door-frames/
├── laminate-premium-door/
├── laminate-router-door/
├── lamination-door/
├── mesonite-polished-door/
├── wood-finishing-door/
├── wooden-door/
└── wpvc-doors/
```

### Product Categories

The website currently includes:

1. 5-Inch Wooden Door Frames
2. 6-Inch Wooden Door Frames
3. Laminate Premium Doors
4. Laminate Router Doors
5. Lamination Doors
6. Mesonite Polished Doors
7. Wood Finishing Doors
8. Wooden Doors
9. WPVC Doors

---

# Wooden Door Collection

### `products/wooden-door/`

This is the main wooden-door collection section.

The collection page can contain multiple wooden-door products and may include product search, filtering, or sorting functionality depending on the current implementation.

Individual wooden-door product pages are organized within this section.

Each individual product page should contain its own:

* Product name
* Model number
* Product image
* Product description
* Specifications
* Unique page title
* Meta description
* Canonical URL
* Product structured data
* Enquiry/WhatsApp option

---

# Product Images

All website images are stored inside:

```text
assets/images/
```

The images are organized by product category:

```text
assets/images/
├── 5-inch-wooden-door-frames/
├── 6-inch-wooden-door-frames/
├── banners/
├── company-logos/
├── gallery/
├── laminate-doors/
├── laminate-router-doors/
├── lamination-doors/
├── mesonite-doors/
├── wood-finishing-doors/
├── wooden-doors/
└── wpvc-doors/
```

This separation keeps product images organized and makes future website maintenance easier.

---

# CSS and JavaScript

## CSS

### `assets/css/`

The CSS files contain:

* Website styling
* Responsive layouts
* Mobile-first design
* Tablet layouts
* Desktop layouts
* Header styling
* Footer styling
* Product-card styling
* Gallery styling
* Section spacing
* Typography
* Device-specific adjustments

Bootstrap is also used for responsive grid and layout functionality.

---

## JavaScript

### `assets/js/`

The JavaScript files handle interactive website functionality.

Depending on the page, JavaScript may handle:

* Current year in the footer
* Header shadow after scrolling
* Product search
* Product sorting
* Product image/thumbnail switching
* Sliders/carousels
* Other small interactive elements

The website does not depend on a server-side JavaScript environment.

---

# SEO Implementation

The website follows a search-engine-friendly structure.

## Responsive Design

The website uses a mobile-first responsive approach with:

* Bootstrap grid
* Custom responsive CSS
* Responsive images
* Device-specific layouts
* Mobile navigation

The design is intended to work across:

* Mobile phones
* iPad Mini
* iPad Air
* iPad Pro
* Surface devices
* Laptops
* Desktop computers

---

## Page Titles and Meta Descriptions

Important pages and product pages should have unique:

* `<title>`
* Meta description
* Canonical URL

Product pages should not use identical SEO titles or descriptions.

---

## SEO-Friendly URLs

The website uses readable directory-based URLs such as:

```text
/products/wooden-door/
/products/laminate-premium-door/
/products/laminate-router-door/
/products/lamination-door/
/products/mesonite-polished-door/
/products/wood-finishing-door/
/products/wpvc-doors/
```

This structure is easier for users and search engines to understand.

---

# Structured Data

The website uses Schema.org structured data where appropriate.

## Product Schema

Individual product pages can contain Product schema with information such as:

* Product name
* Description
* Image
* Brand
* Model number
* Material
* Product URL

## LocalBusiness Schema

The homepage and contact page can contain LocalBusiness schema containing business information such as:

* Business name
* Telephone number
* Address
* Website
* Opening hours
* Location
* Google Business Profile URL through `sameAs`, when available

The structured-data information should always match the actual business information displayed on the website.

---

# Image Optimization

The website uses locally stored optimized images.

Recommended image practices include:

* Use optimized JPG/WebP images where appropriate.
* Use appropriately sized images for their display area.
* Avoid unnecessarily large image files.
* Use `loading="lazy"` for non-critical images.
* Keep hero images prioritized/preloaded where appropriate.
* Specify image dimensions where practical to reduce layout shifting.
* Preserve the actual appearance and quality of product images.

Product images should be stored in their corresponding category folder.

---

# Internal Linking

The website uses internal links between important sections.

Examples include:

```text
Homepage
   ↓
Our Products
   ↓
Product Category
   ↓
Individual Product
```

Other important internal links include:

```text
Homepage ↔ Gallery
Homepage ↔ Contact
Homepage ↔ Product Categories
Product Category ↔ Individual Products
Individual Product ↔ Contact/WhatsApp
```

Internal linking helps users navigate the website and helps search engines discover important pages.

---

# Robots.txt

The website includes:

```text
robots.txt
```

The file should point search engines toward the correct sitemap location and should use the final production domain.

Example structure:

```text
User-agent: *
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

The final domain should replace the example domain before launch.

---

# Sitemap

The website includes:

```text
sitemap.xml
```

The sitemap should contain the canonical URLs of all important indexable pages, including:

* Homepage
* Product-category pages
* Individual product pages
* Contact page
* Gallery page
* Other important public pages

The sitemap should not contain unnecessary development, tool, or documentation URLs unless those pages are intentionally public and intended for search indexing.

---

# Canonical URLs

Every important indexable page should have a canonical URL pointing to its final public URL.

Before deployment, replace any placeholder domain with the final production domain.

For example:

```html
<link rel="canonical" href="https://www.example.com/products/wooden-door/">
```

The canonical URL must exactly match the intended public URL structure.

---

# Business Information Before Launch

The following information must be checked and updated before the final public launch.

## 1. Final Domain

Replace any placeholder domain such as:

```text
https://ganeshdoors.in/
```

with the actual final domain wherever required, including:

* Canonical URLs
* Schema `url`
* Schema product URLs
* `robots.txt`
* `sitemap.xml`
* Open Graph URLs, if used
* Other absolute website URLs

---

## 2. Phone Number

Replace any placeholder telephone number such as:

```text
+91 98765 43210
```

with the actual shop telephone number.

The same correct number should be used consistently across:

* Website contact information
* Schema
* WhatsApp links, where applicable
* SEO/business information

---

## 3. Business Address

Replace placeholder information such as:

```text
Opp. Reshim Udyog, Sankeshwar Road, Your City - 416502
```

with the exact real shop address.

The address should be consistent across the website and LocalBusiness schema.

---

## 4. Google Business Profile

Add the real Google Business Profile URL to the appropriate `sameAs` property when available.

Do not use a placeholder URL.

---

## 5. Google Maps

Replace any map placeholder with the actual shop location.

This can be implemented using:

* Google Maps link
* Google Maps embed
* Another appropriate location method

The location should point to the actual business location.

---

# Product Editing Procedure

To add a new product:

### Step 1 — Add the product image

Place the optimized image in the appropriate category inside:

```text
assets/images/
```

For example:

```text
assets/images/wooden-doors/
```

### Step 2 — Add the product card

Add the new product to the appropriate collection/category page.

For example:

```text
products/wooden-door/
```

### Step 3 — Create the product page

Create a directory for the new product and place its `index.html` inside it.

Example:

```text
products/wooden-door/new-product-name/index.html
```

### Step 4 — Add SEO information

The product page should contain:

* Unique title
* Unique meta description
* Canonical URL
* Appropriate heading structure
* Product image
* Product description
* Product specifications
* Product schema

### Step 5 — Add internal links

Make sure the new product is linked from the appropriate collection/category page.

### Step 6 — Update sitemap

Add the new public product URL to:

```text
sitemap.xml
```

---

# Website Performance

The website is designed as a static website, which provides several performance advantages:

* No database queries
* No server-side rendering requirement
* Local static assets
* Browser caching support through hosting
* Optimized images
* Lazy loading for appropriate images
* Minimal JavaScript
* Bootstrap-based responsive layout

The final loading speed will also depend on:

* Image file sizes
* Number of images loaded initially
* Third-party resources
* Hosting/CDN performance
* Browser caching
* Network speed
* JavaScript and CSS file sizes

---

# GitHub Pages Deployment

The website is suitable for deployment through **GitHub Pages** because it is a static HTML/CSS/JavaScript website.

The root directory contains:

```text
index.html
robots.txt
sitemap.xml
.nojekyll
CNAME
```

These files are appropriate for a GitHub Pages deployment.

## Deployment Requirements

Before publishing:

1. Upload/push the complete website to the GitHub repository.
2. Make sure `index.html` is available at the correct publishing root.
3. Enable GitHub Pages for the repository.
4. Select the correct branch and folder as the publishing source.
5. Configure the custom domain if one is being used.
6. Verify HTTPS.
7. Test all internal links.
8. Test product pages.
9. Test images and CSS/JavaScript files.
10. Check `robots.txt`.
11. Check `sitemap.xml`.
12. Verify canonical URLs.
13. Test the website on mobile and desktop devices.

---

# GitHub Pages and `.nojekyll`

The project contains:

```text
.nojekyll
```

This file tells GitHub Pages not to process the website using Jekyll.

For a static website with its own directory and asset structure, keeping `.nojekyll` at the root is appropriate.

---

# Custom Domain

The project contains:

```text
CNAME
```

If a custom domain is used with GitHub Pages, the `CNAME` file should contain the intended domain name.

The domain must also be correctly configured at the domain/DNS provider.

The website should ultimately be accessible through HTTPS.

---

# Pre-Launch SEO Checklist

Before the website is considered fully launched, verify:

* [ ] Final domain is used everywhere.
* [ ] Homepage title is correct.
* [ ] Homepage meta description is correct.
* [ ] Every important page has a unique title.
* [ ] Every important page has a unique meta description.
* [ ] Canonical URLs use the final domain.
* [ ] Product URLs are correct.
* [ ] Product schema is valid.
* [ ] LocalBusiness schema contains real business information.
* [ ] Real phone number is used.
* [ ] Real business address is used.
* [ ] Google Business Profile URL is added where appropriate.
* [ ] Google Maps location points to the actual shop.
* [ ] `robots.txt` uses the final sitemap URL.
* [ ] `sitemap.xml` uses the final domain.
* [ ] All important product pages are included in the sitemap.
* [ ] No broken internal links exist.
* [ ] No important images are missing.
* [ ] HTTPS works correctly.
* [ ] Mobile layout is tested.
* [ ] Tablet layout is tested.
* [ ] Desktop layout is tested.
* [ ] Google Search Console is connected after deployment.

---

# Google Search Console

After the website is deployed on the final domain:

1. Add and verify the website in Google Search Console.
2. Submit:

```text
/sitemap.xml
```

3. Inspect the homepage.
4. Inspect important product-category pages.
5. Inspect important individual product pages.
6. Monitor indexing and coverage.
7. Fix any crawl or indexing issues reported by Google.

---

# Google Business Profile

After the website is live, the website URL should be connected to the Ganesh Doors Google Business Profile.

The business information should be consistent between:

* Website
* LocalBusiness schema
* Google Business Profile
* Google Maps
* Contact information

Consistency is important for local SEO.

---

# Development and Documentation Files

The project also contains:

```text
docs/
└── website-documentation.md
```

This documentation file contains information about the website structure, SEO, deployment, maintenance, and editing procedures.

The project also contains:

```text
tools/
```

The tools directory is intended for development or utility scripts and should not be treated as a primary public website section.

---

# Static Website Hosting

Because the website is a static HTML/CSS/JavaScript website, it can be hosted on services such as:

* GitHub Pages
* Netlify
* Vercel
* cPanel/static web hosting
* Other HTTPS-enabled static hosting services

No server-side application is required for the core website.

---

# Final Website Maintenance Guidelines

When modifying the website:

* Do not change existing URLs unnecessarily.
* Do not rename product directories without updating all internal links.
* Update `sitemap.xml` when adding or removing indexable pages.
* Update canonical URLs when changing the production domain.
* Keep product images inside the appropriate image category.
* Keep product model numbers consistent.
* Keep schema information synchronized with visible page information.
* Check mobile responsiveness after CSS changes.
* Test tablet and desktop layouts after responsive changes.
* Check broken links after moving files.
* Optimize new images before adding them.
* Keep the root `index.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, and `CNAME` files in their correct locations.
* Keep the documentation updated whenever the website structure changes.

---

# Final Project Status

The website is structured as a **mobile-first static website** with organized assets, product categories, SEO implementation, structured data, internal linking, responsive layouts, and GitHub Pages compatibility.

The final production domain, business contact details, address, Google Business Profile URL, and map location should be verified and updated before the website is officially launched.

After deployment, the final website should be tested on mobile, tablet, laptop, and desktop devices, followed by Google Search Console and sitemap submission.
