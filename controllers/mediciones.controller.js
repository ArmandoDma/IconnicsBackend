import db from '../config/db.js';

export const getMediciones = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Mediciones");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener mediciones", error });
  }
};

export const getMedicionById = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Mediciones WHERE id_medicion = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Medicion no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener medicion", error });
  }
};

export const createMedicion = async (req, res) => {
  try {
    const { id_sensor, hidratacion, temperatura, frecuencia_cardiaca, fecha_hora } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO Mediciones (id_sensor, hidratacion, temperatura, frecuencia_cardiaca, fecha_hora) VALUES (?, ?, ?, ?, ?)",
      [id_sensor, hidratacion, temperatura, frecuencia_cardiaca, fecha_hora]
    );
    res.status(201).json({ msg: "Medicion creada correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear medicion", error });
  }
};

export const updateMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_sensor, hidratacion, temperatura, frecuencia_cardiaca, fecha_hora } = req.body;
    const [result] = await db.promise().query(
      "UPDATE Mediciones SET id_sensor=?, hidratacion=?, temperatura=?, frecuencia_cardiaca=?, fecha_hora=? WHERE id_medicion=?",
      [id_sensor, hidratacion, temperatura, frecuencia_cardiaca, fecha_hora, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Medicion no encontrada" });
    res.json({ msg: "Medicion actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar medicion", error });
  }
};

export const deleteMedicion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query("DELETE FROM Mediciones WHERE id_medicion=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Medicion no encontrada" });
    res.json({ msg: "Medicion eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar medicion", error });
  }
};
