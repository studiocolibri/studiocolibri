export default class Grid {

  constructor(context = document) {

    this.filterButtons = document.querySelectorAll('.js-filter-grid');

    if (this.filterButtons) {
      this.init();
    }

  }

  init() {
    this.filterButtons.forEach(item => {
      item.addEventListener('click', (e) => this.filterGrid(e));
    });
  }

  filterGrid(event) {
    event.preventDefault();
    const $el = event.currentTarget;

    document.querySelector('.is-active-tab').classList.remove('is-active-tab');

    $el.classList.add('is-active-tab');
    $el.closest('.article').dataset.current = $el.id;
  }

}