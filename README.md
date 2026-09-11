# Nexo Digital Partners Website

Pagina estatica corporativa para vender productos digitales, sistemas de captacion, webs profesionales, automatizacion, dashboards, micro-apps, IA aplicada, portales educativos y catalogos digitales.

## Abrir localmente

Abre `index.html` en el navegador.

## Archivos

- `index.html`: estructura y contenido de la pagina
- `styles.css`: identidad editorial clara, responsive, sin capas de estilos heredadas
- `script.js`: menu accesible, filtros, vistas ampliadas y solicitud por WhatsApp/correo sin envio automatico
- `translations.js`: selector multilingue con ES, EN, DE, FR, PT, IT, RU, CS, ZH, JA, HE y AR
- `studio-copy.js`: textos de la nueva interfaz y correcciones de espanol
- `assets/`: identidad de marca generada, capturas reales de proyectos y Lucide con licencia
- `lead-tracker-template.csv`: plantilla simple para seguimiento de contactos y cotizaciones
- `social/facebook/`: kit de lanzamiento para Facebook con portada, perfil, arte del primer post y textos de publicacion
- `social/linkedin/launch-status.md`: estado verificado y enlace a la primera publicacion

## Verificacion

Con Node.js, Playwright y Microsoft Edge disponibles:

```sh
node scripts/verify-site.cjs
```

Prueba 12 idiomas a 1440, 768, 390 y 320 px, filtros, modal de proyecto y foco, seleccion de servicio, enlaces de solicitud codificados, ausencia de envio automatico, persistencia e indisponibilidad de localStorage. Guarda capturas de escritorio, movil, proyectos y contacto en `verification/` (no versionadas).

La variable `NEXO_TEST_URL` permite ejecutar la misma verificacion contra GitHub Pages. Sin ella se abre `index.html` localmente; no requiere servidor.

`scripts/capture-portfolio.cjs` regenera las capturas desde los proyectos vecinos y los sitios publicos. Requiere que existan las carpetas locales indicadas en el script. Las versiones locales no se presentan como testimonios ni aplicaciones listas para produccion.

## Posicionamiento

La pagina evita vender "paginas web baratas" y presenta la oferta como una agencia de estrategia, productos digitales, automatizacion e IA para varios nichos: salud, psicologia, educacion, consultoria, comercio, creadores, servicios profesionales y startups pequenas.

## Inspiracion estrategica

La estructura se inspiro en patrones de agencias corporativas de estrategia, diseno y tecnologia: servicios por capacidades, casos de trabajo, modelos de contratacion, foco en crecimiento/operacion y lenguaje de productos digitales.

## Idiomas

Incluye selector de idioma, persistencia en el navegador y soporte RTL para hebreo y arabe.
