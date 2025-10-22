import express from 'express';
import cors from 'cors';

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


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API de Iconnics corriendo con imports 🚀');
});

app.use('/api/alertas', alertasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/mediciones',medicionesRoutes);
app.use('/api/protocolos',protocolosRoutes);
app.use('/api/recomendaciones',recomendacionesRoutes);
app.use('/api/reportes',reportesRoutes);
app.use('/api/sensores',sensoresRoutes);
app.use('/api/sesiones',sesionesRoutes);
app.use('/api/tokens',tokensRoutes);
app.use('/api/zonasdeportivas', zonasDeportivasRoutes);




app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
