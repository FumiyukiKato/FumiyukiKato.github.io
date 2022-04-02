'use strict';

const onPostBuild = () => {
    const glob = require('glob')
    const cheerio = require('cheerio')
    const fs = require('fs')

    const postFiles = glob.sync(`public/posts/**/*.html`)
    postFiles.forEach((file) => {
        const $ = cheerio.load(fs.readFileSync(file).toString());
        const pForKatex = $('<p></p>');
        $('.katex-display').wrap(pForKatex);
        fs.writeFileSync(file, $.html())
    })
}

module.exports = onPostBuild