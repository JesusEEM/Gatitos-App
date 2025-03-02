const boton = document.querySelector('#new-gatito');
const imagen1 = document.getElementById('imagen1');
const imagen2 = document.getElementById('imagen2');
const imagen3 = document.getElementById('imagen3');
const spanError = document.querySelector('#error');
const saveBtn1 = document.querySelector('#save-btn-1');
const saveBtn2 = document.querySelector('#save-btn-2');
const saveBtn3 = document.querySelector('#save-btn-3');
const form = document.getElementById('subirFormulario');


let gatitoId1, gatitoId2, gatitoId3;

const APY_KEY = 'live_Fzw4wy7NuKwt1WcyhQWleBMxrLXQvKmb5EdTTA3Kh3b7PfusB75T1Ll2N4cWYidY';
const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=3`;
const API_URL_FAVORITES = `https://api.thecatapi.com/v1/favourites`;
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = `https://api.thecatapi.com/v1/images/upload`;



async function peticionRandom() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    gatitoId1 = data[0].id;
    gatitoId2 = data[1].id;
    gatitoId3 = data[2].id;


    if (res.status !== 200) {
        spanError.innerHTML = "Ocurrio un Error al cargar los gatitos " + res.status;
    } else {
        imagen1.src = data[0].url;
        imagen2.src = data[1].url;
        imagen3.src = data[2].url;
    }    
}

async function peticionFavoritos() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': APY_KEY,
        }
    });
    const data = await res.json();

    console.log('Michis favoritos');
    console.log(data);

    const section = document.getElementById('saved-section');
    section.innerHTML = "";

    if (res.status !== 200) {
        spanError.innerHTML = "Ocurrio un Error al cargar los gatitos: " + res.status;
    } else {
        data.forEach(michi => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const boton = document.createElement('button');
            const botonTexto = document.createTextNode("Eliminar Gatito de Favoritos");

            boton.classList.add('save-btn');
            boton.appendChild(botonTexto);
            //boton.onclick = () => eliminarGatito(michi.id)

            img.src = michi.image.url;

            div.classList.add('img-section')
            div.appendChild(img);
            div.appendChild(boton);

            section.appendChild(div);

        });
    }
}

async function saveGatitosFavoritos(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': APY_KEY,
        },
        body: JSON.stringify({
            image_id: id
        })
    });
    
    if (res.status !== 200) {
        spanError.innerHTML = "Ocurrio un Error al cargar los gatitos " + res.status;
    } else {
        console.log('Se guardo el michi con id ' + id);
        peticionFavoritos();
        alert("Se Guardo el Gatito");
    }
}

async function eliminarGatito(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': APY_KEY,
        },
    });

    if (res.status !== 200) {
        spanError.innerHTML = "Ocurrio un Error al cargar los gatitos " + res.status;
    } else {
        console.log('Se elimino el michi con id ' + id);
        peticionFavoritos();
        alert("Se elimino el Gatito");
    }
}

async function subirFoto() {
    const formData = new FormData(form);

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': APY_KEY,
        }, 
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Ocurrio un Error al cargar los gatitos: " + res.status;
        console.log({data});
    } else { 
        console.log('Se subio el Gatito');
        console.log(formData.get('file'));
        console.log({data});
        console.log(data.url);
        saveGatitosFavoritos(data.id)

    }    
}

const previewGatito = () => {
    const archivo = document.getElementById('archivo').files;
    const preview = document.getElementById('preview');

    console.log('se activo la funcion');
    console.log(archivo);

    if (archivo.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            preview.setAttribute('src', event.target.result);
        };
        fileReader.readAsDataURL(archivo[0]);
    }
}


boton.addEventListener('click', peticionRandom);
/* saveBtn1.addEventListener('click', () => saveGatitosFavoritos(gatitoId1));
saveBtn2.addEventListener('click', () => saveGatitosFavoritos(gatitoId2));
saveBtn3.addEventListener('click', () => saveGatitosFavoritos(gatitoId3)); */


peticionRandom();
peticionFavoritos();



