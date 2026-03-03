import db from '../config/db.js';

export const getTokens = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Tokens");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener tokens", error });
  }
};

export const getTokenById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Tokens WHERE id_token = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Token no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener token", error });
  }
};

export const createToken = async (req, res) => {
  try {
    const { id_usuario, token, fecha_expiracion, activo } = req.body;
    const [result] = await db.query(
      "INSERT INTO Tokens (id_usuario, token, fecha_expiracion, activo) VALUES (?, ?, ?, ?)",
      [id_usuario, token, fecha_expiracion, activo]
    );
    res.status(201).json({ msg: "Token creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear token", error });
  }
};

export const logoutToken = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const [result] = await db.query(
      "UPDATE Tokens SET activo = 0 WHERE id_usuario = ? AND activo = 1",
      [id_usuario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No active token found for this user" });
    }

    res.json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cerrar sesión", error });
  }
};
export const updateToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, token, fecha_expiracion, activo } = req.body;
    const [result] = await db.query(
      "UPDATE Tokens SET id_usuario=?, token=?, fecha_expiracion=?, activo=? WHERE id_token=?",
      [id_usuario, token, fecha_expiracion, activo, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Token no encontrado" });
    res.json({ msg: "Token actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar token", error });
  }
};

export const deleteToken = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM Tokens WHERE id_token=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Token no encontrado" });
    res.json({ msg: "Token eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar token", error });
  }
};
