export default class Wave {

  constructor() {

    console.clear();

    var textPath = document.querySelector('#text-path');

    var textContainer = document.querySelector('#text-container');

    var path = document.querySelector( textPath.getAttribute('href') );

    var pathLength = path.getTotalLength();

    function updateTextPathOffset(offset){
      textPath.setAttribute('startOffset', offset); 
    }

    updateTextPathOffset(pathLength);

    function onScroll(){
      requestAnimationFrame(function(){
        var rect = textContainer.getBoundingClientRect();
        var scrollPercent = rect.y / window.innerHeight;
        updateTextPathOffset( scrollPercent * 2 * pathLength );
      });
    }

    window.addEventListener('scroll',onScroll);

  }

}