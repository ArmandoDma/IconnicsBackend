import db from '../config/db.js';

export const getRecomendaciones = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Recomendaciones");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener recomendaciones", error });
  }
};

export const getRecomendacionById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Recomendaciones WHERE id_recomendacion = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Recomendacion no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener recomendacion", error });
  }
};

export const createRecomendacion = async (req, res) => {
  try {
    const { id_usuario, tipo_deporte, clima, esfuerzo, mensaje } = req.body;
    const [result] = await db.query(
      "INSERT INTO Recomendaciones (id_usuario, tipo_deporte, clima, esfuerzo, mensaje) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, tipo_deporte, clima, esfuerzo, mensaje]
    );
    res.status(201).json({ msg: "Recomendacion creada correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear recomendacion", error });
  }
};

export const updateRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, tipo_deporte, clima, esfuerzo, mensaje } = req.body;
    const [result] = await db.query(
      "UPDATE Recomendaciones SET id_usuario=?, tipo_deporte=?, clima=?, esfuerzo=?, mensaje=? WHERE id_recomendacion=?",
      [id_usuario, tipo_deporte, clima, esfuerzo, mensaje, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Recomendacion no encontrada" });
    res.json({ msg: "Recomendacion actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar recomendacion", error });
  }
};

export const deleteRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM Recomendaciones WHERE id_recomendacion=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Recomendacion no encontrada" });
    res.json({ msg: "Recomendacion eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar recomendacion", error });
  }
};
