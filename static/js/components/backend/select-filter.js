import ArchiveFilter from './archive-filters';

export default class SelectFilter extends ArchiveFilter {
    constructor(select, opts) {
        super(opts);

        this.select = select;

        this.opts = Object.assign(this.opts, {
          multiple: true
        }, opts || {});

        this.bindEvents();
    }

    bindEvents() {
        let self = this;

        this.select.on('change', function (e) {
            e.preventDefault();

            let currentParams = SelectFilter.getQueryParams();
            let filters = {};

            if (currentParams && currentParams.filters) {
                if (self.opts.multiple) {
                  filters = currentParams.filters;
                }

                delete currentParams.filters;
            }

            let selectedFilter = $(this).attr('name');
            let selectedValue = $(this).val();

            if (selectedValue && selectedValue !== '0') {
                filters[selectedFilter] = selectedValue;
            } else {
                delete filters[selectedFilter];
            }

            self.execute(Object.assign(currentParams, { filters: filters }));
        });
    }
}