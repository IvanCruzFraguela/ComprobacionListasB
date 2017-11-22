const fileName = "./personas.json";
const Horseman = require("node-horseman");
const cheerio = require('cheerio')
const fs = require('fs');

var horseman = new Horseman();

var Personas = [];
var PersonasAnteriores;
var grabarFichero = false;

function GestionDeParametros(params){
    if(params.length == 3){// así es que se envía un parámetro
        grabarFichero = true;
    }
}
function getPersonas(body) {
    var $ = cheerio.load(body);
    //$(".taboadatos TD");
    var columna = 0;
    $('.taboadatos TD').each(function () {
        columna++;
        if (columna === 1) {
            Personas.push($(this).text());
        }
        if (columna === 4) {
            columna = 0;
        }

    });
    if(grabarFichero){
        fs.writeFileSync(fileName,JSON.stringify(Personas),'utf-8');
    }
    var i = 0;
    console.log("LISTA DE CAMBIOS DE LAS LISTAS DEL B SEGÚN FICHERO: " + fileName);
    console.log("===================================================");
    Personas.forEach(element => {
        if (element === PersonasAnteriores[i]) {
            console.log("" + (i + 1) + ": (IGUALES) " + element);
        } else {
            console.log("" + (i + 1) + ": (DIFERENTES) " + element + '///' + PersonasAnteriores[i]);
        }
        i++;
    });
}

function ShowPersonas(per) {
    console.log(per);
}

function CargarPersonasAnteriores() {
    try {
        PersonasAnteriores = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    } catch (err) {
        console.error(err);
        console.error("No existe el fichero generelo con: ***");
    }
}

GestionDeParametros(process.argv);
CargarPersonasAnteriores();

horseman
    .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
    .open('http://www.xunta.es/rcp/listas/rcp_li05/li05_lista_ambito_sel.jsp?rcpCOD_LISTA=76&rcpCOD_AMBITO=U0000&rcpDES_AMBITO=AMBITO%20AUTON%D3MICO&lang=gl')
    .waitForSelector("TD")
    .html()
    .then(function (body) {
        getPersonas(body)
        horseman.close();
    })
;

