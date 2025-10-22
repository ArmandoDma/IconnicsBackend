import db from '../config/db.js';

export const getProtocolos = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Protocolos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener protocolos", error });
  }
};

export const getProtocoloById = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Protocolos WHERE id_protocolo = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Protocolo no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener protocolo", error });
  }
};

export const createProtocolo = async (req, res) => {
  try {
    const { nombre, descripcion, nivel_importancia } = req.body;
    const [result] = await db.promise().query(
      "INSERT INTO Protocolos (nombre, descripcion, nivel_importancia) VALUES (?, ?, ?)",
      [nombre, descripcion, nivel_importancia]
    );
    res.status(201).json({ msg: "Protocolo creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear protocolo", error });
  }
};

export const updateProtocolo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, nivel_importancia } = req.body;
    const [result] = await db.promise().query(
      "UPDATE Protocolos SET nombre=?, descripcion=?, nivel_importancia=? WHERE id_protocolo=?",
      [nombre, descripcion, nivel_importancia, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Protocolo no encontrado" });
    res.json({ msg: "Protocolo actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar protocolo", error });
  }
};

export const deleteProtocolo = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query("DELETE FROM Protocolos WHERE id_protocolo=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Protocolo no encontrado" });
    res.json({ msg: "Protocolo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar protocolo", error });
  }
};
