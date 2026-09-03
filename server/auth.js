import { jwtVerify, SignJWT } from 'jose';

const encoder = new TextEncoder();
const secret = () => encoder.encode(process.env.JWT_SECRET);

export function hasRequiredAccess(accesos) {
  if (Array.isArray(accesos)) {
    return accesos.some(a => a === 'monitoreo-evaluacion' || (a && typeof a === 'object' && (a.nombre === 'monitoreo-evaluacion' || a.name === 'monitoreo-evaluacion' || a.id === 'monitoreo-evaluacion')));
  }
  return !!(accesos && typeof accesos === 'object' && (Object.prototype.hasOwnProperty.call(accesos, 'monitoreo-evaluacion') || accesos.nombre === 'monitoreo-evaluacion' || accesos.name === 'monitoreo-evaluacion'));
}

export async function verifySsoToken(token) {
  const options = { algorithms: ['HS256'] };
  if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
  if (process.env.JWT_AUDIENCE) options.audience = process.env.JWT_AUDIENCE;
  const { payload } = await jwtVerify(token, secret(), options);
  const userId = payload.userId ?? payload.sub;
  if (!userId || !payload.role || !hasRequiredAccess(payload.accesos)) throw new Error('CLAIMS_INVALID');
  return { userId: String(userId), role: payload.role, agencyId: payload.agencyId ?? null, accesos: payload.accesos };
}

export async function createSession(user) {
  return new SignJWT({ role: user.role, nombre: user.nombre, type: 'session' }).setProtectedHeader({ alg: 'HS256' }).setSubject(String(user.id)).setIssuedAt().setExpirationTime('8h').sign(secret());
}

export async function verifySession(token) {
  const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
  if (payload.type !== 'session') throw new Error('INVALID_SESSION');
  return payload;
}
