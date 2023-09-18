import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

let StringsOfLanguages = new LocalizedStrings({
  en: {
    how: 'How do you want your egg today?',
    land_allocated: 'Land allocated',
    used_land: 'Used land',
    boiledEgg: 'Boiled egg',
    softBoiledEgg: 'Soft-boiled egg',
    choice: 'How to choose the egg',
  },
  it: {
    how: 'Come vuoi il tuo uovo oggi?',
    land_allocated: 'Terreno assegnato',
    used_land: 'terreno usato',
    boiledEgg: 'Uovo sodo',
    softBoiledEgg: 'Uovo alla coque',
    choice: "Come scegliere l'uovo",
  },
});

export default StringsOfLanguages;
