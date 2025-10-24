import db from '../config/db.js';

// Valores fijos
const TIPO_SENSOR_FIJO = "Sensor fijo";
const ID_ZONA_FIJA = 1; // Asume que '1' es la ID de la zona fija que quieres usar

// Obtener todos los sensores
export const getSensores = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Sensores");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener sensores", error });
  }
};

// Obtener un sensor por ID
export const getSensorById = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
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

// -------------------------------------------------------------------
// Crear un sensor (VERSIÓN FINAL CON VALORES FIJOS)
export const createSensor = async (req, res) => {
  try {
    // SOLO recibimos los campos variables de req.body
    const { ubicacion, estado, id_usuario } = req.body;
    
    // Se asignan los valores fijos
    const tipo_sensor = TIPO_SENSOR_FIJO; 
    const id_zona = ID_ZONA_FIJA; 
    
    const [result] = await db.promise().query(
      "INSERT INTO Sensores (tipo_sensor, ubicacion, estado, id_usuario, id_zona) VALUES (?, ?, ?, ?, ?)",
      [tipo_sensor, ubicacion, estado, id_usuario, id_zona]
    );
    res.status(201).json({ msg: "Sensor creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear sensor", error });
  }
};

// -------------------------------------------------------------------
// Actualizar un sensor (VERSIÓN FINAL CON VALORES FIJOS)
export const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    // SOLO recibimos los campos variables de req.body
    const { ubicacion, estado, id_usuario } = req.body;
    
    // Se asignan los valores fijos para asegurar que no cambien
    const tipo_sensor = TIPO_SENSOR_FIJO;
    const id_zona = ID_ZONA_FIJA;
    
    const [result] = await db.promise().query(
      "UPDATE Sensores SET tipo_sensor=?, ubicacion=?, estado=?, id_usuario=?, id_zona=? WHERE id_sensor=?",
      [tipo_sensor, ubicacion, estado, id_usuario, id_zona, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Sensor no encontrado" });
    res.json({ msg: "Sensor actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar sensor", error });
  }
};

// -------------------------------------------------------------------
// Eliminar un sensor
export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query("DELETE FROM Sensores WHERE id_sensor=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: "Sensor no encontrado" });
    res.json({ msg: "Sensor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar sensor", error });
  }
};