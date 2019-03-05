const util = require("./util");

// prepare tags by `hexo.config.enhancer.tags` and `hexo.config.keywords`
const tags = [];
util.parseTags(hexo.config.keywords, tags);
hexo.config.enhancer && util.parseTags(hexo.config.enhancer.tags, tags);
console.log("Prepare tags: %s", tags);

/**
 * fitler hexo's post, auto generate `title`, `date`, `abbrlink`
 *
 * @param log
 * @param data
 */
function filterPost(log, data) {
    let metadata = util.parseSource(data.source);

    if (!data.title) {
        data.title = metadata.title;
        log.i("Generate title [%s] for post [%s]", metadata.title, data.source);
    }

    if (metadata.date) {
        data.date = metadata.date;
        log.i("Generate date [%s] for post [%s]", metadata.date, data.source);
    }

    if (!data.abbrlink) {
        data.abbrlink = util.crc32(data.title);
        log.i("Generate abbrlink [%s] for post [%s]", data.abbrlink, data.source);
    }

    if (metadata.categories.length) {
        data.setCategories(metadata.categories);
        log.i("Generate categories [%s] for post [%s]", metadata.categories, data.source);
    }

    if (tags.length) {
        let matchedTags = util.matchTags(data.raw, tags);
        if (matchedTags.length) {
            data.setTags(matchedTags);
            log.i("Generate tags [%s] for post [%s]", matchedTags, data.source);
        }
    }
}

hexo.extend.filter.register('before_post_render', function (data) {
    if (data.layout === 'post') {
        filterPost(this.log, data);
    }
    return data;
});