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

## Structure
- `sections/` hero-banner, value-props, featured-collection, collection-tiles, promo-strip, newsletter, header/footer groups, and `main-*` page sections
- `snippets/` product-card, price, pagination, social-meta
- `templates/` index, product, collection, list-collections, cart, page, search, 404
