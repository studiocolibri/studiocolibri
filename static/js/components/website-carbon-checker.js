import 'babel-polyfill';

export default class WebsiteCarbonChecker {

  constructor() {
    this.form = document.getElementById('website-carbon-checker');

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.submit(e));
  }

  async submit(event) {
    event.preventDefault();

    document.body.classList.add('loading');

    const resultBox = document.querySelector('.result');
    const data = new FormData(this.form);
    let url = 'https://api.websitecarbon.com/site';
    url += "?" + new URLSearchParams(data).toString();

    resultBox.innerHTML = '';

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {}
      });

      const websiteData = await response.json();
      const pageKo = parseFloat(websiteData.bytes/10000,1).toFixed(1);
      const gramsCo2 = parseFloat(websiteData.statistics.co2.renewable.grams,2).toFixed(2);
      const cleanerThan = websiteData.cleanerThan*100;

      if(websiteData.green == true) {

        setTimeout(function(){
          resultBox.innerHTML += '<p class="success"><strong>🎉 <br />Wow, bravo !</strong> Votre page web ne pèse que ' + pageKo + 'ko et n’émet donc que ' + gramsCo2 + 'g de CO2 par visite ! Cela indique qu’elle est plus propre que ' + cleanerThan + '% des sites testés ! Envie d’aller encore plus loin ? Consultez nos ressources ! 😉</p>';
          document.body.classList.remove('loading');
        },2000);
  
      } else if(websiteData.green == false) {

        setTimeout(function(){
          resultBox.innerHTML += '<p class="warning"><strong>🤔 Mmmmh</strong> On dirait que ce site n’est pas vraiment optimisé ! Cette page pèse ' + pageKo + 'ko et génère ' + gramsCo2 + 'g de CO2 par visite, ce qui indique qu’elle est plus émissive que ' + cleanerThan + '% des sites testés. N’hésitez pas à consulter nos ressources pour améliorer votre score ! 😉</p>';
          document.body.classList.remove('loading');
        },2000);
        
      } else {
        alert('Veuillez vérifier votre url');
        document.body.classList.remove('loading');
      }

    } catch (error) {
      alert('Veuillez vérifier votre url');
      document.body.classList.remove('loading');
    }

    return false;

  }

}