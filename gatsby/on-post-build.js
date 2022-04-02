'use strict';

const onPostBuild = () => {
    console.log('#############################')
    console.log(process.cwd())
    const glob = require('glob')
    const cheerio = require('cheerio')
    const fs = require('fs')
    // files = glob.sync(`/`)
    // console.log(files)
    // files.forEach((file) => 
    //     console.log(file)
    // )
    // files = glob.sync(`.`)
    // console.log(files)
    // files.forEach((file) => 
    //     console.log(file)
    // )

    const postFiles = glob.sync(`public/posts/**/*.html`)
    postFiles.forEach((file) => {
        console.log(file)
        const $ = cheerio.load(fs.readFileSync(file).toString());
        const pForKatex = $('<p></p>');
        console.log($('.katex-display'))
        $('.katex-display').wrap(pForKatex);
        fs.writeFileSync(file, $.html())
    })
    console.log('#############################')
}

module.exports = onPostBuild