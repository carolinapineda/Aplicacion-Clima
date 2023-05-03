require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async()=>{

    const busquedas = new Busquedas();
    let opt;

    
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');

                 // Buscar los lugares 
                const lugares = await busquedas.ciudad(busqueda);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;

                const lugarSelect = lugares.find(l => l.id === id);

                // Gardar en DB
                busquedas.agregarHistorial(lugarSelect.nombre);
                
                // Clima
                const clima = await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng);

                // Mostrar resultados
                console.log('\n Informacion de la ciudad\n'.green);
                console.log('Ciudad:' ,lugarSelect.nombre.magenta);
                console.log('Lat:', lugarSelect.lat);
                console.log('Lng:', lugarSelect.lng);
                console.log('Temperatura:',clima.temp);
                console.log('Minima:',clima.min);
                console.log('Maxima:',clima.max);
                console.log('Descripcion del clima: ', clima.desc.magenta);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar , i)=>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;

            case 3:
                // Seleccionar el lugar

               
            break;

           
        
        }

        if(opt !== 0) await pausa();
       

    } while (opt !== 0);
        
   
}

main();