import fs from "node:fs";
import markdownIt from "markdown-it";
import typogr from "typogr";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Give headings an id, like the old marked renderer did (e.g. "## HackRF" -> id="hackrf").
function headingIds(md) {
  md.core.ruler.push("heading_ids", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "heading_open") continue;
      const text = tokens[i + 1].children
        .filter((t) => t.type === "text" || t.type === "code_inline")
        .map((t) => t.content)
        .join("");
      tokens[i].attrSet("id", text.toLowerCase().replace(/[^\w]+/g, "-"));
    }
  });
}

// Rewrite relative src/href attributes so they work from any page (index, feed),
// not only from the article's own URL.
function resolveUrls(html, pageUrl, origin = "") {
  return html.replace(/(\s(?:src|href)=")([^"]+)"/g, (match, attr, value) => {
    if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(value)) return match;
    const url = new URL(value, "http://local" + pageUrl);
    return `${attr}${origin}${url.pathname}${url.search}${url.hash}"`;
  });
}

// The intro is everything before the first "more" marker, h2 or hr.
function intro(html) {
  const cuts = ['<span class="more', "<h2", "<hr"]
    .map((marker) => html.indexOf(marker))
    .filter((index) => index !== -1);
  return cuts.length ? html.slice(0, Math.min(...cuts)) : html;
}

export default function (eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true, typographer: true }).use(headingIds);
  eleventyConfig.setLibrary("md", md);

  // Accept "2017-11-04 18:36" style dates (read as UTC) alongside ISO dates.
  eleventyConfig.addDateParsing((value) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(value)) {
      return new Date(value.replace(" ", "T") + "Z");
    }
  });

  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("contents/css");
  eleventyConfig.addPassthroughCopy("contents/js");
  eleventyConfig.addPassthroughCopy("contents/articles/**/*.{gif,png,jpg,jpeg,svg,webp,mp4}");

  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("contents/articles/*/index.md").sort((a, b) => b.date - a.date)
  );

  // The "about" blurb shown in every page footer.
  eleventyConfig.addGlobalData("about", () =>
    md.render(fs.readFileSync("templates/about.md", "utf8"))
  );

  eleventyConfig.addFilter("resolveUrls", resolveUrls);
  eleventyConfig.addFilter("intro", intro);
  eleventyConfig.addFilter("typogrify", (html) => typogr(html).typogrify());
  eleventyConfig.addFilter("displayDate", (date) =>
    `${String(date.getUTCDate()).padStart(2, "0")}. ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
  );
  eleventyConfig.addFilter("rfc822", (date) => date.toUTCString().replace("GMT", "+0000"));
  eleventyConfig.addFilter("archive", (articles) => {
    const years = [];
    for (const article of articles) {
      const year = article.date.getUTCFullYear();
      const month = MONTHS[article.date.getUTCMonth()];
      let y = years.find((entry) => entry.year === year);
      if (!y) years.push((y = { year, months: [], count: 0 }));
      let m = y.months.find((entry) => entry.name === month);
      if (!m) y.months.push((m = { name: month, articles: [] }));
      m.articles.push(article);
      y.count++;
    }
    return years;
  });
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: {
      input: "contents",
      includes: "../templates",
      data: "../data",
      output: "docs",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
