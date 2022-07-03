import 'babel-polyfill';

export default class WebsiteCarbonResult {

  constructor() {
    this.resultSection = document.getElementById('website-carbon-result');

    if (this.resultSection) {
      this.init();
    }
  }

  init() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    if( urlParams.has('site') ) {
      this.getResult(urlParams.get('site'));
    }

  }

  async getResult(website) {

    document.body.classList.add('loading');
    
    let url = 'https://studiocolibri.be/carbonapi/v2/?website=' + website;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {}
      });

      function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
      }

      const websiteData = await response.json();
      const pageKo = parseFloat(websiteData.bytes/10000,1).toFixed(1);
      const gramsCo2 = parseFloat(websiteData.statistics.co2.renewable.grams,2).toFixed(2);
      const cleanerThan = websiteData.cleanerThan*100;

      const websiteUrl = websiteData.url;
      const pageSize = pageKo < 1000 ? pageKo + ' Ko' : parseFloat((pageKo/1000),2).toFixed(2) + ' Mo';

      document.getElementById('totalCO2').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('totalCO2').dataset.base),1).toFixed(1);
      document.getElementById('heatingDays').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('heatingDays').dataset.base),1).toFixed(1);
      document.getElementById('smartphonesProducts').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('smartphonesProducts').dataset.base),1).toFixed(1);
      document.getElementById('kmFly').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('kmFly').dataset.base),1).toFixed(1);
      document.getElementById('kmCar').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('kmCar').dataset.base),1).toFixed(1);
      document.getElementById('paper').innerHTML = kFormatter(parseFloat(((gramsCo2 * 120) / document.getElementById('paper').dataset.base),1).toFixed(1));
      document.getElementById('trash').innerHTML = parseFloat(((gramsCo2 * 120) / document.getElementById('trash').dataset.base),1).toFixed(1);

      if(cleanerThan >= 50) {

        const isGreen = websiteData.green ? 'Et en plus de ça, votre hébergeur <strong class="is-success">semble fonctionner à l\'énergie durable</strong>.' : 'Par contre, votre hébergeur <strong class="is-warning">ne semble pas fonctionner à l\'énergie durable</strong>.';

        setTimeout(function(){
          document.getElementById('website-carbon-result').classList.add('is-success');
          document.getElementById('resultTitle').innerHTML = 'Wow, bravo ! 🎉 <br /><strong>' + websiteUrl + '</strong> ne pèse que <strong>' + pageSize + '</strong> et n’émettrait donc que <strong>' + gramsCo2 + 'g</strong> de CO2 par visite ! <span>*</span>';
          document.getElementById('resultIsGreen').innerHTML = isGreen;
          document.getElementById('resultCleanerThanPercent').innerHTML = cleanerThan + '<small>%</small>';
          document.getElementById('resultCleanerThan').innerHTML = 'Plus propre que ' + cleanerThan + '% des sites testés ·';

          document.body.classList.remove('loading');
          document.querySelector('.result__content').classList.remove('is-hidden');
        },2000);
  
      } else if(cleanerThan < 50) {

        const isGreen = websiteData.green ? 'Par contre, votre hébergeur <strong class="is-success">semble fonctionner à l\'énergie durable</strong>.' : 'Et en plus de ça, votre hébergeur <strong class="is-warning">ne semble pas fonctionner à l\'énergie durable</strong>.';

        setTimeout(function(){
          document.getElementById('website-carbon-result').classList.add('is-warning');
          document.getElementById('resultTitle').innerHTML = 'Mmmmh 🤔 <br />On dirait que <strong>' + websiteUrl + '</strong> n’est pas vraiment optimisé ! Cette page pèse <strong>' + pageSize + '</strong> et génère <strong>' + gramsCo2 + 'g</strong> de CO2 par visite ! <span>*</span>';
          document.getElementById('resultIsGreen').innerHTML = isGreen;
          document.getElementById('resultCleanerThanPercent').innerHTML = (100-cleanerThan) + '<small>%</small>';
          document.getElementById('resultCleanerThan').innerHTML = 'Plus émissif que ' + (100-cleanerThan) + '% des sites testés ·';

          document.body.classList.remove('loading');
          document.querySelector('.result__content').classList.remove('is-hidden');
        },2000);
        
      } else {
        document.getElementById('resultTitle').innerHTML = 'Il y a une erreur dans votre url, <a href="/#tester-mon-site">veuillez réessayer</a>.';
        document.body.classList.remove('loading');
      }

    } catch (error) {
      document.getElementById('resultTitle').innerHTML = 'Il y a une erreur dans votre url, <a href="/#tester-mon-site">veuillez réessayer</a>.';
      document.body.classList.remove('loading');
    }

  }


}