// ==========================================================
// Middleware de subida de archivos (multer) para los documentos
// de verificacion de perfil de Asesor (frontal + sello).
// Se guardan en disco local dentro de UPLOADS_DIR.
// ==========================================================
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from '../../config/env';

const uploadsPath = path.resolve(process.cwd(), env.uploadsDir, 'verificaciones');

// Nos aseguramos de que la carpeta destino exista antes de guardar archivos
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const usuarioId = req.auth?.id ?? 'anonimo';
    const extension = path.extname(file.originalname);
    cb(null, `${usuarioId}-${file.fieldname}-${Date.now()}${extension}`);
  },
});

// Solo se aceptan imagenes o PDF, maximo 5MB por archivo
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(new Error('Formato de archivo no permitido'));
  }
  cb(null, true);
};

export const uploadVerificacion = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
