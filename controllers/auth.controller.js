import db from '../config/db.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken'; // npm install jsonwebtoken
import dotenv from 'dotenv'; // npm install dotenv (para variables de entorno)

dotenv.config(); // Cargar variables de entorno

// Validar entradas para prevenir inyecciones o payloads maliciosos
const sanitizeInput = (input) => {
    if (typeof input === 'string') return validator.escape(input.trim());
    return input;
};

// Obtener todos los usuarios (solo campos públicos)
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id_usuario, nombre, edad, rol, peso, altura, deporte, correo, contrasena FROM Usuarios"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener usuarios" });
    }
};

// Obtener un usuario por ID (validando número)
export const getUsuarioById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });
        const [rows] = await db.query(
            "SELECT id_usuario, nombre, edad, rol, peso, altura, deporte, correo, contrasena, push_token FROM Usuarios WHERE id_usuario = ?",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
};

// Crear usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, edad, rol, peso, altura, deporte, correo, contrasena } = req.body;
        if (!validator.isEmail(correo)) return res.status(400).json({ msg: "Correo inválido" });
        if (!contrasena || contrasena.length < 8) return res.status(400).json({ msg: "Contraseña demasiado corta" });
        
        // Validar y convertir campos numéricos
        const edadNum = parseInt(edad);
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (isNaN(edadNum) || isNaN(pesoNum) || isNaN(alturaNum)) {
            return res.status(400).json({ msg: "Edad, peso o altura inválidos" });
        };

        const rolesValidos = ['Deportista', 'Entrenador', 'Administrador'];
        const rolLimpio = rol.trim();
        if (!rolesValidos.includes(rolLimpio)) {
            return res.status(400).json({ msg: "Rol inválido. Usa: Deportista, Entrenador o Administrador." });
        }

        const cleanData = {
            nombre: sanitizeInput(nombre),
            rol: rolLimpio,
            deporte: sanitizeInput(deporte),
            correo: correo.trim().toLowerCase()
        };
        const hashedPassword = await bcrypt.hash(contrasena, 12);
        const [result] = await db.query(
            `INSERT INTO Usuarios (nombre, edad, rol, peso, altura, deporte, correo, contrasena)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [cleanData.nombre, edad, cleanData.rol, peso, altura, cleanData.deporte, cleanData.correo, hashedPassword]
        );
        res.status(201).json({ msg: "Usuario creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
};
//pushtokens users
export const updatePushToken = async (req, res) => {
  try {
    const { userId, pushToken } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "El userId es requerido" });
    }

    // Actualizar el token
    const [result] = await db.query(
      "UPDATE Usuarios SET push_token = ? WHERE id_usuario = ?",
      [pushToken || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ msg: pushToken ? "Token actualizado correctamente" : "Token eliminado correctamente" });
  } catch (error) {
    console.error("Error actualizando push token:", error);
    res.status(500).json({ msg: "Error al actualizar push token", error });
  }
};

// Login de usuario con generación de token
export const loginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        if (!correo || !contrasena) return res.status(400).json({ msg: "Faltan credenciales" });
        if (!validator.isEmail(correo)) return res.status(400).json({ msg: "Correo inválido" });
        const [rows] = await db.query("SELECT * FROM Usuarios WHERE correo = ?", [correo.trim().toLowerCase()]);
        if (rows.length === 0) return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
        const usuario = rows[0];
        const match = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!match) return res.status(401).json({ msg: "Correo o contraseña incorrectos" });

        // Generar token JWT
        const payload = { id: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

        // Guardar token en la tabla Tokens
        const fechaExpiracion = new Date(Date.now() + 3600000); // 1 hora en milisegundos
        await db.query(
            `INSERT INTO Tokens (id_usuario, token, fecha_expiracion)
             VALUES (?, ?, ?)`,
            [usuario.id_usuario, token, fechaExpiracion]
        );

        // Devolver usuario seguro y token
        const safeUser = { id: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
        res.json({ msg: "Login exitoso", usuario: safeUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al iniciar sesión" });
    }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });
        const { nombre, edad, rol, peso, altura, deporte, correo, contrasena } = req.body;
        const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 12) : undefined;
        const [result] = await db.query(
            `UPDATE Usuarios
             SET nombre=?, edad=?, rol=?, peso=?, altura=?, deporte=?, correo=?, contrasena=COALESCE(?, contrasena)
             WHERE id_usuario=?`,
            [
                sanitizeInput(nombre), edad, sanitizeInput(rol), peso, altura,
                sanitizeInput(deporte), correo.trim().toLowerCase(),
                hashedPassword, id
            ]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Usuario no encontrado para actualizar" });
        res.json({ msg: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
};

// Eliminar usuario (incluye eliminación de tokens asociados)
export const deleteUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });
        // Eliminar tokens asociados
        await db.query("DELETE FROM Tokens WHERE id_usuario = ?", [id]);
        // Eliminar usuario
        const [result] = await db.query(
            "DELETE FROM Usuarios WHERE id_usuario = ?",
            [id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar usuario" });
    }
};