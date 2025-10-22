import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import alertasRoutes from './routes/alertas.routes.js';
import authRoutes from './routes/auth.routes.js'; 
import usuariosRoutes from './routes/auth.usuarios.js'; 
import medicionesRoutes from './routes/mediciones.routes.js';
import protocolosRoutes from './routes/protocolos.routes.js';
import recomendacionesRoutes from './routes/recomendaciones.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import sensoresRoutes from './routes/sensores.routes.js';
import sesionesRoutes from './routes/sesiones.routes.js';
import tokensRoutes from './routes/tokens.routes.js';
import zonasDeportivasRoutes from './routes/ZonasDeportivas.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// 🧩 Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Iconnics corriendo con imports 🚀');
});

// Rutas API
app.use('/api/alertas', alertasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/mediciones', medicionesRoutes);
app.use('/api/protocolos', protocolosRoutes);
app.use('/api/recomendaciones', recomendacionesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/zonasdeportivas', zonasDeportivasRoutes);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Archivos estáticos en http://localhost:${PORT}/login.html`);
});
