export default class Card {

  constructor(context = document) {

    this.cardFlipButtons = document.querySelectorAll('.js-flip-card');

    if (this.cardFlipButtons) {
      this.init();
    }

  }

  init() {
    this.cardFlipButtons.forEach(item => {
      item.addEventListener('click', (e) => this.toggleCard(e));
    });
  }

  toggleCard(event) {
    event.preventDefault();
    const $el = event.currentTarget;
    $el.closest('.card').classList.toggle('is-flipped');
  }

}