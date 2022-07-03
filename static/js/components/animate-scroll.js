import 'babel-polyfill';

const defaults = {
  container: null,
  offset: 0,
  trigger: 0.1,
};

export default class AnimateScroll {

  constructor(context = document) {
    this.els = [];

    // Select element with attr data-animate-scroll
    $('[data-animate],[data-splitting]', context).each((i, el) => {
      const $el = $(el);

      if ($el.hasClass('is-animate')) return true;

      const options = Object.assign({}, defaults, $el.data());
      const $container = options.container ? $(options.container) : $el;

      // Add an element in array
      this.els.push({
        $: $el,
        offset: $container.offset().top + options.offset,
        trigger: options.trigger,
      });
    });

    // Loop if we have elements
    this.loop = null;
    if (this.els.length > 0) {
      this.onEnterFrame();
    }
  }

  destroy() {
    if (this.loop) cancelAnimationFrame(this.loop);
  }

  onEnterFrame() {
    this.loop = requestAnimationFrame(this.onEnterFrame.bind(this));

    for (const el of this.els) {
      const delta = $(window).scrollTop() + ($(window).height() - ($(window).height() * el.trigger));

      if (el.offset <= delta) {
        el.$.addClass('is-animate');
      }
    }
  }
}