var htmlMinifier = require('./wxml-minifier/htmlminifier');

function wxmlMinifier(content, option) {
    option = Object.assign({
        collapseWhitespace: true,
        removeComments: true,
        keepClosingSlash: true
    }, option || {})
    return htmlMinifier.minify(content, option);
}

module.exports = wxmlMinifier;
