const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor(){
       this.leerDB();
    }

    get historialCapitalizado(){

        const letra = this.historial;
        letra.replace(/^\w/, (c) => c.toUpperCase());

        return this.historial;

    }

    get paramsMapbox(){
        return{
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MATBOX_KEY
        }
    }

    async ciudad(lugar = ''){

        try {
            // peticion http
            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instancia.get();
            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
                
            }))

            
        } catch (error) {

            return[];
        }
        
    }

    get paramsOpenWeather(){
        return{
            'appid':process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    async climaLugar(lat, lon ){
        try {
            const instancia = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            });
            
            const resp = await instancia.get();
            const {main, weather} = resp.data;

            // })
            // Crear instancia axios.create()
            // de la respuesta generada de axios extraemos la data
            // 

            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
                // Retornaremos la descripcion,temp min y max
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        // Prevenir duplicados 
        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }

        this.historial.push(lugar.toLowerCase());

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const playload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(playload))
    }

    leerDB(){

        // Si no existe
        if(!fs.existsSync(this.dbPath)) return;
        
        // Debe existir base de datos
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
        
        return data;
    }
}




module.exports = Busquedas;