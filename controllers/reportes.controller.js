import db from '../config/db.js';

export const getReportes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Reportes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener reportes", error });
  }
};

export const getReporteById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Reportes WHERE id_reporte = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Reporte no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener reporte", error });
  }
};

export const createReporte = async (req, res) => {
  try {
    const { id_usuario, tipo, ruta_archivo, fecha_generacion } = req.body;
    const [result] = await db.query(
      "INSERT INTO Reportes (id_usuario, tipo, ruta_archivo, fecha_generacion) VALUES (?, ?, ?, ?)",
      [id_usuario, tipo, ruta_archivo, fecha_generacion]
    );
    res.status(201).json({ msg: "Reporte creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear reporte", error });
  }
};

export const updateReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, tipo, ruta_archivo, fecha_generacion } = req.body;
    const [result] = await db.query(
      "UPDATE Reportes SET id_usuario=?, tipo=?, ruta_archivo=?, fecha_generacion=? WHERE id_reporte=?",
      [id_usuario, tipo, ruta_archivo, fecha_generacion, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Reporte no encontrado" });
    res.json({ msg: "Reporte actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar reporte", error });
  }
};

export const deleteReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM Reportes WHERE id_reporte=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Reporte no encontrado" });
    res.json({ msg: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar reporte", error });
  }
};
