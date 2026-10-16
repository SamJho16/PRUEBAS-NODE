// ==========================================================
// Proveedor de autenticacion con Google.
// Verifica el idToken enviado por el frontend usando la
// libreria oficial google-auth-library.
// ==========================================================
import { OAuth2Client } from 'google-auth-library';
import { env } from '../../../config/env';
import { ApiError } from '../../../common/utils/apiError';

const client = new OAuth2Client(env.google.clientId);

export interface DatosProveedorSocial {
  proveedorId: string;
  email: string;
  nombre: string;
  fotoPerfil?: string;
}

/** Verifica el idToken de Google y extrae los datos basicos del usuario */
export async function verificarGoogleIdToken(idToken: string): Promise<DatosProveedorSocial> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Payload de Google incompleto');
    }

    return {
      proveedorId: payload.sub,
      email: payload.email,
      nombre: payload.name ?? payload.email.split('@')[0],
      fotoPerfil: payload.picture,
    };
  } catch (error) {
    console.error('ERROR VALIDANDO GOOGLE ID TOKEN:', error);
    throw ApiError.unauthorized('idToken de Google invalido');
  }
}
