# DealFits – Shopify theme

Online Store 2.0 theme for a discount clothing store: bold black/red/yellow look,
automatic "% OFF" badges from compare-at prices, "You save" callouts, a
free-shipping progress bar in the cart, and fully editable homepage sections.

## Use it
1. Zip the repo contents (`layout/ config/ locales/ assets/ templates/ sections/ snippets/`) and upload in **Online Store → Themes → Add theme → Upload zip**, or run `shopify theme push` (Shopify CLI).
2. In **Products**, set **Compare-at price** higher than **Price** – badges and strike-through prices appear automatically.
3. Create menus named `main-menu` (include a "Sale" link) and `footer`.
4. Customize in the theme editor: colors/fonts (Theme settings), hero, collections, announcement bar, free-shipping threshold (Cart section).

## Structure
- `sections/` hero-banner, value-props, featured-collection, collection-tiles, promo-strip, newsletter, header/footer groups, and `main-*` page sections
- `snippets/` product-card, price, pagination, social-meta
- `templates/` index, product, collection, list-collections, cart, page, search, 404
