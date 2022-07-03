import ArchiveFilter from './archive-filters';

export default class InputFilter extends ArchiveFilter {
    constructor(input, opts) {
        super(opts);

        this.input = input;

        this.opts = Object.assign(this.opts, {
          multiple: true
        }, opts || {});

        this.bindEvents();
    }

    bindEvents() {
        let self = this;

        this.input.on('change', function (e) {
            e.preventDefault();

            let currentParams = InputFilter.getQueryParams();
            let filters = {};

            if (currentParams && currentParams.filters) {
                if (self.opts.multiple) {
                  filters = currentParams.filters;
                }

                delete currentParams.filters;
            }

            let selectedFilter = $(this).attr('name');
            let selectedValue = $(this).val();

            if (selectedValue && selectedValue !== '') {
                filters[selectedFilter] = selectedValue;
            } else {
                delete filters[selectedFilter];
            }

            self.execute(Object.assign(currentParams, { filters: filters }));
        });
    }
}