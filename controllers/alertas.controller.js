// Archivo: controllers/alertasController.js
import {Expo} from 'expo-server-sdk';
import db from '../config/db.js';


// Obtener todas las alertas
export const getAlertas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Alertas");
    res.json(rows); // devuelve [] si no hay alertas
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener alertas", error });
  }
};

// Obtener una alerta por ID
export const getAlertaById = async (req, res) => {
  try {
    const [rows] = await db.query(
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

    // 1️⃣ Guardar alerta en la base de datos
    const [result] = await db.query(
      "INSERT INTO Alertas (id_usuario, tipo_alerta, nivel_riesgo, mensaje, fecha_hora) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, tipo_alerta, nivel_riesgo, mensaje, fecha_hora]
    );

    const alertaId = result.insertId;

    // 2️⃣ Traer el push token del usuario
    const [tokensRows] = await db.query(
      "SELECT push_token FROM Usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    if (tokensRows.length > 0) {
      const messages = [];

      for (let row of tokensRows) {
        const token = row.push_token;
        if (!Expo.isExpoPushToken(token)) continue; // ignorar tokens inválidos

        messages.push({
          to: token,
          sound: 'default',
          title: `Alerta: ${tipo_alerta}`,
          body: mensaje,
          data: { alertaId },
        });
      }

      // 3️⃣ Enviar notificaciones en chunks
      const chunks = Expo.chunkPushNotifications(messages);
      const tickets = [];
      for (let chunk of chunks) {
        const ticketChunk = await Expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }

      console.log('Tickets enviados:', tickets);
    }

    res.status(201).json({ msg: "Alerta creada y notificación enviada", id: alertaId });
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
    const [result] = await db.query(
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
    const [result] = await db.query(
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
