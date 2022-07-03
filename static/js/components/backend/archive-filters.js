import AjaxRequest from "./ajax-request";

export default class ArchiveFilter extends AjaxRequest {
    constructor(opts) {
        super(opts);

        this.path = null;

        this.opts = Object.assign(this.opts, {
            queryParamKey: 'filters',
            ajax: true
        }, opts || {});
    }

    buildRequest() {
        return {
            method: 'GET',
            url: document.location.pathname.replace(/\/page\/[0-9]+\/$/, '')
        };
    }

    execute(data) {
        this.path = document.location.pathname.replace(/\/page\/[0-9]+\/$/, '');

        if (Object.keys(data).length > 0) {
            var params = decodeURI($.param(data)).replace('%2C', ',');

            if (params) {
              this.path += '?' + params
            }
        }

        if (this.opts.ajax) {
          super.execute(data);
        } else {
          window.location = this.path;
        }
    }

    static parseQueryVar(key, value, parameters) {
        let nesting = key.match(/\[(.*?)\]/g);

        if (nesting === null) {
          parameters[key] = value;

          return parameters;
        }

        let path = nesting.map(n => n.match(/\[(.*?)\]/)[1]);

        let param = parameters.filters;
        for (let i = 0; i < path.length; i++) {
            if ( i === path.length - 1 ) {
                // Last key, so set the value here and then break out

                param[isNaN(path[i]) ? path[i] : parseInt(path[i])] = value;

                break;
            }

            if ( !param.hasOwnProperty(path[i]) ) {
                if (isNaN(path[i + 1])) {
                    param[path[i]] = {}
                } else {
                    param[path[i]] = []
                }
            }

            param = param[path[i]];
        }

        return parameters;
    }

    static getQueryParams() {
        let params = { filters: {} };
        let search = decodeURIComponent(document.location.search.slice(1));
        let definitions = search.split('&');

        if (definitions[0] !== '') {
            params = definitions.reduce(function (parameters, queryPart) {
                let [key, value] = queryPart.split('=', 2);

                return ArchiveFilter.parseQueryVar(key, value, parameters)
            }, params);
        }

        return params;
    }
}