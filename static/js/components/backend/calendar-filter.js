import SingleValueFilter from './single-value-filter';

export default class CalendarFilter extends SingleValueFilter {
  bindEvents() {
    let self = this;

    this.element.on('change', function (event, date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }

      date = day + '-' + month + '-' + year;

      self.applyFilter('date', date)
    });
  }
}