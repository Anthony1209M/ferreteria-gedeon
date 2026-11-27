# Ferretería Gedeón - Sistema de inventario

Proyecto de la Tarea 3 (Git y Git Flow). Es un CRUD web para llevar el inventario de una ferretería, con login para entrar al sistema.

## Qué hace

- Login con usuario y contraseña (la clave se guarda encriptada con bcrypt)
- Ver la lista de productos
- Buscar productos por nombre
- Agregar productos nuevos
- Editar productos
- Eliminar productos (con confirmación)

## Tecnologías

- Node.js y Express
- SQL Server
- HTML, CSS y JavaScript (sin frameworks)
- Paquetes: express, mssql, dotenv, bcryptjs, express-session

## Cómo correrlo

1. Clonar el repositorio e instalar los paquetes:

```bash
git clone https://github.com/Anthony1209M/ferreteria-gedeon.git
cd ferreteria-gedeon
npm install
```

2. Abrir `database/script.sql` en SQL Server y ejecutarlo completo. Con eso se crea la base `FerreteriaGedeon`, las tablas y unos productos de prueba.

3. Crear un archivo `.env` en la raíz con los datos de tu SQL Server (hay un ejemplo en `.env.example`):

```
DB_USER=tu_usuario
DB_PASS=tu_clave
DB_SERVER=localhost
```

4. Crear el usuario administrador (solo se corre una vez):

```bash
node database/crear_admin.js
```

5. Levantar el servidor:

```bash
node server.js
```

6. Abrir `http://localhost:3000` y entrar con:

- Usuario: `admin`
- Contraseña: `admin123`