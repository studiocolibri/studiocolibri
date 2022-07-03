export default class LinkedSelect {
  constructor(select, opts) {
    this.select = select;

    this.opts = Object.assign({

    }, opts || {});

    this.bindEvents();
  }

  bindEvents() {
    let self = this;

    this.select.on('change', function (e) {
      document.location.href = $(this).val();
    });
  }
}