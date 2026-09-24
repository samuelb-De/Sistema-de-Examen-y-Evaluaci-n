# Manual de Implementación: Envío de Copia de Evaluación por Correo Electrónico

Este documento describe el flujo completo, la configuración de credenciales y el funcionamiento técnico del despacho de evaluaciones para cada postulante según el correo ingresado en el sistema **ADSO Selector**.

---

## 1. Flujo de Captura y Envío

1. **Registro del Postulante:**
   - Al iniciar la prueba, el aspirante ingresa su **Nombre Completo**, **Tipo y Número de Documento** y su **Correo Electrónico** (`email`).
   - El sistema valida el formato de correo antes de habilitar el botón "Iniciar Examen ADSO".

2. **Despacho Automático al Concluir el Examen:**
   - Una vez finalizado el examen (ya sea por clic en "Finalizar Evaluación" o por agotamiento del tiempo con cierre de compuerta), la aplicación:
     1. Guarda los resultados en la base de datos persistente (`/api/candidates`).
     2. Dispara de forma automática la petición `POST /api/send-email` con el correo del aspirante y el detalle de su informe psicotécnico y académico.
     3. El servidor ejecuta el módulo Python (`server/email_and_export.py`) utilizando `smtplib` y `email.mime` con cifrado TLS/SSL.

3. **Reenvío Manual desde la Pantalla de Resultados:**
   - En la pantalla de resultados del aspirante se encuentra el botón **"Enviar copia a mi correo"**. Al hacer clic, se reenvía el informe de inmediato y se muestra confirmación visual.

4. **Gestión y Reenvío por el Administrador:**
   - Desde el panel de administración (`Contraseña: 1234`), pestaña **"Historias de Usuarios"**:
     - Cada fila de candidato tiene un botón directo de sobre para **reenviar el informe individual**.
     - Existe el botón **"Despachar a Todos"** para reenviar a toda la lista de aspirantes registrados.

---

## 2. Configuración de Credenciales SMTP (.env)

El sistema lee las variables del entorno del servidor. Para habilitar el envío real hacia buzones externos (Gmail, Outlook, servidores institucionales), se configuran las siguientes variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_clave_de_aplicacion_16_caracteres
SMTP_FROM=admisiones.adso@sena.edu.co
```

### Para Gmail:
1. Ve a tu Cuenta de Google -> **Seguridad**.
2. Asegúrate de tener activada la **Verificación en dos pasos**.
3. Busca **"Contraseñas de aplicaciones"** (App Passwords).
4. Genera una contraseña para "Otra aplicación" (ej. "Sistema ADSO").
5. Copia el código de 16 letras generado (ejemplo: `abcd efgh ijkl mnop`) y colócalo en `SMTP_PASS` (sin espacios).
6. Asigna `SMTP_HOST=smtp.gmail.com` y `SMTP_PORT=587`.

### Para Microsoft 365 / Outlook:
- `SMTP_HOST=smtp.office365.com`
- `SMTP_PORT=587`
- `SMTP_USER=tu_cuenta@institucion.edu.co`
- `SMTP_PASS=tu_contraseña_o_clave_de_aplicacion`

---

## 3. Modo de Demostración y Simulación Segura

Si el servidor aún no tiene configuradas credenciales SMTP reales, el sistema activa automáticamente el **Modo de Demostración Seguro**:
- Genera el HTML y texto plano del reporte.
- Simula la entrega con éxito en el frontend sin arrojar error al usuario.
- Notifica al administrador que el correo fue procesado y está listo para producción.

---

## 4. Probador Integrado en la Aplicación

El administrador puede verificar en vivo el funcionamiento del script Python sin salir de la plataforma:
1. Accede al **Panel de Administrador** (clave `1234`).
2. Haz clic en **"Módulo Python"**.
3. En la sección **"Prueba de Despacho de Correo vía Python"**, ingresa cualquier correo de prueba.
4. Presiona **"Ejecutar Envío Python"** para visualizar la consola de salida y confirmar la conexión con el servidor SMTP.
