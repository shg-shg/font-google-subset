const fontRanger = require("font-ranger/lib/font-ranger");
const glob = require("glob");
const del = require("del");
const fs = require("fs-extra");
const axios = require("axios");
const css = require("css");
const concat = require("concat");
require("core-js/features/array/flat-map");

const GOOGLE_FONT_API_URL =
  "https://fonts.googleapis.com/css?directory=3&family=Noto+Sans+JP";

// Google API will return woff2 CSS
const UA_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

async function command() {

  const params = {
    // ====== user options ========
    fontFile: "font.otf",
    urlPrefix: "../fonts/subsets/",
    fontFamily: "Font Name",
    locals: ["Font Name", "Font Name Regular"],
    fontWeight: 400,
    fontStyle: "normal",
    fontDisplay: "swap",
    keepFormat: false,

    // ========== keep ============
    addWoff: false,
    skipCss: false,
    copyOriginal: false,
    outputFolder: "dst/fonts",
    fontName: "",
    ranges: []
  };

  // get unicode-ranges
  const res = await axios.get(GOOGLE_FONT_API_URL, {
    headers: {
      "user-agent": UA_CHROME
    }
  });
  const ranges = css.parse(res.data).stylesheet.rules
    .filter(rule => rule.type === "font-face")
    .flatMap(rule => rule.declarations)
    .filter(declaration => declaration.property === "unicode-range")
    .map(declaration => declaration.value.split(",").map(s => s.trim()));

  // clear output files
  del("dst/**/*");
  if (!fs.existsSync("dst")) {
    fs.mkdirSync("dst");
  }
  if (!fs.existsSync("dst/fonts")) {
    fs.mkdirSync("dst/fonts");
  }
  if (!fs.existsSync("dst/css")) {
    fs.mkdirSync("dst/css");
  }

  // generate subset files
  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index];
    params.fontName = `genshin.${index}`;
    params.ranges = range;
    await fontRanger(params);
  }

  // merge css
  const cssFiles = glob.sync("dst/fonts/*.css");
  concat(cssFiles, "dst/css/fonts.css");
  await del("dst/fonts/*.css");
}

command();