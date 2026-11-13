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

## Product page features
- **Photo gallery:** swipe on phones, arrows and thumbnails on desktop, tap to zoom. If a variant (e.g. a colour) has its own photo assigned in Shopify (Products → variant → pick image), the gallery jumps to it.
- **Trust badges:** the three "Free delivery / 30-day returns / 100% authentic" points show as icon badges. Edit them in the theme editor (Product section → each *Trust line* block): pick an icon, set the title and the small text, add or remove blocks (3 fits best on phones). Only keep claims that are true: "100% authentic" must be backed by your supply chain, and the returns promise must match your policy.
- **Cart page:** the same trust badges and card icons appear under the Checkout button (theme editor → Cart section: toggle them, edit the three badges, or upload a PNG strip).
- **Secure-checkout icons (PNG):** theme editor → Product section. Either upload one PNG strip of all your cards (*Payment icons: one PNG strip*), or add one *Payment icon (PNG)* block per card. Use 2× size (e.g. 152 × 96 px) so they stay sharp on phones, and get official logos from each provider's brand centre (Visa, Mastercard, American Express, Apple, Google Pay, PayPal, Klarna). With nothing uploaded, the theme shows its bundled PNG logos for the cards you've enabled (Visa, Mastercard, American Express, Maestro, PayPal, Discover, Diners Club, JCB: `assets/pay-*.png`, 152 × 96 px, about 1.5 KB each) and Shopify's built-in icons for the rest (Apple Pay, Google Pay, Klarna, Shop Pay). Apple, Google and Klarna require their own official marks, so upload those as PNG blocks if you want PNG for them too.
- **Express checkout:** Shop Pay, Apple Pay, Google Pay and PayPal buttons appear for the wallets enabled in Settings → Payments. Toggle in the Product section.
- **Delivery estimate:** Theme settings → Delivery estimate (cut-off hour, fastest and slowest working days, bank holidays). Update the bank-holiday list each year.
- **Collapsible sections:** in the theme editor, Product section → add or edit *Collapsible section* blocks (Product details uses the product description; Fabric and care and Delivery and returns are editable text, so check the wording matches your real policies).
- **You may also like:** Shopify's automatic recommendations (they improve as the store gets orders).
- **Google rich results:** product data (price, stock, ratings if a reviews app provides them) is added automatically.
- **Reviews:** install a reviews app (e.g. Judge.me); it plugs into the star-rating and structured data slots.

## Make the "Shop the deals" buttons work
The hero, promo strip and flash-sale banner send shoppers to a collection with the handle **sale** (if it has products), otherwise to **All products**. To set it up: Products → Collections → Create collection → title **Sale**, type **Automated**, condition **Compare-at price is greater than 0**. Or set an explicit link in each section in the theme editor. The "Hot deals" section also falls back to the Sale collection, then all products, until you pick one.

## Different prices per size
Set them in **Products → (product) → Variants**: give each size its own **Price** and **Compare-at price**.
The theme then shows "From £X" and an "Up to Y% OFF" badge on listings, a price under each size button,
and updates the price, "Inc. VAT" and "You save" amount when a customer picks a size.

## Pricing rules (CMA)
"Was" prices (compare-at) must be genuine: the item should really have sold at that price recently. Avoid permanent "70% off" claims on stock that never sold at the higher price. "Up to 70% off" is only safe if some lines really are that much off.

## Size guide, fit tag and model info (cuts wrong-size returns)
Shown on product pages that have sizes. Set up once in Shopify admin: **Settings → Custom data → Products → Add definition**:

| Name | Namespace and key | Type |
|---|---|---|
| Fit | `custom.fit` | Single line text (limit to: Runs small, True to size, Runs large) |
| Size chart | `custom.size_chart` | Multi-line text |
| Model info | `custom.model_info` | Single line text |

Then fill them in on each product (or in the bulk-upload sheet). Size chart format: one row per line, columns separated by `|`, first line is the header:
```
Size | Chest (cm) | Waist (cm) | Length (cm)
S | 96 | 82 | 68
M | 102 | 88 | 70
```
Products without their own chart use the default chart in **Theme settings → Size guide**, along with the "How to measure" tips.
"Runs small" tells shoppers to order one size up, "Runs large" one size down.

## Urgency features (legal in the UK when they are real)
- **Sale countdown:** Theme settings → Sale countdown. Enter a fixed end date, e.g. `2026-11-30 23:59 +00:00` (UK time; +00:00 in winter, +01:00 in summer). It appears in the announcement bar, in the *Countdown banner* section (add it in the theme editor) and on product pages, and disappears when the sale ends. Every visitor sees the same end time.
- **Low stock:** set one threshold in Theme settings → Low stock (0 = off). Product cards on the home and collection pages show an "Only N left" badge (total stock across sizes), the product page shows "Only N left in stock" for the chosen size, and size buttons show "2 left" for sizes running low. It reads your real Shopify inventory, so turn on **Track quantity** for your products. Products that allow overselling or don't track stock never show it.
- **Dispatch cut-off:** optional "Order within 3 hrs 12 mins for same-day dispatch" (Mon–Fri, UK time). Enable only if you truly dispatch same day.
- Do not use timers that reset per visitor, fake "X people viewing" or invented stock levels. The DMCC Act 2024 and CMA treat these as unfair practices. Do not run a "sale ends" countdown and then repeat the same price.

## Thank-you page (and the order confirmation)
**Custom Thank-you page (in the theme):** Online Store → Pages → Add page → Theme template **page.thank-you**. Edit the message, the three "What happens next" steps, an optional discount code (create the same code under Discounts first) and a collection of products. Search engines are told to skip it (noindex). Use it as the landing page after newsletter or contact sign-ups, or link to it from email automations.

**The page shown right after paying (order confirmation):** Shopify controls this page; a theme cannot change it. In Settings → Checkout and customer accounts → Customize you can set your logo, colours and fonts (use #111111 text, #FF3D2E accent, #FFE14D highlight), and apps can add blocks such as post-purchase offers. Also customise the **order confirmation email** (Settings → Notifications → Customer notifications → Order confirmation): add your logo, a "what happens next" line, delivery estimate and a size-exchange link.

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

## Credits
Card logos in `assets/pay-*.png` were rendered from the open-source [payment-icons](https://www.npmjs.com/package/payment-icons) set (Mozilla Public License 2.0). The logos remain trademarks of their owners and are used only to show which cards the store accepts.
