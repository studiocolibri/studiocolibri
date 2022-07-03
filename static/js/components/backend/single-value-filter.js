import ArchiveFilter from './archive-filters';

export default class SingleValueFilter extends ArchiveFilter {
    constructor(element, opts) {
        super(opts);

        this.element = element;

        this.opts = Object.assign(this.opts, {
          multiple: true
        }, opts || {});

        this.bindEvents();
    }

    applyFilter(name, value) {
      let currentParams = ArchiveFilter.getQueryParams();
      let filters = {};

      if (currentParams && currentParams.filters) {
        if (this.opts.multiple) {
          filters = currentParams.filters;
        }

        delete currentParams.filters;
      }

      let selectedFilter = name;
      let selectedValue = value;

      if (selectedValue && selectedValue !== 'default') {
        filters[selectedFilter] = selectedValue;
      } else {
        delete filters[selectedFilter];
      }

      this.execute(Object.assign(currentParams, { filters: filters }));
    }

    bindEvents() {
        let self = this;

        this.element.on('change', function (event) {
          self.applyFilter(
            $(event.target).attr('name'),
            $(event.target).val()
          )
        });
    }
}