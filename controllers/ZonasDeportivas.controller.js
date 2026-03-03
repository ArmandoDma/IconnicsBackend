// Archivo: controllers/ZonasDeportivasController.js
import db from '../config/db.js'; // tu conexión actual

// Obtener todas las ZonasDeportivas
export const getZonasDeportivas = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ZonasDeportivas");
        res.json(rows); // devuelve [] si está vacía
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener zonas deportivas", error });
    }
};

// Obtener una ZonaDeportiva por ID
export const getZonasDeportivaById = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM ZonasDeportivas WHERE id_zona = ?", 
            [req.params.id]
        );
        if (rows.length === 0)
            return res.status(404).json({ msg: "Zona deportiva no encontrada" });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener la zona deportiva", error });
    }
};

// Crear una nueva ZonaDeportiva
export const createZonasDeportiva = async (req, res) => {
    try {
        const { nombre_zona, ubicacion, capacidad } = req.body;

        const [result] = await db.query(
            "INSERT INTO ZonasDeportivas (nombre_zona, ubicacion, capacidad) VALUES (?, ?, ?)",
            [nombre_zona, ubicacion, capacidad]
        );

        res.status(201).json({
            msg: "Zona deportiva creada correctamente",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear la zona deportiva", error });
    }
};

// Actualizar una ZonaDeportiva existente
export const updateZonasDeportiva = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_zona, ubicacion, capacidad } = req.body;

        const [result] = await db.query(
            "UPDATE ZonasDeportivas SET nombre_zona=?, ubicacion=?, capacidad=? WHERE id_zona=?",
            [nombre_zona, ubicacion, capacidad, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Zona deportiva no encontrada para actualizar" });

        res.json({ msg: "Zona deportiva actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar la zona deportiva", error });
    }
};

// Eliminar una ZonaDeportiva
export const deleteZonasDeportiva = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM ZonasDeportivas WHERE id_zona=?",
            [id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Zona deportiva no encontrada para eliminar" });

        res.json({ msg: "Zona deportiva eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar la zona deportiva (Puede tener dependencias)", error });
    }
};
