# Utvikling av nodenavngeneratoren

Generatoren bygger navn fra rolle, kommune, lokasjon, eier og valgfritt suffiks. Den teller UTF-8-byte mot grensen på 24 byte, forkorter bare lokasjonen når det er nødvendig og viser hvilke tegn som bruker mer enn én byte. Verktøyet fungerer på norsk og engelsk, i lys og mørk modus.

Kommuneregisteret hentes som en versjonslåst avhengighet fra [norske-kommuneforkortelser](https://github.com/wilhel1812/norske-kommuneforkortelser). En automatisert jobb holder avhengigheten oppdatert.

## Kom i gang

```sh
git clone --recurse-submodules https://github.com/wilhel1812/nodenavngenerator.git
cd nodenavngenerator
npm install
npm run dev
```

Prosjektet krever Node.js 22 eller nyere.

## Kontroller og produksjonsbygg

```sh
npm run check
npm run build
```

## Utgivelser

Utgivelser kan varsle nodekonfiguratoren umiddelbart når repository-hemmeligheten `CONFIGURATOR_DISPATCH_TOKEN` er satt. Konfiguratorens daglige kontroll er fallback.

## Uavhengig prosjekt

Meshtastic® er et registrert varemerke som tilhører Meshtastic LLC. Dette uavhengige prosjektet er ikke tilknyttet eller godkjent av Meshtastic LLC.

## Lisens

GPL-3.0-only. Se [LICENSE](LICENSE).
