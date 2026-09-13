# Claridad comercial de los planes

Verificado el 2026-09-13 sobre GitHub Pages.

## Cambios

- El plan de USD 120 se presenta como Kit de trabajo con IA. Su descripcion distingue uso manual con revision humana de integraciones y ejecucion automatica, que se cotizan aparte. Alineado con `launch/service-offers.md`.
- Sistema Digital explica que cubre un flujo concreto con una funcion central y requiere acordar alcance, usuarios e integraciones.
- Se conservan los cuatro importes de partida y los destinos de contacto.
- Tres textos nuevos en español y once traducciones por texto en `studio-copy.js`.
- Se versiono el recurso como `studio-copy.js?v=20260913-offers`: la primera prueba encontro HTML nuevo con traducciones anteriores en cache. La repeticion posterior mostro los textos nuevos traducidos.

## Evidencia

- `node scripts/test-offer-copy.cjs`: tres fuentes presentes en HTML, 33 traducciones no vacias ni identicas al español, cuatro precios conservados y version del recurso. No pretende certificar calidad linguistica ni cobertura total del sitio.
- GitHub Actions 34775086549 completo con success para `c50efe3`.
- Navegador publico: doce idiomas por cuatro anchos (1440, 768, 390 y 320), 48 combinaciones. Sin desbordamiento del documento ni de los planes; hijos dentro del ancho y limite inferior de cada articulo. Titulo del kit y descripcion del sistema sin fallback español en los once idiomas adicionales.
- Capturas de escritorio 1440 y movil 390 revisadas visualmente: textos legibles, botones separados, monograma visible. No se guardaron capturas nuevas en disco.
- Pedir IA selecciona `automation`; Pedir Sistema selecciona `dashboard`. No se enviaron solicitudes.
- Idioma restaurado a español y override del viewport eliminado.

## Hallazgo pendiente: traduccion parcial heredada

La cobertura funcional anterior no demuestra traduccion completa. `translations.js` copia el diccionario ingles a otros idiomas y reemplaza solo parte de las claves. En la vista arabe se observaron precios, nombres de otros planes y listas en ingles, junto a las nuevas descripciones correctamente traducidas.

El siguiente trabajo de localizacion debe inventariar el texto actualmente visible por seccion, completar los valores heredados que siguen en ingles y probar su contenido, no solo la existencia de una clave o el cambio de `lang` y `dir`. Evitar traducir nombres de marcas y terminos que deban conservarse. La revision editorial sigue pendiente; no se afirma revision nativa ni certificacion.
