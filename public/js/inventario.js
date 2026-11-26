const cuerpoTabla = document.getElementById('cuerpoTabla');
const sinResultados = document.getElementById('sinResultados');

let listaProductos = [];

async function cargarProductos() {
    const respuesta = await fetch('/api/productos');

    if (respuesta.status === 401) {
        window.location.href = '/login.html';
        return;
    }

    listaProductos = await respuesta.json();
    mostrarProductos(listaProductos);
}

function mostrarProductos(productos) {
    cuerpoTabla.innerHTML = '';

    if (productos.length === 0) {
        sinResultados.textContent = 'No hay productos para mostrar';
        return;
    }
    sinResultados.textContent = '';

    productos.forEach(p => {
        const fila = document.createElement('tr');

        [p.codigo, p.nombre, p.categoria, p.precio, p.stock].forEach(valor => {
            const celda = document.createElement('td');
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        cuerpoTabla.appendChild(fila);
    });
}

document.getElementById('btnSalir').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login.html';
});

document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = listaProductos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrarProductos(filtrados);
});

cargarProductos();