'use strict';

// Inspired by: http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
// Simplified to fit the scope of this small project.

var Router = {
    routes: new Map(),
    root: '/',

    addRoute: function(route, handler) {
        this.routes.set(route, handler);
        return this;
    },

    removeRoute: function(route) {
        this.routes.delete(route);
        return this;
    },

    resolveRoute: function(route) {
        let route = route || this.getCurrentFragment();
        let handler = routes.get(route);
        if (handler !== undefined) {
            handler();
        } else {
            Logger.error('Could not resolve route: ' + route);
        }

        return this;
    },

    // TODO: Implement route change monitoring

    navigate: function(path) {
        let path = cleanSlashes(path) || '';
        history.pushState(null, null, this.root + path);

        return this;
    },
    
    getCurrentFragment: function() {
        let fragment = this.cleanFragment(decodeURI(location.pathname));
        if (this.root != '/') {
            fragment.replace(this.root, '');
        }

        return fragment;
    },

    cleanFragment: function(frag) {
        return cleanSlashes(removeQuery(frag));
    },

    cleanSlashes: function(frag) {
        return frag.replace(/(\/$)|(^\/)/, '');
    },

    removeQuery: function(frag) {
        return frag.replace(/\?(.*)$/, '');
    }
};