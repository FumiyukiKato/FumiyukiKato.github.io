'use strict';

exports.onPostBuild = () => {
    const postFiles = glob(`public/posts/*/index.html`);
    const cheerio = require('cheerio')
    const pForKatex = $('<p></p>');
    postFiles.forEach((file) => {
       const $ = cheerio.load(fs.readFileSync(file).toString());
       $('.katex-display').wrap(pForKatex);
       fs.writeFileSync(file, $.html())
    })
}