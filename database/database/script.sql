CREATE DATABASE FerreteriaGedeon;
GO

USE FerreteriaGedeon;
GO

CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL
);
GO

CREATE TABLE Productos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    fecha_registro DATETIME DEFAULT GETDATE()
);
GO


INSERT INTO Productos (codigo, nombre, categoria, precio, stock) VALUES
('MAR-001', 'Martillo de acero 16oz', 'Herramientas', 450.00, 25),
('TOR-014', 'Tornillos 1 pulgada (caja)', 'Ferreteria general', 180.50, 100),
('PIN-032', 'Pintura blanca galon', 'Pinturas', 1250.00, 12),
('CAB-008', 'Cable electrico #12 (metro)', 'Electricidad', 65.00, 300);
GO