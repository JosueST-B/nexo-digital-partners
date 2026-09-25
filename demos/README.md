# Portfolio demos

- MedStock: copied from the local inventory app. Session-only storage under a separate key; fictional seed products; reset button; imports disabled. Tax values are illustrative, not tax advice or valid invoicing.
- Volia: selected presentation assets from the original site. Corporate contact records, map, QR, PDF catalogs and outbound sales links are excluded. Forms simulate submissions only.
- Volia Control: reduced, independently implemented sample of inventory adjustments and quote composition. Uses fictional products and in-memory data. CSV exports are marked DEMO. This is not the complete React application and contains no clinical or commercial records.
- Inner Oraculum: links to its existing public site; no duplicate deployment.
- FormCraft: omitted at the owner's request because source code is unavailable.

The demo builds contain only allowlisted browser assets, not source databases, credentials, backups or server files. MedStock and Volia can be regenerated from sibling source folders with `node scripts/build-portfolio-demos.cjs` (requires the existing Cheerio dependency in the sibling Inner Oraculum project). Generated assets are committed; production does not require that dependency.
