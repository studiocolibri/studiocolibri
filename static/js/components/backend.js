import LinkedSelect from './backend/linked-select';
import InputFilter from './backend/input-filter';

var headerLanguageSelect = $('.header-lang #lang-selector');
if (headerLanguageSelect) {
  new LinkedSelect(headerLanguageSelect);
}

let filters = $('#archive-filters').find('input:text, select');
if (filters) {
  filters.each(function () {
    new InputFilter($(this), {
      ajax:     false,
      multiple: false
    });
  });
}

/**
 * Events tracking
 */
import AK_Analytics from './backend/AK_Analytics';

window.AK_Analytics = AK_Analytics.registerEvents(
  {
    'link': ['link', 'click', "{path}"]
  }
);