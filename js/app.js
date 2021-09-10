// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners (){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}
// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto =Number(presupuesto) ;
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const totalGasto = this.gastos.reduce((total,gasto)=>total+gasto.cantidad,0)
        this.restante = this.presupuesto -totalGasto;
       
    }
    borrarGastoPresupuesto(id){
        this.gastos = this.gastos.filter(gasto =>gasto.id !== id);
        this.calcularRestante();
        console.log(this.gastos);
    }
}
class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert','text-center');
        divMensaje.textContent = mensaje;
        if(tipo ==='error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        document.querySelector('.primario').insertBefore(divMensaje,formulario);
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }
    imprimirGasto(gastoArray){
        const {gastos} = gastoArray;
        this.limpiarHTML();
        gastos.forEach(gasto => {
            const {nombre,cantidad,id} = gasto;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.setAttribute('data-id',id);
            // li.dataset.id = id; es otra manera en versiones nuevas de poner los atributos personalizados
            li.innerHTML=`
             ${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = ()=>{
                borrarGasto(id);
            }

            li.appendChild(btnBorrar)
            listaGastos.appendChild(li);
        });
    }
    limpiarHTML(){
       while(listaGastos.firstChild){
           listaGastos.removeChild(listaGastos.firstChild)
       }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    cambiarEstiloRestanteHTML(presupuestoObj){
        const {restante,presupuesto} = presupuestoObj;
        const divRestante = document.querySelector('.restante');
        if((presupuesto/4)>restante){
            divRestante.classList.remove('alert-success','alert-warning')
            divRestante.classList.add('alert-danger');
        } else if ((presupuesto/2)>restante){
            divRestante.classList.remove('alert-success','alert-danger');
            divRestante.classList.add('alert-warning');
        } else {
            divRestante.classList.remove('alert-danger','alert-warning')
            divRestante.classList.add('alert-success');
        }
        if(restante<=0){
            this.imprimirAlerta('El restante se ha pasado del presupuesto','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
            console.log('disabled')
        }
    }
}
// Instanciar clases
let presupuesto; // instancio asi porque recibe un argumento, en este caso, del prompt
const ui = new UI();

// Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')
    
    // Validación
    if(presupuestoUsuario ===''||presupuestoUsuario ===null||presupuestoUsuario<=0||isNaN(presupuestoUsuario)){
        window.location.reload();
    }
    // Una vez pasada la validacion ya tenes un presupuesto
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}
function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    // Validación

    if(nombre ===''||cantidad ===''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    } else if (cantidad<=0 ||isNaN(cantidad)){
         return ui.imprimirAlerta('Cantidad no válida','error');    
    }
    // Paso la validación...

    const gastoObj = { // object literal enhancement
        nombre,
        cantidad,
        id:Date.now()
    }
    presupuesto.nuevoGasto(gastoObj);
    ui.imprimirAlerta('Gasto agregado Correctamente');
    
    ui.imprimirGasto(presupuesto);
    
    const {restante} = presupuesto;
    ui.actualizarRestante(restante);
    ui.cambiarEstiloRestanteHTML(presupuesto);
    formulario.reset();
}

function borrarGasto(id){
    // const {restante} = presupuesto; no me toma en la primera eliminacion, y no se porque bien
    presupuesto.borrarGastoPresupuesto(id);
    ui.imprimirGasto(presupuesto);
    const {restante} = presupuesto;
    ui.actualizarRestante(restante); 
    ui.cambiarEstiloRestanteHTML(presupuesto);  
}