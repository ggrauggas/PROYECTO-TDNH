# PROMPT PARA MEMORIA DEL PROYECTO

Vas a ayudar a recopilar y redactar información del proyecto para su documentación en la memoria. Realiza los siguientes pasos:

---

## 1. Revisión general del proyecto

Debes analizar la estructura completa del proyecto, centrándote en:

### Backend/src
- Controllers  
- Middlewares  
- Models  
- Routes  
- Utils  

### Backend/src/db
- Seeders  
- Migraciones  
- Tablas  

### Frontend/src/
- Vistas  
- Componentes  
- Router
- Assets
- Services

### Infraestructura
- Todos los Dockerfile  
- docker-compose.yml
- db/src
  > db/src contiene algunos scripts ausiliares y el init, no ha sido muy util pero por si acaso

### Documentación de despliegue
- DEPLOY.md: documento con toda la información sobre el despliegue web del proyecto  

---

## 2. Análisis del documento base

- Lee el documento: **Plantilla de projecte - DAW - 2025.docx**  
- En él se encuentra la estructura de la memoria  
- Debes centrarte en:
  - Campos vacíos o incompletos  
  - Secciones pendientes de desarrollo  
  - Comentarios que contengan el símbolo # son comentarios personalizados para que los tengas en cuenta

- Utiliza la *skill* de lectura de documentos DOCX para interpretar correctamente el contenido  

---

## 3. Recopilación y redacción de la información

- Recopila la información del proyecto previamente analizada  
- Redacta los contenidos utilizando un tono:
  - Técnico  
  - Formal  
  - Impersonal  

- Usa preferentemente el **pretérito perfecto simple**:
  - “Se diseñó…”  
  - “Se implementó…”  
  - “Se desarrolló…”  

- Reserva el **pretérito perfecto compuesto** solo para contexto general:
  - “En los últimos años se ha incrementado…”  

---

## 4. Generación del documento de salida

Debes generar un archivo en formato **.md** con la siguiente estructura:

---

### 4.1 Cambios en secciones solicitadas

Para cada sección:
- Título de la sección  
- Contenido redactado en:
  - Párrafos  
  - Listas si es necesario

> Si con algún comentario se te ha pedido un cambio en alguna sección devolverás la sección entera con los cambios, no solo los cambios

---

### 4.2 Diagramas solicitados

Para cada diagrama:
- Título del diagrama  
- Representación:
  - Dibujo en texto (si aplica)  
  - O descripción clara del diagrama  

---

### 4.3 Notas

- Añade aquí:
  - Dudas  
  - Falta de información  
  - Solicitudes de aclaración  

---

## Normas generales

- Todo el contenido debe estar en castellano  
- Los términos en inglés deben ir entre comillas  
- Sin errores ortográficos ni gramaticales  
- Mantener coherencia de estilo (negrita, cursiva, etc.) según el documento base  
- No modificar nunca el archivo DOCX original  
- No utilizar emojis  
- No dirigirse directamente al usuario en el contenido  
- Cualquier comunicación debe incluirse exclusivamente en la sección de **Notas**  
