// Archivo: controllers/usuariosController.js
import db from '../config/db.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM Usuarios");
        res.json(rows); // devuelve [] si no hay usuarios
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener usuarios", error });
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM Usuarios WHERE id_usuario = ?", 
            [req.params.id]
        );
        if (rows.length === 0)
            return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el usuario", error });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, edad, rol, peso, altura, deporte, correo, contrasena } = req.body;

        const [result] = await db.promise().query(
            "INSERT INTO Usuarios (nombre, edad, rol, peso, altura, deporte, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, edad, rol, peso, altura, deporte, correo, contrasena]
        );

        res.status(201).json({ 
            msg: "Usuario creado correctamente", 
            id: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear usuario", error });
    }
};

// Actualizar un usuario existente
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, rol, peso, altura, deporte, correo, contrasena } = req.body;

        const [result] = await db.promise().query(
            "UPDATE Usuarios SET nombre=?, edad=?, rol=?, peso=?, altura=?, deporte=?, correo=?, contrasena=? WHERE id_usuario=?",
            [nombre, edad, rol, peso, altura, deporte, correo, contrasena, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Usuario no encontrado para actualizar" });

        res.json({ msg: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar usuario", error });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM Usuarios WHERE id_usuario = ?", 
            [id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Usuario no encontrado para eliminar" });

        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar usuario (Puede tener dependencias)", error });
    }
};
