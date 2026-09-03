# Portal de Monitoreo y Evaluación

Aplicación full stack React + Express + PostgreSQL con autenticación SSO mediante JWT.

## Flujo de acceso

1. `POST /api/sso` recibe `{ "token": "..." }` o `Authorization: Bearer ...`.
2. Verifica firma HS256, expiración y opcionalmente `issuer` y `audience`.
3. Normaliza `userId = decoded.userId ?? decoded.sub`.
4. Exige el acceso `monitoreo-evaluacion` en `accesos`.
5. Busca al usuario en `users` y toma `nombre` y `role` desde PostgreSQL.
6. Crea una cookie de sesión HttpOnly. Todo fallo responde 401.

## Desarrollo local

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Inserta al menos un usuario cuyo `id` coincida con `userId` o `sub` del JWT:

```sql
INSERT INTO users (id, nombre, role)
VALUES ('123', 'Usuario de prueba', 'analista');
```

## Despliegue con Render Blueprint

1. Sube el proyecto a un repositorio Git.
2. En Render, crea un Blueprint y conecta el repositorio.
3. Render detectará `render.yaml` en la raíz.
4. Define `JWT_ISSUER` y `JWT_AUDIENCE` si tu emisor los utiliza. Si no aplican, déjalos vacíos.
5. Asegúrate de que el sistema emisor firme los JWT con el mismo `JWT_SECRET` generado/configurado en Render.

## Payload esperado

```json
{
  "userId": "123",
  "role": "analista",
  "agencyId": "agencia-1",
  "accesos": [{ "nombre": "monitoreo-evaluacion" }],
  "exp": 1893456000
}
```

`accesos` también acepta el texto dentro de un arreglo o una propiedad de objeto llamada `monitoreo-evaluacion`.

## Nota de seguridad

Para producción con un proveedor SSO independiente, es preferible validar JWT asimétricos (RS256/ES256) mediante JWKS. Esta plantilla usa HS256 porque se solicitó `JWT_SECRET`.
