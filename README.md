# Birthday surprise — Adobe EDS

A dependency-free, mobile-first single-page birthday block. All six screens run inside one block without page navigation.

## Local preview
Run `python3 -m http.server 3000` from this directory and open http://localhost:3000. The included index.html is a standalone preview fixture, not the EDS authored page.

## EDS integration
Use an existing provisioned Adobe EDS repository (or create one from the Adobe boilerplate). Copy blocks/birthday/ into it. The standard EDS block loader will call the default decorate function and load its CSS. Do not replace an existing site's scripts.js, styles.css or head.html; those included here are for the minimal standalone demo. Configure your own EDS site and content source (DA or supported document authoring) and preview/publish an authored page with a Birthday block. No live EDS site is provisioned by this package.

## Authoring
Create a two-column block with header Birthday and key/value rows: Name, Sender, Letter, Compliments (four pipe-separated phrases), Captions (pipe-separated), and optionally repeat Photo rows with an inserted image and caption in the value cell. See content/birthday.md for an example. In the local fixture, edit index.html or defaults in birthday.js. Photos are intentionally placeholders until you supply your own. Music is an optional synthesized melody; candle is tap-operated rather than microphone-operated. No external tracking or dependencies.
