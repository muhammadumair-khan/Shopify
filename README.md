# DealFits – Shopify theme (UK)

Online Store 2.0 theme for a UK discount clothing store: bold black/red/yellow look,
automatic "% OFF" badges from compare-at prices, "You save" callouts, a
free-delivery progress bar in the cart (default £50), "Inc. VAT" on product pages,
a legal line in the footer, and fully editable homepage sections.

## Use it
1. Zip the repo contents (`layout/ config/ locales/ assets/ templates/ sections/ snippets/`) and upload in **Online Store → Themes → Add theme → Upload zip**, or run `shopify theme push`.
2. Create menus named `main-menu` (include a "Sale" or "Deals" link) and `footer`.
3. Customise in the theme editor (colours/fonts, hero, collections, announcement bar, delivery threshold in the Cart section, legal line in the Footer).

## UK store setup (Shopify admin)
- **Settings → Store details:** store currency **GBP**, time zone London, unit system metric.
- **Settings → Markets:** make the United Kingdom your primary market; set the language to English (United Kingdom).
- **Settings → Taxes and duties:** register your VAT number and turn on **Include tax in prices** (UK shoppers expect VAT-inclusive prices; the theme then shows "Inc. VAT").
- **Settings → Shipping and delivery:** create a UK profile (e.g. Royal Mail / Evri / DPD), with free delivery from £50 to match the cart bar.
- **Settings → Policies:** generate the Refund, Privacy, Terms and Shipping policies, and link them in the footer menu. UK law gives customers 14 days to cancel online orders plus 14 days to return, so a 30-day returns promise is fine. State who pays return postage.
- **Settings → Customer privacy:** turn on the cookie banner (UK GDPR / PECR).
- **Payments:** enable Shopify Payments (GBP), Apple Pay, Google Pay, Shop Pay, PayPal, and Klarna/Clearpay if wanted.
- **Footer legal line:** your registered company name and number, VAT number and registered address (required on UK business websites).

## Different prices per size
Set them in **Products → (product) → Variants**: give each size its own **Price** and **Compare-at price**.
The theme then shows "From £X" and an "Up to Y% OFF" badge on listings, a price under each size button,
and updates the price, "Inc. VAT" and "You save" amount when a customer picks a size.

## Pricing rules (CMA)
"Was" prices (compare-at) must be genuine: the item should really have sold at that price recently. Avoid permanent "70% off" claims on stock that never sold at the higher price. "Up to 70% off" is only safe if some lines really are that much off.

## Urgency features (legal in the UK when they are real)
- **Sale countdown:** Theme settings → Sale countdown. Enter a fixed end date, e.g. `2026-11-30 23:59 +00:00` (UK time; +00:00 in winter, +01:00 in summer). It appears in the announcement bar, in the *Countdown banner* section (add it in the theme editor) and on product pages, and disappears when the sale ends. Every visitor sees the same end time.
- **Low stock:** set one threshold in Theme settings → Low stock (0 = off). Product cards on the home and collection pages show an "Only N left" badge (total stock across sizes), the product page shows "Only N left in stock" for the chosen size, and size buttons show "2 left" for sizes running low. It reads your real Shopify inventory, so turn on **Track quantity** for your products. Products that allow overselling or don't track stock never show it.
- **Dispatch cut-off:** optional "Order within 3 hrs 12 mins for same-day dispatch" (Mon–Fri, UK time). Enable only if you truly dispatch same day.
- Do not use timers that reset per visitor, fake "X people viewing" or invented stock levels. The DMCC Act 2024 and CMA treat these as unfair practices. Do not run a "sale ends" countdown and then repeat the same price.

## Speed and mobile checklist
Built into the theme: no JavaScript libraries, one small CSS and one small JS file (JS is deferred), responsive
`srcset` images in modern formats via Shopify's CDN, explicit image sizes (no layout jumps), a high-priority hero image,
lazy-loaded product images, preconnected CDNs, add-to-cart without a page reload, a sticky add-to-cart bar on phones,
44px minimum tap targets, 16px form text (no iPhone zoom), notch-safe spacing, and reduced-motion support.

In Shopify admin, to keep it fast:
- **Apps:** install as few as you can. Each one usually adds scripts to every page. Remove unused apps and their leftover code.
- **Images:** upload product photos about 2000px on the long side, in the same portrait ratio (3:4), under about 500 KB. Shopify converts them to WebP/AVIF.
- **Fonts:** keep to two fonts (Theme settings → Typography); each extra weight adds load time.
- **Homepage:** keep to 6–8 sections, and use short videos or sliders sparingly.
- **Measure:** run PageSpeed Insights on the home, collection and product pages (mobile), and check Online Store → Themes → speed report. Aim for LCP under 2.5 s.
- **Test on a real phone** on mobile data, not only on Wi-Fi.

## Structure
- `sections/` hero-banner, value-props, featured-collection, collection-tiles, promo-strip, newsletter, header/footer groups, and `main-*` page sections
- `snippets/` product-card, price, pagination, social-meta
- `templates/` index, product, collection, list-collections, cart, page, search, 404
