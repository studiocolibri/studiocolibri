import slick from 'slick-carousel';

export default class Carousel {

  constructor() {

    $('.carousel__list').slick({
      slidesToShow: 3,
      lazyLoad: 'ondemand',
      infinite: false,
      slidesToScroll: 1,
      focusOnSelect: false,
      speed: 400,
      cssEase: 'cubic-bezier(0.77, 0, 0.175, 1)',
      swipe: true,
      draggable: false,
      autoplay: false,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3.2,
            cssEase: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
          }
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2.2,
            cssEase: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1.1,
            cssEase: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
          }
        }
      ]
    }).on('setPosition', function (event, slick) {
      slick.$slides.css('height', slick.$slideTrack.height() + 'px');
    });

  }

}