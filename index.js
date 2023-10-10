import inquirer from "inquirer";
import fs from "fs";

// Cargar los datos de gastos desde el archivo JSON al inicio
let gastos = [];

try {
  gastos = JSON.parse(fs.readFileSync("gastos.json"));
} catch (error) {
  gastos = [];
}

// Define las preguntas iniciales
const preguntasIniciales = [
  {
    type: "list",
    name: "opcion",
    message: "Selecciona una opción:",
    choices: ["Agregar gasto", "Listar gastos", "Salir"],
  },
];

// Función para guardar los gastos en el archivo JSON
const guardarGastos = () => {
  fs.writeFileSync("gastos.json", JSON.stringify(gastos, null, 2));
};

// Función para agregar un gasto
const agregarGasto = async () => {
  const preguntasGasto = [
    {
      type: "input",
      name: "nombre",
      message: "Nombre del gasto:",
    },
    {
      type: "input",
      name: "cantidad",
      message: "Cantidad del gasto:",
      validate: (input) => {
        if (!isNaN(input) && parseFloat(input) >= 0) {
          return true;
        }
        return "Ingresa una cantidad válida.";
      },
    },
  ];

  const respuestasGasto = await inquirer.prompt(preguntasGasto);

  const nuevoGasto = {
    nombre: respuestasGasto.nombre,
    cantidad: parseFloat(respuestasGasto.cantidad),
    fecha: new Date().toLocaleDateString(),
  };

  gastos.push(nuevoGasto);
  guardarGastos();

  console.log(`Gasto agregado: ${nuevoGasto.nombre} - $${nuevoGasto.cantidad}`);
};

// Función para listar los gastos
const listarGastos = () => {
  console.log("Lista de gastos:");
  gastos.forEach((gasto, index) => {
    console.log(
      `#${index + 1}: ${gasto.nombre} - $${gasto.cantidad} - Fecha: ${
        gasto.fecha
      }`
    );
  });
};

// Función principal para gestionar la aplicación
const main = async () => {
  console.log("Bienvenido a tu aplicación de gastos.");

  while (true) {
    const respuestas = await inquirer.prompt(preguntasIniciales);

    switch (respuestas.opcion) {
      case "Agregar gasto":
        await agregarGasto();
        break;
      case "Listar gastos":
        listarGastos();
        break;
      case "Salir":
        console.log("¡Hasta luego!");
        process.exit(0);
    }
  }
};

main();
