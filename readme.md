# KD2MZG.com

Radio things. Built with [Eleventy](https://www.11ty.dev).

```
npm install
npm run dev     # local dev server with live reload
npm run build   # build the site into docs/ (served by GitHub Pages)
```

- `contents/articles/<slug>/index.md` — posts (frontmatter: `title`, `date`, `author`, `summary`)
- `drafts/` — unpublished posts; move one into `contents/articles/` to publish it
- `contents/index.njk`, `archive.njk`, `feed.njk` — paginated home page, archive, RSS feed
- `templates/` — layouts and the footer blurb (`about.md`)
- `data/site.json` — site name, URL, owner and description
