import db from '../config/db.js';

export const getSesiones = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Sesiones");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener sesiones", error });
  }
};

export const getSesionById = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Sesiones WHERE id_sesion = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Sesion no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener sesion", error });
  }
};

export const createSesion = async (req, res) => {
  try {
    const { id_usuario, duracion, esfuerzo, clima, temperatura_ambiente, fecha } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO Sesiones (id_usuario, duracion, esfuerzo, clima, temperatura_ambiente, fecha) VALUES (?, ?, ?, ?, ?, ?)",
      [id_usuario, duracion, esfuerzo, clima, temperatura_ambiente, fecha]
    );
    res.status(201).json({ msg: "Sesion creada correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear sesion", error });
  }
};

export const updateSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, duracion, esfuerzo, clima, temperatura_ambiente, fecha } = req.body;
    const [result] = await db.promise().query(
      "UPDATE Sesiones SET id_usuario=?, duracion=?, esfuerzo=?, clima=?, temperatura_ambiente=?, fecha=? WHERE id_sesion=?",
      [id_usuario, duracion, esfuerzo, clima, temperatura_ambiente, fecha, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Sesion no encontrada" });
    res.json({ msg: "Sesion actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar sesion", error });
  }
};

export const deleteSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query("DELETE FROM Sesiones WHERE id_sesion=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Sesion no encontrada" });
    res.json({ msg: "Sesion eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar sesion", error });
  }
};
