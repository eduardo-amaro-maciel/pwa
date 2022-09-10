if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
    .then((reg) => console.log('sw registered', reg))
    .catch((err) => console.log('sw not registered', err))
}

const template = document.createElement('template')
template.innerHTML = `

    <style>
        #container-card { }

        .card {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: aliceblue;
            padding: 10px;
            box-sizing: border-box;
            margin-bottom: 8px;
        }
        
        .card > span {
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-size: 16px;
            margin: 8px 0;
            color: #1f1f1f;
        }
    </style>

    <div id="container-card">
       
    </div>
`

class Card extends HTMLElement {

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.appendChild(template.content.cloneNode(true))
    }


    connectedCallback() {

        const card = this.shadowRoot.getElementById('container-card')
        
        const renderCards = () => {

            if (localStorage.getItem('localizacoes') != undefined) { 
                
                /* get do 'banco' */
                let getLocalizacoes = JSON.parse(localStorage.getItem('localizacoes'))

                card.innerHTML = ''
                                
                getLocalizacoes.map((e, i) => {
                    card.innerHTML += `
                        <div class="card">
                            <span class"">id: ${i}</span>
                            <span>latitude: ${e[0]}</span>
                            <span>longitude: ${e[1]}</span>
                        </div>
                    `
                })
            }
        }

        renderCards()


        let btnAddLocation = document.getElementById('btnGetLocation')
        btnAddLocation.addEventListener('click', (event) => {

        
            if ("geolocation" in navigator) {
        
                navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
                        
                    const locationSuccess = (position) => {
        
                        let latitude = position.coords.latitude
        
                        let longitude = position.coords.longitude

                        /* verifica se o 'banco' ja existe se não ele faz um set*/
                        if (localStorage.getItem('localizacoes') == undefined) { localStorage.setItem('localizacoes', '[]') }


                        /* set no 'banco' */
                        let localizacoesLocalStorage = JSON.parse(localStorage.getItem('localizacoes'))
                        localizacoesLocalStorage.push([latitude, longitude])
                        localStorage.setItem('localizacoes', JSON.stringify(localizacoesLocalStorage));
                        
                        renderCards()
                    }
                
                    const locationError = (error = {}) => {
                        if (error.code === 1) { alert("Redefina as permissões e aceite o acesso a sua localização! ") }
                    }
                
                    navigator.geolocation.getCurrentPosition(locationSuccess, locationError)
                
                    if (result.state === 'denied') { locationError() }
                })
        
            } else {  alert("Seu navegador não possui suporte a localização :( ") }
        }) 
    }
}

window.customElements.define('card-geo', Card)