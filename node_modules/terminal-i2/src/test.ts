import { exit } from "process";
import { readTerminal } from "./terminal";
import createMenu from "./menu";

const menu = new createMenu({
    colorTitle: 'red',
    bgColorOption: '',
    colorOption: 'white',
    bgColorOptionHover: 'bgYellow',
    colorOptionHover: 'red',
})
const option = await menu
    .head("Este es el encabezado del menu en verde")
    .item(" 1 - Saludo.", true)
    .item(" 2 - Potencia.")
    .item(" 3 - Salir.")
    .render()

console.log("La opcion seleccionada es: ", option);

switch (option) {
    case 1:
        console.log("Hola mundo!")
        break;
    case 2:
        const base = parseInt(await readTerminal("Ingrese la base: ") as string)
        const exponente = parseInt(await readTerminal("Ingrese el exponente: ") as string)
        console.log(`El resultado de ${base}^${exponente} es: ${Math.pow(base, exponente)}`)
        break;
    case 3:
        console.log("Adios!")
        break;
    default:
        console.log("Opcion no valida.")
        break;
}

exit(0)
