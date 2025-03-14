const participantes = JSON.parse(localStorage.getItem("participantes")) || [];
let turnoActual = 0;
let tiempoRestante = 10;
let temporizadorActivo = false;
let puntos = JSON.parse(localStorage.getItem("puntos")) || {};

// Definir categorías de retos
const retos = {
    "Romántico": [
        "Dile a tu pareja 3 cosas que te encantan de ella.",
        "Besa a tu pareja por 20 segundos.",
        "Dale un masaje en la espalda por 2 minutos.",
        "Escribe una nota de amor y léesela en voz alta.",
        "Dale un beso en una parte del cuerpo que elija.",
        "Dedícale una canción cantándola tú mismo.",
        "Mira fijamente a los ojos de tu pareja por 1 minuto sin hablar.",
        "Hazle un cumplido sincero que nunca antes le hayas dicho.",
        "Dale un abrazo de más de 30 segundos.",
        "Recrea su escena romántica favorita de una película."
    ],
    "Atrevido": [
        "Susurra algo picante al oído de tu pareja.",
        "Haz un baile sensual por 30 segundos.",
        "Deja que tu pareja escoja un reto atrevido para ti.",
        "Muerde suavemente el cuello de tu pareja.",
        "Besa a tu pareja en un lugar que nunca hayas besado antes.",
        "Dile a tu pareja tu fantasía más atrevida.",
        "Envía un mensaje de voz seductor sin contexto.",
        "Déjate vendar los ojos y permite que tu pareja haga lo que quiera por 1 minuto.",
        "Hazle un striptease corto a tu pareja.",
        "Haz que tu pareja te dé órdenes durante los próximos 5 minutos."
    ],
    "Divertido": [
        "Habla como un personaje de caricatura por 1 minuto.",
        "Baila como un robot por 30 segundos.",
        "Cuenta un chiste y haz reír a tu pareja.",
        "Imita a tu pareja durante 1 minuto.",
        "Haz la peor imitación de un cantante famoso.",
        "Camina como un pingüino hasta la cocina y regresa.",
        "Dibuja a tu pareja con los ojos cerrados y muéstrale el resultado.",
        "Canta una canción reemplazando todas las vocales con 'A'.",
        "Ponte algo al revés y quédate así por 3 minutos.",
        "Explica cómo cepillarse los dientes como si fueras un alienígena."
    ]
};

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem("participantes", JSON.stringify(participantes));
    localStorage.setItem("puntos", JSON.stringify(puntos));
}

// Función para actualizar la lista de participantes
function actualizarListaParticipantes() {
    const lista = document.getElementById("listaParticipantes");
    lista.innerHTML = "";
    participantes.forEach((nombre, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${nombre} (${puntos[nombre]} pts) 
            <button class="editar" onclick="editarParticipante(${index})">✏️</button>
            <button class="eliminar" onclick="eliminarParticipante(${index})">❌</button>`;
        lista.appendChild(li);
    });
    guardarDatos();
}

// Mostrar sección de edición
document.getElementById("btnEditar").addEventListener("click", function () {
    document.getElementById("participantes-container").style.display = "block";
});

// Agregar participante
document.getElementById("btnAgregar").addEventListener("click", () => {
    const nombre = document.getElementById("inputNombre").value.trim();
    if (nombre && !participantes.includes(nombre)) {
        participantes.push(nombre);
        puntos[nombre] = 0;
        actualizarListaParticipantes();
        document.getElementById("inputNombre").value = "";

        if (participantes.length >= 2) {
            document.getElementById("btnIniciar").disabled = false;
        }
    }
});

// Función para editar un participante
function editarParticipante(index) {
    const nuevoNombre = prompt("Editar nombre:", participantes[index]);
    if (nuevoNombre && !participantes.includes(nuevoNombre)) {
        puntos[nuevoNombre] = puntos[participantes[index]];
        delete puntos[participantes[index]];
        participantes[index] = nuevoNombre;
        actualizarListaParticipantes();
    }
}

// Función para eliminar un participante
function eliminarParticipante(index) {
    delete puntos[participantes[index]];
    participantes.splice(index, 1);
    actualizarListaParticipantes();

    if (participantes.length < 2) {
        document.getElementById("btnIniciar").disabled = true;
    }
}

// Iniciar juego
document.getElementById("btnIniciar").addEventListener("click", () => {
    document.getElementById("participantes-container").style.display = "none";
    document.getElementById("btnIniciar").style.display = "none";
    document.getElementById("juego-container").style.display = "block";
    
    turnoActual = 0;
    actualizarTurno();
});

// Generar reto
document.getElementById("btnReto").addEventListener("click", () => {
    const categoria = Object.keys(retos)[Math.floor(Math.random() * 3)];
    const retoAleatorio = retos[categoria][Math.floor(Math.random() * retos[categoria].length)];

    document.getElementById("reto").textContent = `${categoria}: ${retoAleatorio}`;
    tiempoRestante = 10;
    iniciarTemporizador();

    puntos[participantes[turnoActual]] += 3; // Sumar puntos por completar reto
    actualizarListaParticipantes();

    turnoActual = (turnoActual + 1) % participantes.length;
    actualizarTurno();
});

// Función para actualizar el turno
function actualizarTurno() {
    document.getElementById("turno").textContent = `Turno de: ${participantes[turnoActual]}`;
}

// Temporizador para retos
function iniciarTemporizador() {
    if (temporizadorActivo) return;
    
    temporizadorActivo = true;
    const display = document.getElementById("temporizador");
    
    const intervalo = setInterval(() => {
        display.textContent = `Tiempo restante: ${tiempoRestante} s`;
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            temporizadorActivo = false;
            puntos[participantes[turnoActual]] -= 1; // Penalización por tiempo agotado
            actualizarListaParticipantes();
            display.textContent = "¡Tiempo agotado!";
        }
        tiempoRestante--;
    }, 1000);
}

// Opción de rechazar reto con penalización
document.getElementById("btnRechazar").addEventListener("click", () => {
    puntos[participantes[turnoActual]] -= 2; // Penalización por rechazar reto
    actualizarListaParticipantes();
    
    turnoActual = (turnoActual + 1) % participantes.length;
    actualizarTurno();
});

// Mostrar puntajes
document.getElementById("btnPuntajes").addEventListener("click", () => {
    let mensaje = "📊 Puntajes actuales:\n\n";
    participantes.forEach(p => {
        mensaje += `${p}: ${puntos[p]} pts\n`;
    });
    alert(mensaje);
});


// Cargar lista de participantes al iniciar
actualizarListaParticipantes();