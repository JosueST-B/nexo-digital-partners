// Portfolio descriptions, kept separate from inherited site copy.
(() => {
  const locales = ["en","de","fr","pt","it","ru","cs","zh","ja","he","ar"];
  const rows = [
  [
    "Cotizaciones, inventario, cobros y documentos en un espacio de trabajo local. Captura sin registros privados.",
    "Quotes, inventory, collections and documents in a local workspace. Screenshot without private records.",
    "Angebote, Lagerbestand, Zahlungseingänge und Dokumente in einer lokalen Arbeitsumgebung. Aufnahme ohne private Datensätze.",
    "Devis, stocks, encaissements et documents dans un espace de travail local. Capture sans données privées.",
    "Orçamentos, estoque, cobranças e documentos em um espaço de trabalho local. Captura sem registros privados.",
    "Preventivi, inventario, incassi e documenti in uno spazio di lavoro locale. Schermata senza dati privati.",
    "Сметы, запасы, платежи и документы в локальном рабочем пространстве. Снимок без конфиденциальных записей.",
    "Nabídky, zásoby, platby a dokumenty v místním pracovním prostředí. Snímek bez soukromých záznamů.",
    "在本地工作区管理报价、库存、收款和文档。截图不含私人记录。",
    "見積もり、在庫、入金、文書をローカルの作業環境で管理。スクリーンショットに個人情報は含まれません。",
    "הצעות מחיר, מלאי, גבייה ומסמכים בסביבת עבודה מקומית. צילום ללא רשומות פרטיות.",
    "عروض أسعار ومخزون وتحصيل ومستندات في مساحة عمل محلية. لقطة شاشة بلا سجلات خاصة."
  ],
  [
    "Prototipo de captura de puntuaciones, perfiles visuales e informes. Ejemplo ficticio; no acredita validación clínica.",
    "Prototype for score entry, visual profiles and reports. Fictional example; not evidence of clinical validation.",
    "Prototyp für die Eingabe von Testwerten, visuelle Profile und Berichte. Fiktives Beispiel; kein Nachweis klinischer Validierung.",
    "Prototype de saisie des scores, de profils visuels et de rapports. Exemple fictif ; ne constitue pas une validation clinique.",
    "Protótipo de entrada de pontuações, perfis visuais e relatórios. Exemplo fictício; não comprova validação clínica.",
    "Prototipo per inserimento di punteggi, profili visivi e relazioni. Esempio fittizio; non attesta una validazione clinica.",
    "Прототип ввода баллов, визуальных профилей и отчётов. Вымышленный пример; не подтверждает клиническую валидацию.",
    "Prototyp pro zadávání skóre, vizuální profily a zprávy. Fiktivní příklad; nedokládá klinickou validaci.",
    "用于分数录入、可视化档案和报告的原型。示例为虚构，不代表通过临床验证。",
    "スコア入力、視覚的なプロフィール、レポートの試作。架空の例であり、臨床的妥当性を証明するものではありません。",
    "אב־טיפוס להזנת ציונים, פרופילים חזותיים ודוחות. דוגמה בדויה; אינה מעידה על תיקוף קליני.",
    "نموذج أولي لإدخال الدرجات وعرض الملفات المرئية والتقارير. مثال افتراضي لا يثبت التحقق السريري."
  ],
  [
    "Editor visual de formularios con campos configurables, vista adaptable y exportación HTML. El envío real requiere configurar un servicio.",
    "Visual form editor with configurable fields, responsive preview and HTML export. Real submissions require a configured service.",
    "Visueller Formulareditor mit konfigurierbaren Feldern, responsiver Vorschau und HTML-Export. Echter Versand erfordert einen eingerichteten Dienst.",
    "Éditeur visuel de formulaires avec champs configurables, aperçu adaptatif et export HTML. L’envoi réel nécessite un service configuré.",
    "Editor visual de formulários com campos configuráveis, visualização responsiva e exportação HTML. O envio real exige configurar um serviço.",
    "Editor visuale di moduli con campi configurabili, anteprima adattiva ed esportazione HTML. L’invio reale richiede un servizio configurato.",
    "Визуальный редактор форм с настройкой полей, адаптивным просмотром и экспортом HTML. Для отправки требуется настроенный сервис.",
    "Vizuální editor formulářů s nastavitelnými poli, responzivním náhledem a exportem HTML. Skutečné odesílání vyžaduje nastavenou službu.",
    "可视化表单编辑器，支持字段配置、自适应预览和 HTML 导出。实际提交需要配置相应服务。",
    "項目の設定、レスポンシブなプレビュー、HTML出力に対応したフォームエディター。実際の送信にはサービスの設定が必要です。",
    "עורך טפסים חזותי עם שדות ניתנים להגדרה, תצוגה מותאמת וייצוא HTML. שליחה בפועל מחייבת הגדרת שירות.",
    "محرر نماذج مرئي بحقول قابلة للضبط ومعاينة متجاوبة وتصدير HTML. الإرسال الفعلي يتطلب إعداد خدمة."
  ]
];
  for (const [source, ...values] of rows) {
    locales.forEach((locale, i) => { window.NEXO_TRANSLATIONS[locale][source] = values[i]; });
  }
})();

