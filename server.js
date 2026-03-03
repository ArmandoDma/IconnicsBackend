import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import alertasRoutes from './routes/alertas.routes.js';
import usuariosRoutes from './routes/auth.routes.js'; 
import medicionesRoutes from './routes/mediciones.routes.js';
import protocolosRoutes from './routes/protocolos.routes.js';
import recomendacionesRoutes from './routes/recomendaciones.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import sensoresRoutes from './routes/sensores.routes.js';
import sesionesRoutes from './routes/sesiones.routes.js';
import tokensRoutes from './routes/tokens.routes.js';
import zonasDeportivasRoutes from './routes/ZonasDeportivas.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Iconnics corriendo con imports 🚀');
});

// Rutas API
app.use('/api/alertas', alertasRoutes);
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
});
