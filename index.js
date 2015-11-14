var Promise = require('bluebird'),
    marked = require('marked'),
    highlight = require('highlight.js');

var markedAsync = Promise.promisify(marked);

module.exports = {
    process: function(config, opts) {

        var markdown = config.md || '';

        marked.setOptions({
            highlight: function(code, lang) {
                return highlight.highlight(lang, code).value;
            },
            gfm: true,
            tables: true,
            breaks: true,
            smartLists: true,
            smartypants: true
        });

        return markedAsync(markdown).then(function(html) {
            return {
                html: html
            };
        });
        return {
            html: '<p>foo'
        }
    }
};