# Localizacion del sitio comercial

Fecha: 2026-09-13. Sitio verificado: https://josuest-b.github.io/nexo-digital-partners/

## Correccion

`translations.js` heredaba valores ingleses para otras versiones y solo reemplazaba parte de ellos. La existencia de una clave no demostraba traduccion. Se completo el contenido del sitio actual mediante `locale-completion.js`, cargado despues de los catalogos existentes y antes de inicializar la interfaz. El recurso tiene version de cache.

Se tradujeron etiquetas, accesibilidad, opciones y ayudas del formulario, descripciones de soluciones y proyectos, planes, condiciones y mensajes preparados. Se mantuvieron precios, marcas, enlaces y distinciones comerciales. La apertura y el cierre de las solicitudes ahora usan lenguaje natural de propuesta de proyecto, en lugar de diagnostico de un activo digital.

Los nombres de productos y marcas se conservan. Algunas palabras compartidas, como Web o Contact en frances, tienen excepciones explicitas revisadas; no se permite ignorar cualquier texto ingles por defecto. Los textos incrustados en capturas de proyectos no se traducen: siguen siendo capturas reales del proyecto original.

## Pruebas locales y despliegue

- `scripts/audit-localization.py` usa el parser HTML de la biblioteca estandar para inventariar textos y atributos actuales, incluyendo secciones desplegables y resultado inicialmente oculto. Añade los mensajes dinamicos que no estan en HTML.
- Ejecuta los catalogos con Node, comprueba su orden de carga, las 131 fuentes activas en once idiomas adicionales, claves ausentes y valores ingleses heredados sin excepcion revisada. Comprueba tambien apertura y cierre del mensaje en doce idiomas.
- Auditoria aprobada. No requiere paquetes de traduccion ni servicios externos.
- `scripts/test-offer-copy.cjs` aprobado: textos de alcance y precios conservados.
- Ambos controles se ejecutan en GitHub Actions antes de subir el sitio a Pages. En la ejecucion 34797141516 de `0a61f12`, la prueba y el paso Deploy to GitHub Pages finalizaron con success.

## Navegador publico

- Catalogo nuevo `locale-completion.js?v=20260913-1` presente en el DOM tras recargar.
- Once desplegables abiertos para incluir todas las soluciones, condiciones y presupuesto en la comprobacion.
- Doce idiomas por cuatro anchos (1440, 768, 390 y 320): 48 combinaciones sin desbordamiento horizontal del documento ni de sus secciones. `lang` cambia y `dir` es RTL en hebreo y arabe.
- Nombres de planes comprobados en todos los idiomas: ya no quedan Professional Website o Digital System como fallback en las versiones no inglesas.
- Solicitud preparada con datos ficticios en doce idiomas. Cuerpo de WhatsApp y correo coincidente; valores del usuario conservados y textos propios localizados. No se abrieron los enlaces de envio ni se enviaron mensajes.
- Vista ampliada de MedStock abierta y cerrada con Escape en doce idiomas. La descripcion coincide con la tarjeta traducida y el control de cierre esta localizado.
- Capturas inspeccionadas: precios en arabe a 1440, menu aleman y formulario japones a 390. No se guardaron capturas nuevas en disco.
- Sin errores en el registro de la pagina consultado al final.
- Datos ficticios eliminados; recarga con formulario vacio y resultado oculto. Idioma español y direccion LTR restaurados; viewport temporal eliminado.

## Alcance de la evidencia

Esta verificacion cubre el sitio comercial actual, no traduce interfaces de proyectos enlazados ni texto dentro de sus imagenes. Nexo Brief y Nexo Catalog conservan sus interfaces ES/EN independientes. Los mensajes nativos del navegador dependen de su configuracion.

Se reviso coherencia de las traducciones con las fuentes y limites comerciales; no se afirma traduccion certificada, validacion clinica ni revision por hablantes nativos. Las pruebas de cobertura y layout no sustituyen una revision linguistica externa si un contrato futuro la requiere.
