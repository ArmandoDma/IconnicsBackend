// Archivo: controllers/alertasController.js
import db from '../config/db.js';

// Obtener todas las alertas
export const getAlertas = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Alertas");
    res.json(rows); // devuelve [] si no hay alertas
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener alertas", error });
  }
};

// Obtener una alerta por ID
export const getAlertaById = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM Alertas WHERE id_alerta = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ msg: "Alerta no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la alerta", error });
  }
};

// Crear una nueva alerta
export const createAlerta = async (req, res) => {
  try {
    const { id_usuario, tipo_alerta, nivel_riesgo, mensaje, fecha_hora } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO Alertas (id_usuario, tipo_alerta, nivel_riesgo, mensaje, fecha_hora) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, tipo_alerta, nivel_riesgo, mensaje, fecha_hora]
    );
    res.status(201).json({ msg: "Alerta creada correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear alerta", error });
  }
};

// Actualizar una alerta
export const updateAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_alerta, nivel_riesgo, mensaje, fecha_hora } = req.body;
    const [result] = await db.promise().query(
      "UPDATE Alertas SET tipo_alerta=?, nivel_riesgo=?, mensaje=?, fecha_hora=? WHERE id_alerta=?",
      [tipo_alerta, nivel_riesgo, mensaje, fecha_hora, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Alerta no encontrada para actualizar" });

    res.json({ msg: "Alerta actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar alerta", error });
  }
};

// Eliminar una alerta
export const deleteAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query(
      "DELETE FROM Alertas WHERE id_alerta = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Alerta no encontrada para eliminar" });

    res.json({ msg: "Alerta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar alerta", error });
  }
};
