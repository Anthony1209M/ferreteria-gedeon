const form = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const clave = document.getElementById('clave').value;

    const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
        window.location.href = '/inventario';
    } else {
        mensaje.textContent = datos.mensaje;
    }
});