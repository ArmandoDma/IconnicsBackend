import db from '../config/db.js';
import fs from 'fs';
import path from 'path';

const TIPO_SENSOR_FIJO = "Sensor fijo";
const ID_ZONA_FIJA = 1;

// Ruta del archivo JSON
const rutaJSON = path.join(
  'C:',
  'Users',
  'Bulmarozr',
  'Desktop',
  'Bulmaro Zavala Ruiz',
  'UTSC',
  '10A',
  'Desarrollo movil integral',
  'IconnicsBackend',
  'datos_bpm.json'
);

// -------------------------------------------------------------------
// Leer datos del JSON para el frontend
export const getDatosBPM = (req, res) => {
  try {
    if (!fs.existsSync(rutaJSON)) {
      return res.status(404).json({ msg: "Archivo JSON no encontrado" });
    }

    const datos = JSON.parse(fs.readFileSync(rutaJSON, 'utf-8'));
    res.json(datos);
  } catch (error) {
    console.error("Error al leer JSON:", error);
    res.status(500).json({ msg: "Error al leer datos BPM", error });
  }
};

// -------------------------------------------------------------------
// Rutas normales de sensores en la DB
export const getSensores = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Sensores");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener sensores", error });
  }
};

export const getSensorById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Sensores WHERE id_sensor = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: "Sensor no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener sensor", error });
  }
};

export const createSensor = async (req, res) => {
  try {
    const { ubicacion, estado, id_usuario } = req.body;
    const tipo_sensor = TIPO_SENSOR_FIJO;
    const id_zona = ID_ZONA_FIJA;

    const [result] = await db.query(
      "INSERT INTO Sensores (tipo_sensor, ubicacion, estado, id_usuario, id_zona) VALUES (?, ?, ?, ?, ?)",
      [tipo_sensor, ubicacion, estado, id_usuario, id_zona]
    );

    res.status(201).json({ msg: "Sensor creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear sensor", error });
  }
};

export const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const { ubicacion, estado, id_usuario } = req.body;
    const tipo_sensor = TIPO_SENSOR_FIJO;
    const id_zona = ID_ZONA_FIJA;

    const [result] = await db.query(
      "UPDATE Sensores SET tipo_sensor=?, ubicacion=?, estado=?, id_usuario=?, id_zona=? WHERE id_sensor=?",
      [tipo_sensor, ubicacion, estado, id_usuario, id_zona, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Sensor no encontrado" });

    res.json({ msg: "Sensor actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar sensor", error });
  }
};

export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM Sensores WHERE id_sensor=?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Sensor no encontrado" });

    res.json({ msg: "Sensor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar sensor", error });
  }
};
