const fs = require('fs');

let content = fs.readFileSync('src/i18n.ts', 'utf-8');

const regex = /("([^"]+)":\s*\{)([^}]+)\}/g;

const fallbackTranslations = {
  ru: { turnOn: "Включить", turnOff: "Выключить" },
  en: { turnOn: "Enable", turnOff: "Disable" },
  es: { turnOn: "Activar", turnOff: "Desactivar" },
  fr: { turnOn: "Activer", turnOff: "Désactiver" },
  de: { turnOn: "Aktivieren", turnOff: "Deaktivieren" },
  zh: { turnOn: "启用", turnOff: "禁用" },
  ja: { turnOn: "オンにする", turnOff: "オフにする" },
  ar: { turnOn: "تفعيل", turnOff: "تعطيل" },
  pt: { turnOn: "Ativar", turnOff: "Desativar" },
  it: { turnOn: "Attiva", turnOff: "Disattiva" },
  tr: { turnOn: "Aç", turnOff: "Kapat" },
  ko: { turnOn: "켜기", turnOff: "끄기" },
  hi: { turnOn: "चालू करें", turnOff: "बंद करें" },
  nl: { turnOn: "Inschakelen", turnOff: "Uitschakelen" },
  pl: { turnOn: "Włącz", turnOff: "Wyłącz" },
  id: { turnOn: "Aktifkan", turnOff: "Nonaktifkan" },
  th: { turnOn: "เปิด", turnOff: "ปิด" },
  vi: { turnOn: "Bật", turnOff: "Tắt" },
  fa: { turnOn: "روشن کردن", turnOff: "خاموش کردن" },
  uk: { turnOn: "Увімкнути", turnOff: "Вимкнути" }
};

let newContent = content.replace(regex, (match, p1, lang, p3) => {
  const trans = fallbackTranslations[lang] || fallbackTranslations.en;
  // insert after the first line (e.g. after "prayers": "...")
  return `${p1}\n    "turnOn": "${trans.turnOn}",\n    "turnOff": "${trans.turnOff}",${p3}}`;
});

fs.writeFileSync('src/i18n.ts', newContent);
console.log('Added turnOn and turnOff to all languages');
