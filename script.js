// Menú con ingredientes, preparación e historia
const menu = [
  {
    nombre: "Api con Pastel",
    ingredientes: "Api de maíz morado, agua, clavo de olor, maíz morado molido, cáscara de naranja, panela o azúcar morena, canela, harina, manteca, queso fresco, azúcar granulada, azúcar impalpable y aceite.",
    preparacion: "El api se prepara hirviendo agua con maíz morado, canela, clavo de olor y cáscara de naranja. Luego se cuela y se endulza con panela. El pastel se hace con harina, manteca, queso fresco y azúcar, formando masas que se fríen hasta dorar y se espolvorean con azúcar impalpable.",
    historia: "La historia del api con pastel se origina en el occidente boliviano, donde es una tradición para el desayuno o la noche. El api es una bebida ancestral de maíz morado, mientras que el pastel es un pastelito frito relleno de queso y cubierto de azúcar."
  },
  {
    nombre: "Wallake",
    ingredientes: "Pescado carachi, koa, papas andinas, chuño, ají amarillo, cebolla, ajo, sal, comino y caldo de pescado.",
    preparacion: "Primero se hierve el caldo con papas y chuño. Se hace un sofrito de cebolla, ajo y ají, que se añade al caldo. Luego se incorpora el pescado hasta cocerlo sin deshacerse y se aromatiza con koa. Se sirve con papa y chuño enteros.",
    historia: "El wallake es un plato típico de la región andina de Bolivia y Perú, muy arraigado especialmente en las comunidades cercanas al Lago Titicaca. Su historia está vinculada a la tradición gastronómica ancestral de los pueblos aymaras y quechuas."
  },
  {
    nombre: "Sajta",
    ingredientes: "Pollo, cebolla, ajo, arvejas, pimienta, comino, ají amarillo molido, papas, tunta, quesillo fresco, huevos, tomate, aceite y sal.",
    preparacion: "Se hierve el pollo y se prepara una salsa con cebolla, ajo, arvejas, pimienta, comino y ají amarillo disuelto en caldo. Se mezcla el pollo con la salsa. Aparte se cuecen papas y tunta, que se combinan con queso y huevo. Se acompaña con una ensalada de cebolla y tomate.",
    historia: "La sajta de pollo es uno de los platos más representativos de la cocina boliviana, especialmente en el altiplano. Es una preparación hogareña que combina pollo tierno, ají amarillo y tunta, en una salsa espesa y aromática."
  },
  {
    nombre: "Helado de Canela",
    ingredientes: "Agua, azúcar granulada, canela, maicena y jugo de limón.",
    preparacion: "Se hierve agua con canela, se añade azúcar y maicena disuelta en agua fría, se cocina unos minutos y se enfría. Luego se incorpora jugo de limón y se congela, batiendo varias veces hasta obtener la textura de helado.",
    historia: "Los helados de canela, originados en La Paz y Oruro a inicios del siglo veinte, son un postre tradicional que despierta nostalgia. Se venden en lugares emblemáticos como la Plaza Triangular, el Estadio Hernando Siles y el Mercado Lanza."
  }
];

let currentDish = 0;
let paused = true; // inicia en pausa hasta que digas "continuar"
let lastSection = null;

// Función para hablar
function hablar(texto, callback = null) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-MX"; // español latino
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  if (callback) utterance.onend = callback;
  speechSynthesis.speak(utterance);
}

// Leer un plato
function leerPlato() {
  if (paused) return;
  if (currentDish >= menu.length) {
    hablar("El menú ha finalizado. Gracias por disfrutar con Feels and Taste.");
    return;
  }

  const plato = menu[currentDish];
  lastSection = "nombre";
  hablar(`Ahora serviremos ${plato.nombre}.`, () => {
    if (!paused) leerIngredientes();
  });
}

function leerIngredientes() {
  if (paused) return;
  lastSection = "ingredientes";
  hablar(`Ingredientes: ${menu[currentDish].ingredientes}`, () => {
    if (!paused) leerPreparacion();
  });
}

function leerPreparacion() {
  if (paused) return;
  lastSection = "preparacion";
  hablar(`Preparación: ${menu[currentDish].preparacion}`, () => {
    if (!paused) leerHistoria();
  });
}

function leerHistoria() {
  if (paused) return;
  lastSection = "historia";
  hablar(`Historia: ${menu[currentDish].historia}`, () => {
    if (!paused) {
      hablar("Cuando termine de disfrutar este plato, diga esperar, continuar o repetir.");
    }
  });
}

// Reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "es-MX";
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  console.log("Comando reconocido:", transcript);

  if (transcript.includes("continuar")) {
    if (paused) {
      paused = false;
      leerPlato();
    } else {
      currentDish++;
      leerPlato();
    }
  }

  if (transcript.includes("esperar") || transcript.includes("pausar")) {
    paused = true;
    speechSynthesis.cancel();
  }

  if (transcript.includes("repetir")) {
    speechSynthesis.cancel();
    if (lastSection === "nombre") leerPlato();
    else if (lastSection === "ingredientes") leerIngredientes();
    else if (lastSection === "preparacion") leerPreparacion();
    else if (lastSection === "historia") leerHistoria();
  }

  if (transcript.includes("inicio")) {
    paused = false;
    currentDish = 0;
    leerPlato();
  }
};

function iniciarEscucha() {
  recognition.start();
}

// Iniciar app
window.onload = () => {
  hablar("Bienvenido a Feels and Taste. El menú de hoy tiene cuatro platos. Diga continuar para empezar.");
  iniciarEscucha();
};

