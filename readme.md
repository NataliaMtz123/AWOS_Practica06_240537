# Práctica: Consumo de APIs

## Objetivo
Implementar el consumo de APIs externas mediante una aplicación que permita integrar servicios de Inteligencia Artificial, pagos en línea y colaboración digital, utilizando los endpoints de IA, Mercado Pago y Padlet

---

## Tecnologías
- Node.js + Express
- Passport.js + Estrategias OAuth
- Tailwind CSS 3.x
- EJS templates

---

## Configuración

- Clonar repositorio
- `npm install`
- Configurar archivo `.env` con las API keys
- `npm run dev` y `npm run watch:css`

---

## API Keys Gratuitas
Cada red social ofrece nivel gratuito para desarrollo:

---

## Actividades

## Actividades

## Actividades

| No. | Descripción                                                                 | Potenciador | Estatus          |
|-----|-----------------------------------------------------------------------------|-------------|------------------|
| 1   | Gestionar la solicitud individual de las 3 API Keys                        | 6           |  Finalizado. ✅  |
| 2   | Consultar los endpoints disponibles y documentar al menos 20 en README.md  | 10          |    Finalizado. ✅     |
| 3   | Desarrollo de la Landing Page para consulta de APIs                        | 10          |   Finalizado. ✅ |
| 4   | Desarrollo de la página de API para realizar pagos                         | 10          |    Finalizado. ✅     |
| 5   | Desarrollo de la página de API para uso de IA Generativa                   | 10          |    Finalizado. ✅    |
| 6   | Desarrollo de la página de API para planeación de actividades              | 10          |      Finalizado. ✅   |
| 7   | Implementación del código Front End                                        | 10          |     Finalizado. ✅ |
| 8   | Implementación del código Back End                                         | 10          |      Finalizado. ✅   |
| 9   | Pruebas del sistema y documentación de 5 resultados con capturas           | 10          |    Finalizado. ✅     |
| 10  | Documentación completa del proyecto en GitHub (README.md)                  | 10          |       Finalizado. ✅  |

---

## Exploración de Endpoints

## API de Inteligencia Artificial (OpenAI)

| API    | Endpoint                    | Descripción                               | Parámetros                   |
| ------ | --------------------------- | ----------------------------------------- | ---------------------------- |
| OpenAI | /v1/chat/completions        | Genera respuestas usando modelos de chat  | model, messages, temperature |
| OpenAI | /v1/responses               | Genera texto con un modelo de IA          | model, input                 |
| OpenAI | /v1/images/generations      | Genera imágenes con IA                    | prompt, size                 |
| OpenAI | /v1/images/edits            | Edita imágenes usando IA                  | image, prompt                |
| OpenAI | /v1/images/variations       | Genera variaciones de una imagen          | image, n                     |
| OpenAI | /v1/embeddings              | Genera embeddings para análisis semántico | model, input                 |
| OpenAI | /v1/audio/transcriptions    | Transcribe audio a texto                  | file, model                  |
| OpenAI | /v1/audio/translations      | Traduce audio a texto en inglés           | file, model                  |
| OpenAI | /v1/audio/speech            | Convierte texto a voz                     | model, voice, input          |
| OpenAI | /v1/files                   | Sube archivos para entrenamiento          | file, purpose                |
| OpenAI | /v1/files/{file_id}         | Obtiene información de un archivo         | file_id                      |
| OpenAI | /v1/files/{file_id}/content | Obtiene el contenido de un archivo        | file_id                      |
| OpenAI | /v1/fine_tuning/jobs        | Crea un trabajo de fine tuning            | training_file, model         |
| OpenAI | /v1/fine_tuning/jobs/{id}   | Consulta estado de entrenamiento          | id                           |
| OpenAI | /v1/models                  | Lista los modelos disponibles             | none                         |
| OpenAI | /v1/models/{model}          | Obtiene información de un modelo          | model                        |
| OpenAI | /v1/moderations             | Analiza contenido inapropiado             | model, input                 |
| OpenAI | /v1/batches                 | Ejecuta solicitudes por lote              | input_file_id                |
| OpenAI | /v1/batches/{batch_id}      | Consulta estado de un batch               | batch_id                     |
| OpenAI | /v1/assistants              | Crea asistentes personalizados            | model, instructions          |

---

## API de Mercado Pago

| API         | Endpoint                           | Descripción               | Parámetros                |
| ----------- | ---------------------------------- | ------------------------- | ------------------------- |
| MercadoPago | /v1/payments                       | Crear pago                | transaction_amount, token |
| MercadoPago | /v1/payments/{id}                  | Obtener pago              | id                        |
| MercadoPago | /v1/preapproval                    | Crear suscripción         | payer_email, reason       |
| MercadoPago | /v1/preapproval/{id}               | Obtener suscripción       | id                        |
| MercadoPago | /v1/customers                      | Crear cliente             | email, first_name         |
| MercadoPago | /v1/customers/{id}                 | Obtener cliente           | id                        |
| MercadoPago | /v1/customers/{id}/cards           | Registrar tarjeta         | token                     |
| MercadoPago | /v1/customers/{id}/cards/{card_id} | Obtener tarjeta           | card_id                   |
| MercadoPago | /v1/checkout/preferences           | Crear preferencia de pago | items                     |
| MercadoPago | /v1/checkout/preferences/{id}      | Obtener preferencia       | id                        |
| MercadoPago | /v1/refunds                        | Crear reembolso           | payment_id                |
| MercadoPago | /v1/refunds/{id}                   | Obtener reembolso         | id                        |
| MercadoPago | /v1/merchant_orders                | Crear orden de pago       | items                     |
| MercadoPago | /v1/merchant_orders/{id}           | Obtener orden             | id                        |
| MercadoPago | /v1/payment_methods                | Listar métodos de pago    | none                      |
| MercadoPago | /v1/payment_methods/installments   | Obtener cuotas            | amount, bin               |
| MercadoPago | /v1/identification_types           | Tipos de identificación   | none                      |
| MercadoPago | /v1/users/me                       | Información del usuario   | none                      |
| MercadoPago | /v1/account/bank_report            | Reporte bancario          | date_from                 |
| MercadoPago | /v1/charges                        | Crear cargo directo       | amount                    |

---

## API de Padlet

| API    | Endpoint              | Descripción                | Parámetros         |
| ------ | --------------------- | -------------------------- | ------------------ |
| Padlet | /api/padlets          | Listar padlets             | none               |
| Padlet | /api/padlets/{id}     | Obtener padlet             | id                 |
| Padlet | /api/padlets          | Crear padlet               | title, description |
| Padlet | /api/padlets/{id}     | Actualizar padlet          | title              |
| Padlet | /api/padlets/{id}     | Eliminar padlet            | id                 |
| Padlet | /api/posts            | Listar publicaciones       | padlet_id          |
| Padlet | /api/posts/{id}       | Obtener publicación        | id                 |
| Padlet | /api/posts            | Crear publicación          | content            |
| Padlet | /api/posts/{id}       | Actualizar publicación     | content            |
| Padlet | /api/posts/{id}       | Eliminar publicación       | id                 |
| Padlet | /api/comments         | Listar comentarios         | post_id            |
| Padlet | /api/comments/{id}    | Obtener comentario         | id                 |
| Padlet | /api/comments         | Crear comentario           | content            |
| Padlet | /api/comments/{id}    | Eliminar comentario        | id                 |
| Padlet | /api/users/me         | Obtener perfil del usuario | none               |
| Padlet | /api/users/{id}       | Obtener usuario            | id                 |
| Padlet | /api/attachments      | Subir archivo              | file               |
| Padlet | /api/attachments/{id} | Obtener archivo            | id                 |
| Padlet | /api/tags             | Listar etiquetas           | none               |
| Padlet | /api/tags/{id}        | Obtener etiqueta           | id                 |

---

## Evidencias del uso de la apliacacion web
### Evidencia 1: Pagina de inicio con las 3 apis disponibles
### Resultado: Exitoso se abrio la pagina sin problema

![Evidencia 1](/imagenes/ev1.png)

### Evidencia de la pagina de Google Gemmini en donde se tiene varias opciones
### Resultado: Exitoso se abrio la pagina sin problema

![Evidencia 2](/imagenes/ev22.png)
#### Contar un chiste
### Resultado: Se genero el chiste sin problema

![Evidencia 2](/imagenes/ev2.png)
#### Detectar emociones
### Resultado: Se genero el resultado sin problema

![Evidencia 3](/imagenes/ev3.png)
#### Resumir textos
### Resultado: Se resumieron los textos sin problemas

![Evidencia 4](/imagenes/ev4.png)

### Pagina de inicio para añadir una nueva publicacion
### Resultado: Exitoso se abrio la pagina sin problema

![Evidencia 5](/imagenes/ev5.png)
### Evidencia de publicacion creada exitosamente
### Resultado: Se agrego una nueva publicacion sin problema

![Evidencia 6](/imagenes/ev6.png)
### Pagina de inicio de mercado pago 
### Resultado: Exitoso se abrio la pagina sin problema

![Evidencia 7](/imagenes/ev7.png)
### API consumida para realizar un pago
### Resultado: Se consumio la API sin problema

![Evidencia 8](/imagenes/ev8.png)



---

## Consideraciones de Seguridad
- Nunca comitar archivos `.env`
- Usar `http://localhost` en desarrollo
- Configurar callbacks correctamente
- Limitar scopes a lo necesario.

---
# 📌 Conclusión

El desarrollo de esta práctica permitió aplicar de manera exitosa los conceptos fundamentales del consumo de APIs en plataformas online, integrando tres servicios distintos: Pagos, IA Generativa y Planeación de Actividades. A través de una arquitectura MVC con Node.js, Express y MySQL, se logró construir una aplicación web funcional, segura y escalable.

## ✅ Resultados Alcanzados

- **Gestión de API Keys:** Se solicitaron y gestionaron correctamente las tres claves de acceso requeridas.
- **Consumo de Endpoints:** Se documentaron más de 20 endpoints disponibles en las APIs consumidas.
- **Seguridad:** Se implementó bloqueo de cuenta tras 5 intentos fallidos, envío de código de desbloqueo por correo y encriptación de contraseñas con bcrypt.
- **Interfaz de Usuario:** Se desarrolló una landing page interactiva que permite consultar cada una de las APIs integradas.
- **Documentación:** Se elaboró documentación completa en formato Markdown, incluyendo pruebas y capturas de pantalla.

## 🎯 Objetivos Cumplidos

✓ Desarrollo de aplicación web con autenticación de usuarios  
✓ Consumo exitoso de tres APIs diferentes  
✓ Implementación de sistema de seguridad robusto  
✓ Pruebas documentadas con resultados positivos  
✓ Código modular y siguiendo buenas prácticas

## 💡 Aprendizajes Clave

- Consumo de APIs REST (métodos HTTP, autenticación, manejo de errores)
- Implementación de medidas de seguridad en aplicaciones web
- Aplicación del patrón MVC en proyectos reales
- Integración frontend-backend con Pug y Express
- Documentación técnica estructurada y clara

