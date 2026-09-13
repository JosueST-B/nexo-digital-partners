# Nexo Catalog - verificacion 2026-09-13

Ruta publica: https://josuest-b.github.io/nexo-digital-partners/products/catalog-check/

Demostracion funcional, no integracion ERP ni servicio de IA. CSV local con asignacion de columnas, validacion, grupos duplicados completos, detalle y exportaciones. No requiere cuenta, no envia datos, no modifica archivos originales.

## Evidencia

- `scripts/test-catalog.cjs`: ejemplo, CSV entrecomillado, BOM, punto/coma decimal, ceros iniciales del SKU, limites numericos, filas de distinta longitud, cabeceras ambiguas, duplicados, formulas, limites de tamano y 5.000 registros. Paridad de claves ES/EN. Aprobado.
- UI publicada: ejemplo de ocho registros produce tres validos y cinco por revisar. Filtro de incidencias devuelve cinco; busqueda A001 devuelve dos. Detalle muestra original ` A001 ` y salida `A001`; Escape cierra el dialogo.
- Descargas reales del navegador: `nexo-catalog-validos.csv` (142 bytes) y `nexo-catalog-informe.csv` (833 bytes), leidas desde Descargas. Comparacion exacta con las salidas esperadas del motor, retirando el BOM: aprobada. El informe protege la celda de formula del ejemplo.
- Importacion con archivo: CSV separado por punto y coma y precios con coma decimal produce dos validos y conserva SKU `001` y `002`. Una asignacion duplicada de columnas muestra error. CSV con comillas mal cerradas muestra error y oculta resultados anteriores.
- Cambio ES/EN conserva nombre del archivo, columnas y resultados.
- Paginacion real con fixture generado de 120 registros: primera pagina 50, ultima 20, ultimo SKU DEMO-120 y siguiente deshabilitado. Buscar desde la ultima pagina vuelve a pagina 1 y encuentra un solo resultado.
- Responsive final del CSS `v=1.0.1`: ES/EN por 1440, 768, 390 y 320 px, ocho combinaciones sin desbordamiento horizontal de pagina. Tabla con scroll interno intencional. Logo cargado; capturas de escritorio y movil inspeccionadas. Se corrigio una etiqueta accesible fuera del contenedor posicionando `.table-wrap`.
- Consola de la UI publicada: sin errores observados durante las comprobaciones.
- Despliegue final: `catalog.js?v=1.0.1` conserva y traduce el mensaje de CSV malformado al cambiar de ES a EN. Recuperacion con el ejemplo y nueva revision comprobadas.
- Enlace Nexo Catalog en el pie del sitio: presente y sin desbordamiento de pagina en 12 idiomas por cuatro anchos (48 combinaciones). Se recorrio el enlace y abrio la ruta publica correcta. Esta comprobacion no sustituye una auditoria completa de los otros flujos del sitio.

## Limites de la verificacion

Pruebas funcionales realizadas en Chromium mediante el navegador integrado. No se afirma certificacion WCAG, compatibilidad con todos los importadores, Excel/ERP ni prueba manual en Safari/Firefox. Solo se usaron datos ficticios. Las dimensiones temporales del navegador se restablecieron al terminar.

Fuente del motor CSV y licencia: `products/catalog-check/vendor/` y `launch/research.md`.
