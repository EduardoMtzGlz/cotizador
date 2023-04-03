const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');  

const monedaLocalOption = document.querySelector('#moneda'); 
const criptomonedaOption = document.querySelector('#criptomonedas'); 

const mostrarResultado = document.querySelector('#resultado')

const objetoBusqueda = {
    moneda: '', 
    criptomoneda: ''
}

//Crear un promise

const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas); 
})


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario); 

    monedaLocalOption.addEventListener('change', leerValor); 
    criptomonedaOption.addEventListener('change', leerValor)
}); 





function consultarCriptomonedas(){
    const url= `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`; 

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => mostrarOpciones(criptomonedas))
}

function mostrarOpciones(resultado){
    
    resultado.forEach(cripto => {
        const {CoinInfo:{FullName, Name}} = cripto;
        const option = document.createElement('OPTION'); 

        option.value= Name; 
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option); 
        
    });   
}

function submitFormulario(event){
    event.preventDefault(); 
    
    //Validar el formulario

    const {criptomoneda, moneda} = objetoBusqueda; 

    if(criptomoneda === '' || moneda ===''){
        mostrarAlerta('Ambos campos son obligatorios'); 
        return; 
    }

    //Consultar la api  los resultados 
    consultarAPI()
    
}

function leerValor(event){
    console.log(event.target.name)
    objetoBusqueda[event.target.name] = event.target.value; 
    
    
}

function mostrarAlerta(mensaje){
    
    const error = document.querySelector('.error'); 

    if(!error){
        
        const divMensaje = document.createElement('div'); 
        divMensaje.classList.add('error'); //Agregando clase

        divMensaje.textContent = mensaje; 

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();  
        }, 3000);
    }

    
}

function consultarAPI(){
    const {criptomoneda, moneda} = objetoBusqueda; 
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`; 
    
    spinnerCarga();

    setTimeout(() => {
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])})
    }, 1000);


    
}

function mostrarCotizacionHTML(cotizacion){
    
    limpiarHTML(mostrarResultado);


    const {PRICE, LASTUPDATE, FROMSYMBOL, TOSYMBOL, HIGHDAY, LOWDAY, CHANGEPCTDAY} = cotizacion; 

    const precio = document.createElement('P'); 
    precio.classList.add('precio'); 

    precio.innerHTML = `
        El Precio actual es: <span>${PRICE}</span>
        <hr/>
        El precio máximo del día es: <span>${HIGHDAY}</span>
        <hr/>
        El precio mínimo del día es: <span>${LOWDAY}</span>
        <hr/>
        Porcentaje de cambio respecto ayer: <span>${CHANGEPCTDAY} %</span>
        <hr/>
        Última actualizacion: <span>${LASTUPDATE}</span>

    `

    mostrarResultado.appendChild(precio); 
    formulario.reset();
}



function spinnerCarga(){
    limpiarHTML(mostrarResultado); 

    const divSpinner = document.createElement('div'); 
    divSpinner.classList.add('sk-circle'); 
    
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `; 
    mostrarResultado.appendChild(divSpinner);

}

function limpiarHTML(referencia){
    while(referencia.firstChild){
        referencia.removeChild(referencia.firstChild)
    }
}