import 'jquery-easing';

export default class SmoothScroll {

  constructor(context = document) {

    if(window.location.hash && $(window.location.hash).length > 0) {

      $('html, body').animate({
        scrollTop:$(window.location.hash).offset().top - 100
      }, 1500, 'easeInOutQuint');

    }

    $(context).on('click', '.js-scroll', function() {

      var scrollSection = $(this).closest('section').next('section');

      $(this).blur();

      if($(scrollSection).length > 0) {

        $('html, body').animate({
          scrollTop: scrollSection.offset().top - 100
        }, 1000, 'easeInOutQuint');

        return false;

      } else {
        return;
      }

    });

    $(context).on('click','.header-navigation [href*="#"]',function(){

      //$(this).addClass('is-active').addClass('is-current');
      //$('.header').addClass('is-scrolling');

      var the_id = $(this).attr('href');

      var new_id = the_id.slice(the_id.indexOf('#'),the_id.length);

      if($(new_id).length > 0) {

        $('html, body').animate({
          scrollTop:$(new_id).offset().top - 100
        }, 1000, 'easeInOutQuint',function(){
          $('.header').removeClass('is-scrolling');
          $('.is-active.is-current').blur().removeClass('is-current');
        });

        if($('body').hasClass('open-menu')) {
          $('body').removeClass('open-menu');
        }

        $(this).bur();

        return false;

      } else {
        return;
      }

    });

    $(document).on('click','.scroll-top',function(){

      $(this).blur();

      setTimeout(function(){
        $('html, body').animate({
          scrollTop:0
        }, 1500, 'easeInOutQuart');
      },200);

    });

  }
  
}