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

        const celdaAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-editar';
        btnEditar.addEventListener('click', () => editarProducto(p.id));
        celdaAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.addEventListener('click', () => eliminarProducto(p.id));
        celdaAcciones.appendChild(btnEliminar);

        fila.appendChild(celdaAcciones);

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

const formProducto = document.getElementById('formProducto');
const mensajeForm = document.getElementById('mensajeForm');

let temporizador;

function mostrarMensajeForm(texto, tipo) {
    mensajeForm.textContent = texto;
    mensajeForm.className = 'mensaje-form ' + tipo;

    // el mensaje se borra solo a los 4 segundos
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
        mensajeForm.textContent = '';
    }, 4000);
}

// guarda el id del producto que se esta editando (null = estoy agregando uno nuevo)
let idEditando = null;

function editarProducto(id) {
    const p = listaProductos.find(prod => prod.id === id);
    if (!p) return;

    idEditando = id;

    document.getElementById('codigo').value = p.codigo;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('categoria').value = p.categoria || '';
    document.getElementById('precio').value = p.precio;
    document.getElementById('stock').value = p.stock;

    document.getElementById('tituloForm').textContent = 'Editar producto';
    document.getElementById('btnGuardar').textContent = 'Guardar cambios';
    document.getElementById('btnCancelar').hidden = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function salirModoEdicion() {
    idEditando = null;
    formProducto.reset();

    document.getElementById('tituloForm').textContent = 'Agregar producto';
    document.getElementById('btnGuardar').textContent = 'Guardar producto';
    document.getElementById('btnCancelar').hidden = true;
}

document.getElementById('btnCancelar').addEventListener('click', salirModoEdicion);

formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const producto = {
        codigo: document.getElementById('codigo').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        categoria: document.getElementById('categoria').value.trim(),
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value
    };

    // si hay un id guardado es una edicion, si no es un producto nuevo
    let url = '/api/productos';
    let metodo = 'POST';

    if (idEditando !== null) {
        url = '/api/productos/' + idEditando;
        metodo = 'PUT';
    }

    const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    });

    if (respuesta.status === 401) {
        window.location.href = '/login.html';
        return;
    }

    const datos = await respuesta.json();

    if (respuesta.ok) {
        if (idEditando !== null) {
            mostrarMensajeForm('Producto actualizado', 'ok');
            salirModoEdicion();
        } else {
            mostrarMensajeForm('Producto guardado', 'ok');
            formProducto.reset();
        }
        document.getElementById('codigo').focus();
        cargarProductos();
    } else {
        mostrarMensajeForm(datos.mensaje, 'error');
    }
});

// con la tecla escape tambien se cancela la edicion
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && idEditando !== null) {
        salirModoEdicion();
    }
});

async function eliminarProducto(id) {
    const p = listaProductos.find(prod => prod.id === id);
    if (!p) return;

    const seguro = confirm('¿Seguro que quieres eliminar "' + p.nombre + '"?');
    if (!seguro) return;

    const respuesta = await fetch('/api/productos/' + id, { method: 'DELETE' });

    if (respuesta.status === 401) {
        window.location.href = '/login.html';
        return;
    }

    if (respuesta.ok) {
       // si estaba editando justo este producto, salgo del modo edicion
       if (idEditando === id) {
            salirModoEdicion();
        }
        cargarProductos();
        } 
    else {
        const datos = await respuesta.json();
        alert(datos.mensaje);
        }
}

cargarProductos();