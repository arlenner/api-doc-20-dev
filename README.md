# Tradovate API Docs (Development)

This project uses Jekyll to build a custom static site fast. This should be an improvement on our original docs, as we will be able to hand-curate all content in `.md` format. First bundle the project:
```
yarn install
bundle install
```

Then serve the page:
```
bundle exec jekyll serve
```

## Goals
- [ ] add verbose docs for each endpoint operation. 90%.
- [ ] add verbose docs for each Entity type. 90%.
- [ ] add verbose docs for each Response type. 90%.
- [x] add a WebSocket exploration tool directly to the page.
- [x] ability to download API spec as `.yaml` or `.json`.
- [x] be vendor-aware - the site should know if the auth'd user is a vendor or not.
- 

