'use strict';

const onPostBuild = () => {
    const glob = require('glob');
    const cheerio = require('cheerio');
    const fs = require('fs');

    const postFiles = glob.sync(`public/posts/**/*.html`);
    postFiles.forEach((file) => {
        const $ = cheerio.load(fs.readFileSync(file).toString());
        const pForKatex = $('<p></p>');
        $('.katex-display').wrap(pForKatex);
        fs.writeFileSync(file, $.html());
    });

    const jsonFiles = glob.sync(`public/page-data/**/page-data.json`);
    jsonFiles.forEach((file) => {
        const jsonData = JSON.parse(fs.readFileSync(file).toString());
        const $ = cheerio.load(jsonData.html);
        const pForKatex = $('<p></p>');
        $('.katex-display').wrap(pForKatex);
        jsonData.html = $.html();
        fs.writeFileSync(file, JSON.stringify(jsonData));
    });
}

module.exports = onPostBuild