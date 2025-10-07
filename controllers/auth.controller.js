// controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `
      INSERT INTO usuarios (nombre, correo, contraseña, rol)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [nombre, correo, hashedPassword, rol], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const query = `SELECT * FROM usuarios WHERE correo = ?`;
    db.query(query, [correo], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const usuario = results[0];
      const match = await bcrypt.compare(contraseña, usuario.contraseña);

      if (!match) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({ mensaje: 'Login exitoso', token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};