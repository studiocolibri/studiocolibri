import ArchiveFilter from './archive-filters';

export default class FormFilter extends ArchiveFilter {
    constructor(form, opts) {
        super(opts);

        this.form = form;

        this.opts = Object.assign(this.opts, {
            filtersSelector: 'fieldset.filter',
            submitSelector: '[type=submit]'
        }, opts || {});

        this.filters = this.form.find(this.opts.filtersSelector);
        this.submit = this.form.find(this.opts.submitSelector);

        this.bindEvents();
    }

    bindEvents() {
        let self = this;

        this.form.on('submit', function (e) {
            e.preventDefault();

            let currentParams = FormFilter.getQueryParams();
            let filters = {};

            if (currentParams && currentParams.filters) {
                filters = currentParams.filters;

                delete currentParams.filters;
            }

            let selectedFilters = {};
            (new FormData(self.form.get(0))).forEach(function(value, name) {
                if ( !selectedFilters.hasOwnProperty(name) ) {
                    selectedFilters[name] = [];
                }

                selectedFilters[name].push(value)
            });

            filters = Object.assign(filters, selectedFilters);

            Object.keys(filters).forEach(function(filter) {
                if ( !self.filters.filter('#' + filter).length ) {
                    return;
                }

                let selectedTermSlugs = selectedFilters[filter];

                if (selectedTermSlugs && selectedTermSlugs.length > 0) {
                    filters[filter] = selectedTermSlugs.join(',');
                } else {
                    delete filters[filter];
                }
            });

            self.execute(Object.assign(currentParams, { filters: filters }));
        });
    }
}