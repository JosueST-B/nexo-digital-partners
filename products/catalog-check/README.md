# Nexo Catalog 1.0

Demostracion funcional de revision de catalogos CSV. Proyecto propio de Nexo Digital Partners; no es un sistema de inventario ni una integracion con un ERP.

## Uso y alcance

1. Abrir `index.html` en un navegador moderno o usar la version publicada. Elegir un CSV UTF-8 o el ejemplo ficticio.
2. Seleccionar el separador si no se detecta correctamente. Asignar las cinco columnas: SKU, producto, categoria, precio y existencias. Categoria puede estar vacia, pero la columna debe existir. Las columnas adicionales no se incluyen en la salida ni en el informe; el archivo original nunca se modifica.
3. Elegir punto o coma decimal, sin separadores de miles. Revisar y consultar el detalle de cada registro.
4. Descargar CSV valido o informe. El filtro solo afecta a la vista: las exportaciones siempre abarcan toda la revision.

Limites: 2 MB, 5.000 registros, 60 columnas, cabeceras de 200 caracteres y valores de hasta 500 caracteres. Se ignoran registros completamente vacios. El numero de registro no es el numero de linea fisica: un campo CSV entre comillas puede ocupar varias lineas.

Los precios admiten hasta nueve digitos enteros y dos decimales, no negativos. No se redondean importes con mas decimales: se apartan para revision. Las existencias son enteros no negativos de hasta nueve digitos. SKU y producto son obligatorios. Los SKU se comparan sin distinguir mayusculas: todas las apariciones de un duplicado quedan apartadas, sin decidir cual conservar.

La normalizacion recorta espacios de los extremos, compacta espacios interiores y formatea precios a dos decimales con punto. No cambia la capitalizacion del SKU ni sus ceros iniciales. La salida lleva cabeceras `sku,nombre,categoria,precio,stock` y separador coma.

Se apartan textos que empiecen por `=`, `+`, `-` o `@`, y campos de texto con caracteres de control. Es una regla conservadora para evitar formulas en hojas de calculo. El informe antepone un apostrofo a posibles formulas; ese prefijo de seguridad puede verse al abrir el CSV como texto. Revisar los archivos antes de importarlos a otro sistema. No se promete compatibilidad con todos los importadores.

Los datos solo existen en memoria durante esta sesion: no hay guardado automatico, telemetria, IA, peticiones a un servidor ni sincronizacion. No usar datos personales o sensibles. La interfaz ES/EN no traduce las respuestas. Recargar cierra la sesion y elimina sus datos. El informe contiene los valores originales y normalizados de las cinco columnas asignadas; no comparte ni cifra archivos.

## Ejemplo y comprobaciones

Ejemplo integrado: ocho registros ficticios, tres validos y cinco por revisar. Incluye dos SKU duplicados, un precio vacio, existencias negativas y una celda con inicio de formula. La automatizacion no realiza operaciones externas ni actualiza un inventario.

Motor CSV: Papa Parse 5.5.3, copia local, licencia MIT incluida en `vendor/LICENSE`. API oficial: https://www.papaparse.com/docs ; repositorio: https://github.com/mholt/PapaParse . Iconos Lucide y monograma propios del sitio se cargan desde los recursos locales del repositorio. Para usar sin conexion, conservar esa estructura de carpetas.

## English

Nexo Catalog reviews UTF-8 CSV catalogs locally in the browser. Map SKU, product name, category, price and stock; choose a decimal separator, review records, then export valid records or the complete review report. Filters affect the preview only. No cloud, telemetry, AI, storage or inventory updates. Reloading clears session data.

Limits: 2 MB, 5,000 records, 60 columns, 200-character headers and 500-character values. Prices accept up to nine integer digits and two decimal digits without thousands separators; stock must be a nonnegative integer. Every occurrence of a case-insensitive duplicate SKU is excluded from the valid output. Extra columns are not exported. Formula-like text is rejected; the report adds safety apostrophes where needed. The original file is never modified. Review exports before using another system. This is a working demonstration, not a production ERP integration.
