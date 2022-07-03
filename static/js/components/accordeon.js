export default class Accordeon {

  constructor() {

    this.els = document.querySelectorAll('.js-accordeon');

    if (this.els) {
      this.init();
    }

  }

  init() {
    this.els.forEach(el => {
      el.querySelector('.js-accordeon-button').addEventListener('click', (e) => this.toggleAccordeon(e));
    })
  }

  toggleAccordeon(event) {
    this.btn = event.currentTarget;
    this.btn.closest('.js-accordeon').classList.toggle('is-open');

    var panel = this.btn.closest('.js-accordeon').querySelector('.accordeon__text');
    
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    
    if (this.btn.getAttribute('aria-expanded') == 'true') {
      this.btn.setAttribute('aria-expanded','false');
    } else {
      this.btn.setAttribute('aria-expanded','true');
    }

  }

}