export default class Header {

  constructor(context = document) {

    // Responsive Nav icon
    $('.header__main').append( '<button class="nav-btn" aria-expanded="false" aria-controls="header-navigation" aria-haspopup="true"><span class="nav-label">Menu</span><span class="nav-toggle"><b class="top"></b><b class="middle"></b><b class="bottom"></b></span></button>' );
    $(document).on('click','.nav-btn',function(){
      let body = $('body');
      body.toggleClass('open-menu');
      if(body.hasClass('open-menu')) {
        $('.nav-btn').attr('aria-expanded','true');
      } else {
        $('.nav-btn').attr('aria-expanded','false');
      }
    });

    let scrollPos = 200;
    const nav = document.querySelector('.header');

    function checkPosition() {
      let windowY = window.scrollY;
      if (windowY < scrollPos) {
        nav.classList.remove('is-small');
      } else {
        nav.classList.add('is-small');
      }
    }

    window.addEventListener('scroll', checkPosition);

  }

}