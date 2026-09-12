# Verificacion de lanzamiento - 2026-09-12

## Sitio principal

Version publica revisada desde el navegador integrado. Doce idiomas (es, en, de, fr, pt, it, ru, cs, zh, ja, he, ar) por cuatro anchos (1440, 768, 390 y 320 px): 48 combinaciones. Todas sin desbordamiento horizontal de pagina. Enlaces de Facebook y Nexo Brief presentes; `dir=rtl` confirmado para arabe y hebreo. Esta comprobacion es de regresion de layout y enlaces, no una nueva auditoria completa de todos los flujos.

## Nexo Brief

- Pruebas Node aprobadas: formato/version, longitudes, tipos, fechas reales incluido bisiesto, claves desconocidas, campos heredados, ejemplo JSON, paridad de etiquetas ES/EN y recursos locales.
- Paquete ZIP generado y leido de nuevo; los nueve archivos se compararon byte por byte con sus fuentes.
- ZIP publicado descargado por HTTP y comparado con el local: SHA-256 coincidente, 1.050.061 bytes. Esto verifica la entrega del paquete, no las exportaciones que genera la aplicacion.
- UI publica: ejemplo ficticio importado y progreso 6/6; importacion invalida rechazada conservando el nombre; guardado y recarga conservan datos e idioma; Escape cierra Nueva ficha sin borrar datos.
- Version imprimible: veinte etiquetas/campos y el ultimo texto de entrega presentes. No se reviso paginacion de un PDF generado.
- Responsive final: ES/EN por 1440, 768, 390 y 320 px sin desbordamiento de pagina; imagen cargada. Capturas de escritorio y movil inspeccionadas visualmente. La navegacion de secciones movil tiene scroll interno intencional.
- Cache: la version del stylesheet `brief.css?v=1.0.1` recibe el arreglo `aside{min-width:0}`. Se comprobo su efecto en la pagina publicada.
- Exportacion JSON: la UI mostro Archivo preparado sin errores de consola, pero el evento de descarga no llego a la herramienta. No se declara una descarga completa verificada. Markdown y PDF paginado requieren completar la comprobacion de entrega.
- No se ingresaron datos reales de clientes; solo el ejemplo ficticio incluido en el paquete.

## Facebook

Portada, perfil, bio y categorias guardados. Primera publicacion visible con imagen, texto completo, enlace correcto, audiencia publica y etiqueta IA. Post presente en Destacados despues de fijarlo. Boton Contactarnos vuelve a mostrar el destino guardado al abrir su editor. Enlaces y transcripcion en `social/facebook/launch-status.md`.

## Plataformas comerciales

Gumroad: cuenta de Google con sesion cerrada; falta acceso del titular. Fiverr: lectura del perfil externo agotada por tiempo de espera, sin cambios. Workana: borrador preparado, no aplicado. No hay anuncios pagados, postulaciones masivas, DMs o ventas nuevas verificadas.
