
var minuto;


var Empresas;
//var Empresas = [{ id: 1, nombre: "repsol", img: "images/descarga.png" }, { id: 2, nombre: "BBVA", img: "images/BBVA.png" }, { id: 3, nombre: "Ferrovial", img: "images/1280px-Ferrovial_Logo.svg.png" }];
if (window.localStorage.getItem("empresasSeleccionadas") == undefined) {
    window.localStorage.setItem("empresasSeleccionadas", '{}');
}

//Esto comprueba que no haya un token 
setInterval(function () {
    if (!localStorage.getItem("token")) {
        // Si no hay un token de inicio de sesión mostrar el formulario de inicio de sesión
        let divf = document.getElementById("form");
        divf.style.display = "block";
        document.querySelector("#registrarse").addEventListener("click", function () {
            document.querySelector("#loginF").style.display = "none";
            document.querySelector("#formR").style.display = "block";

        });

        document.querySelector("#login").addEventListener("click", function () {
            document.querySelector("#loginF").style.display = "block";
            document.querySelector("#formR").style.display = "none";

        });
        let cont = document.getElementById("hola");
        cont.classList.add("blur");
    }
}, 1000)

//Esto comprueba que hay un token
if (localStorage.getItem("token")) {
    // Hay un usuario logueado
    console.log("Usuario logueado");
    var bienvenido = document.getElementById("titular");
    var user = localStorage.getItem("usuario");
    bienvenido.innerHTML = "<h2> Bienvenido" + " " + user + "</h2>"
    var boton = document.getElementById("boton");


    //var ibex = document.getElementById("botones");
    boton.innerHTML = "<button id='logoutBtn' class='btn btn-success btn-lg btn-outline-dark mx-auto text-white font-weight-bold'>Cerrar Sesion</button>";
    //Cerrar sesión
    var logout = document.getElementById("logoutBtn");
    logout.addEventListener("click", function () {
        // Elimina la información del usuario logueado del navegador
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        // Recargar pagina
        location.reload();
    })
    document.getElementById("borra").style.display = "block";
    document.getElementById("mostrar").style.display = "block";
} else {
    // No hay un usuario logueado
    console.log("No hay un usuario logueado");
}


formulario = document.getElementById('loguear');
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    var datal = new FormData(formulario);
    // Agrega los datos del usuario a un objeto
    var userData = {
        email: datal.get("email"),
        password: datal.get("password")
    };
    // Envia los datos del usuario al servidor
    fetch('http://10.10.17.164/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            responseGlobal = response;

            var error = document.getElementById("error");
            var inicio = document.getElementById("inicio");
            localStorage.removeItem("usuario");
            if (response.status === "success") {
                console.log("Usuario encontrado, iniciando sesión...");
                // Código para iniciar sesión del usuario
                let token = response.authorisation.token;
                let usuario = response.user.name;
                localStorage.setItem("token", token);
                localStorage.setItem("usuario", usuario);
                //alert(usuario);

                error.innerHTML = "";
                inicio.innerHTML = "Usuario encontrado, iniciando sesion...";
                inicio.style.color = "green";
                location.reload();

            } else {
                console.log("Usuario no encontrado, verifica tus credenciales");
                error.innerHTML = "Usuario o contraseña incorrectos revise los datos";
                error.style.color = "red";
                // Código para mostrar un error al usuario
            }
        })
        .catch(err => console.error(err));
});

//Registrar un usuario
formularioR = document.getElementById('registrar');
formularioR.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(formularioR);
    const options = { method: 'POST', body: data };
    fetch('http://10.10.17.164/api/register', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    var registrado = document.getElementById("registrado")
    registrado.innerHTML = "Usuario registrado";
    registrado.style.color = "green";
    location.reload();

});




$(document).ready(function () {
    // Asociación del evento click al elemento con id "borra"
    $("#borra").click(function () {
        // Elimina todo el contenido del elemento con id "conf" que está dentro de un elemento con id "prueba"
        $("#prueba #conf").empty();
        // Elimina todo el contenido del elemento con id "conf2" que está dentro de un elemento con id "prueba"
        $("#prueba #conf2").empty();
        // Elimina el item con clave "empresasSeleccionadas" del almacenamiento local
        localStorage.removeItem("empresasSeleccionadas");
        // Establece el item con clave "empresasSeleccionadas" en el almacenamiento local con un objeto vacío en formato JSON
        window.localStorage.setItem("empresasSeleccionadas", '{}');
        // Llama a la función listenToDragable()
        listenToDragable();
        // Limpia el intervalo con nombre "minuto"
        clearInterval(minuto)
    });
    // Llama a la función listenToDragable()
    listenToDragable();

    function listenToDragable() {
        // Asociación de la propiedad draggable a los elementos con clase "item"
        $('.item').draggable({
            // El elemento clonado será utilizado como "ayudante" durante el proceso de arrastre
            helper: 'clone'
        });
        // Asignar comportamiento de "droppable" al elemento con id "conf"
        $('#conf').droppable({
            // Aceptar solamente elementos con clase "item"
            accept: '.item',
            // Agregar clase "hovering" cuando se está arrastrando un elemento sobre él
            hoverClass: 'hovering',
            // Función que se ejecuta cuando se suelta un elemento sobre el elemento "droppable"
            drop: function (event, ui) {
                // Prevenir que el evento se propague a otros elementos
                event.stopPropagation();

                // Obtener el id de la empresa que se está arrastrando
                var empresaId = ui.draggable.attr("id");

                // Obtener las empresas seleccionadas almacenadas en local storage
                var empresasSeleccionadas = JSON.parse(window.localStorage.getItem("empresasSeleccionadas"));

                // Verificar si la empresa que se está arrastrando ya está seleccionada
                if (empresasSeleccionadas[empresaId] != undefined || empresasSeleccionadas[empresaId] != null) {
                    // Mostrar un mensaje de error
                    alert("ya existe")
                } else {
                    // Crear una copia del elemento arrastrado
                    var $clone = $(ui.draggable).clone();
                    // Añadir la copia al elemento "droppable"
                    $clone.appendTo(this);
                    // Hacer que los elementos con clase "item" sean arrastrables
                    $('.item').draggable();

                    // Buscar la empresa correspondiente en el arreglo "Empresas"
                    var found = Empresas.filter(function (item) { return item.id == empresaId; });

                    // Almacenar la empresa seleccionada en el objeto "empresasSeleccionadas"
                    empresasSeleccionadas[empresaId] = found;

                    // Guardar el objeto "empresasSeleccionadas" en local storage
                    window.localStorage.setItem("empresasSeleccionadas", JSON.stringify(empresasSeleccionadas))
                }
            },
        });




        $('#trans').droppable({
            //declaramos que este elemento es un droppable, lo que significa que puede recibir elementos arrastrables 
            accept: '.item',
            //especificamos que solo acepta elementos con la clase "item"
            hoverClass: 'hovering',
            //agregamos una clase "hovering" al elemento cuando se está sobre él con un elemento arrastrable
            drop: function (ev, ui) {
                //cuando se suelta un elemento arrastrable sobre el elemento, se ejecuta la siguiente función
                var empresaId = ui.draggable.attr("id");
                //obtenemos el id del elemento arrastrable y lo guardamos en la variable "empresaId"
                var empresasSeleccionadas = JSON.parse(window.localStorage.getItem("empresasSeleccionadas"));
                //obtenemos el valor guardado en el almacenamiento local con la clave "empresasSeleccionadas" y lo guardamos en la variable "empresasSeleccionadas"
                var values = Object.values(empresasSeleccionadas);
                //obtenemos los valores del objeto "empresasSeleccionadas" y los guardamos en la variable "values"
                ui.draggable.detach();
                Object.entries(empresasSeleccionadas).forEach(([key, value]) => {
                    //recorremos las entradas del objeto "empresasSeleccionadas"
                    if (key === empresaId) {
                         //eliminamos el elemento arrastrable del documento
                $(ui.draggable).hide('slow', function () { $(ui.draggable).remove() })
                        //si la clave actual es igual a "empresaId"
                        delete empresasSeleccionadas[key];
                        //eliminamos la entrada con esa clave
                    }
                });

                localStorage.setItem("empresasSeleccionadas", JSON.stringify(empresasSeleccionadas));;
                //guardamos el objeto actualizado "empresasSeleccionadas" en el almacenamiento local
            }


        });


    }




  // Función asíncrona para obtener usuarios
async function getUsers() {
    // Realiza una solicitud GET a la API especificada
    await fetch('http://10.10.17.164/api/empresas', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // Agrega el token de autorización a la solicitud
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json()) // Convierte la respuesta a formato JSON
      .then(response => {
        // Asigna la respuesta a la variable Empresas
        Empresas = response;
        // Itera a través de las empresas y agrega un elemento de imagen a la página
        Empresas.forEach(empresa => {
          document.getElementById("trans").innerHTML += '<img class="item" id="' + empresa.empresa + '" src="images/' + empresa.empresa + '.png" width="200" height="150"  alt="'+empresa.empresa+'">'
        });
        listenToDragable();
      })
      .catch(error => console.log(error)); // Maneja cualquier error que se pueda producir
  }
  
  // Llamada a la función getUsers cuando se carga la página
  window.onload = function () {
    getUsers();
  }
  



});

// Función para cargar las cotizaciones de las empresas seleccionadas
function cotizaciones() {
    // Obteniendo los elementos HTML por id
    var seleccionar = document.getElementById("seleccionar");
    var conf = document.getElementById("conf");
    var trans = document.getElementById("trans");
    
    // Ocultando los elementos HTML por id
    conf.style.display = "none";
    trans.style.display = "none";
    seleccionar.style.display = "block";
    
    // Obteniendo el elemento HTML conf2 por id
    var conf2 = document.getElementById("conf2");
    
    // Mostrando el elemento HTML conf2
    conf2.style.display = "block";
    
    // Limpiando el contenido del elemento HTML conf2
    document.getElementById("conf2").innerHTML = "";
    
    // Obteniendo las empresas seleccionadas desde el local storage
    var empresasSeleccionadas = JSON.parse(window.localStorage.getItem("empresasSeleccionadas"));
    
    // Recorriendo las empresas seleccionadas y obteniendo sus cotizaciones y diferencias
    Object.entries(empresasSeleccionadas).forEach(([key, value]) => {
        getCotizacion(key);
        getDiferencia(key);
    });
    
    // Limpiando el intervalo y definiendo un nuevo intervalo para actualizar cada 60 segundos
    clearInterval(minuto);
    minuto = setInterval(actualizar, 60000);

}


// Función para mostrar la sección de empresas seleccionadas
function seleccionadas() {
    // Oculta la sección de selección de empresas
    var seleccionar = document.getElementById("seleccionar");
    seleccionar.style.display = "none";

    // Muestra la sección de configuración
    var conf = document.getElementById("conf");
    conf.style.display = "block";

    // Muestra la sección de transacciones
    var trans = document.getElementById("trans");
    trans.style.display = "block";

    // Oculta la sección de configuración secundaria
    var conf2 = document.getElementById("conf2");
    conf2.classList.remove("d-flex")
    conf2.classList.remove("justify-content-center")
    conf2.style.display = "none";
}




// Función que obtiene la cotización de una empresa específica a través de una petición a la API
async function getCotizacion(nombre) {
    // Realiza una petición GET a la API usando el nombre de la empresa como parámetro
    await fetch('http://10.10.17.164/api/ultima/' + nombre, {
        method: 'GET',
        headers: {
            // Agrega la autorización y el tipo de contenido en los headers
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            // Al obtener una respuesta satisfactoria, guarda la cotización en una variable global "ultima"
            ultima = response;
            // Añade una tarjeta a la sección "conf2" con información sobre la empresa y un botón para ver su gráfico
            $("#conf2").append('<div class="card col-xl-8 col-lg-3 col-md-6 col-sm-7 mx-auto bg-light" style="width:55%;"><img  src=images/' + nombre + '.png alt="Avatar" class="card-img-top mx-auto" style="width:80%; height: auto;"><div class="container card-body"><h1 id=clase' + nombre + '></h1><button class="btn btn-primary  btn-outline-dark " id="btn' + nombre + '">Ver Grafico</button><div id="modal' + nombre + '" class="modalContainer"><div id="modal-content-' + nombre + '"class="modal-content"><span class="close' + nombre + '">×</span><div id="modal-chart-' + nombre + '"></div> </div></div> </div></div>');
            // Llama a la función "actualizarCotización" para actualizar la información en la tarjeta
            actualizarCotizacion(nombre)
        })
        .catch(error => console.log(error));
}

// Función que actualiza la cotización de un activo
async function actualizarCotizacion(nombre) {
    // Realiza una petición GET a la API para obtener la última cotización del activo con nombre 'nombre'
    await fetch('http://10.10.17.164/api/ultima/' + nombre, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Agrega la cabecera de autorización con el token almacenado en el localStorage
            'Content-Type': 'application/json'
        }
    })
        // Procesa la respuesta y la convierte a formato JSON
        .then(response => response.json())
        // Actualiza el valor de la cotización en la página
        .then(response => {
            ultima = response;
            $('#clase' + nombre).html(JSON.stringify(ultima.var));
        })
        // Muestra un error en caso de que algo salga mal
        .catch(error => console.log(error));
}


async function getDiferencia(nombre) {
    // Hace una petición GET a la API con el nombre de la empresa
    await fetch('http://10.10.17.164/api/resto/' + nombre, {
        method: 'GET',
        headers: {
            // Agrega la autorización y el tipo de contenido en los headers
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            // Almacena el resultado en una variable
            var boolean = response;
            // Guarda en una variable el id del elemento HTML
            busqueda = 'clase' + nombre;
            // Si la respuesta es 0, cambia el color a rojo, de lo contrario, verde
            if (boolean == 0) {
                document.getElementById(busqueda).style = "color: red";
            } else {
                document.getElementById(busqueda).style = "color: green";
            }
            // Después de 20 segundos, establece el color de todos los elementos con id que comienza con "clase" a negro
            setTimeout(function () {
                document.querySelectorAll('h1[id^="clase"]').forEach(function (element) {
                    element.style = "color:black";
                });
            }, 20000);
            // Obtiene las empresas seleccionadas en el almacenamiento local
            var empresasSeleccionadas = JSON.parse(window.localStorage.getItem("empresasSeleccionadas"));
            // Recorre cada una de las empresas seleccionadas y llama a las funciones correspondientes
            Object.entries(empresasSeleccionadas).forEach(([key, value]) => {
                openModal(key)
                getCotizacionEmpresa(key);
            });

        })
        .catch(error => console.log(error));
}

async function getCotizacionEmpresa(nombre) {
    await fetch('http://10.10.17.164/api/datos/' + nombre, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            var variables = [];
            var fechas = [];
            var step = 7;
            datos = response;
            datos.forEach(function (elemento, index) {
                if (index % step === 0) {
                    variables.push(elemento.var)
                    fechas.push(elemento.fecha)
                }
            });

            $('#modal-chart-' + nombre + '').highcharts({
                title: {
                    text: 'Resumen de acciones',
                    x: -20 //center
                },
                xAxis: {
                    categories: fechas
                },
                yAxis: {
                    title: {
                        text: 'Acciones (€)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '€'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Acciones',
                    data: variables
                }],
                exporting: {
                    buttons: {
                        contextButton: {
                            enabled: false
                        },
                        exportButton: {
                            text: 'Descargar',
                            align: 'right',
                            x: -10,
                            y: 0,
                            menuItems: [{
                                text: 'Exportar a PDF',
                                onclick: function () {
                                    this.exportChart({ type: 'application/pdf' });
                                }
                            }, {
                                text: 'Exportar a Excel',
                                onclick: function () {
                                    this.exportChart({ type: 'application/vnd.ms-excel' });
                                }
                            }]
                        }
                    }
                }
            });

        })
        .catch(error => console.log(error));

}

function openModal(nombre) {
    var btnId = 'btn' + nombre;
    var modalId = 'modal' + nombre;
    var close = 'close' + nombre;
    var modal = document.getElementById(modalId);
    var btn = document.getElementById(btnId);
    var span = document.getElementsByClassName(close)[0];
    var body = document.getElementsByTagName("body")[0];

    btn.onclick = function () {
        modal.style.display = "block";

        body.style.position = "static";
        body.style.height = "100%";
        body.style.overflow = "hidden";
    };

    span.onclick = function () {
        modal.style.display = "none";

        body.style.position = "inherit";
        body.style.height = "auto";
        body.style.overflow = "visible";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";

            body.style.position = "inherit";
            body.style.height = "auto";
            body.style.overflow = "visible";
        }
    };
}

function actualizar() {
    var empresasSeleccionadas = JSON.parse(window.localStorage.getItem("empresasSeleccionadas"));
    Object.entries(empresasSeleccionadas).forEach(([key, value]) => {
        actualizarCotizacion(key);
        getDiferencia(key);
    });
}




