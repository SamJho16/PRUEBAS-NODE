// ==========================================================
// Proveedor de autenticacion con Facebook.
// Verifica el accessToken llamando al Graph API de Facebook
// para obtener los datos basicos del usuario.
// ==========================================================
import axios from 'axios';
import { ApiError } from '../../../common/utils/apiError';
import { DatosProveedorSocial } from './google.provider';

/** Verifica el accessToken de Facebook y extrae los datos basicos del usuario */
export async function verificarFacebookAccessToken(
  accessToken: string,
): Promise<DatosProveedorSocial> {
  try {
    const { data } = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token: accessToken,
      },
    });

    if (!data?.email) {
      throw new Error('Respuesta de Facebook incompleta (falta email)');
    }

    return {
      proveedorId: data.id,
      email: data.email,
      nombre: data.name ?? data.email.split('@')[0],
      fotoPerfil: data.picture?.data?.url,
    };
  } catch {
    throw ApiError.unauthorized('accessToken de Facebook invalido');
  }
}
