//Selectores
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Cargar Evento
document.addEventListener('DOMContentLoaded', () => {
    obtenerCriptos();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

//Funciones
function obtenerCriptos(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(resolve => resolve.json())
        .then(datos => descargarCriptos(datos.Data))
        .then(criptomonedas => imprimirCripts(criptomonedas))
}
//Promesa para obtener las criptomonedas más populares
const descargarCriptos = (criptomonedas) => new Promise(resolve => {
    resolve(criptomonedas);
});

function imprimirCripts(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo
        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    });
}
function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    if(monedaSelect.value === '' || criptomonedasSelect.value === ''){
        imprimirAlerta('Ambos campos son obligatorios...');
        return;
    }
    //Consultar API
    consultarAPI();
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then(resolve => resolve.json())
        .then(datos => mostrarCotizacion(datos.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacion(cotizacion){
    limpiarHTML();

    const {PRICE, LASTUPDATE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR} = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `Precio: <span>${PRICE}</span>`

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más alto del día: ${HIGHDAY}`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más bajo del día: ${LOWDAY}`;

    const variacion = document.createElement('P');
    variacion.innerHTML = `Variación últimas 24 HRS: ${CHANGEPCT24HOUR}%`;

    const actulizacion = document.createElement('P');
    actulizacion.innerHTML = `Última actualización: ${LASTUPDATE}`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(actulizacion);
}

function imprimirAlerta(mensaje){
    const div = document.createElement('DIV');
    const alerta = document.querySelector('.alerta');
    if(!alerta){
        div.textContent = mensaje;
        div.classList.add('alerta', 'error');
        formulario.appendChild(div);

        setTimeout(() => {
            div.remove();
        }, 2000);
        
    }
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}