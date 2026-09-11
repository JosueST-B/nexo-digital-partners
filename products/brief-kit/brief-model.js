(function(root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.NexoBriefModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const types = ['web', 'landing', 'automation', 'dashboard', 'prototype', 'other'];
  function validate(value, definitions) {
    if (!value || value.format !== 'nexo-brief' || value.version !== 1 ||
        !value.fields || typeof value.fields !== 'object' || Array.isArray(value.fields)) {
      throw new Error('Invalid format');
    }
    const fields = {};
    for (const [id,,,type] of definitions) {
      const field = Object.hasOwn(value.fields, id) ? value.fields[id] : '';
      if (typeof field !== 'string' || field.length > (type === 'textarea' ? 5000 : 200)) {
        throw new Error('Invalid field');
      }
      fields[id] = field;
    }
    if (fields.type && !types.includes(fields.type)) throw new Error('Invalid type');
    if (fields.date) {
      const date = new Date(fields.date + 'T00:00:00Z');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date) || fields.date.startsWith('0000') ||
          !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== fields.date) {
        throw new Error('Invalid date');
      }
    }
    return {fields, language: value.language === 'en' ? 'en' : 'es'};
  }
  return {types, validate};
});
