# Utvikling av nodenavngeneratoren

Generatoren bygger navn fra rolle, kommune, lokasjon, eier og valgfritt suffiks. Den teller UTF-8-byte mot grensen på 24 byte, forkorter bare lokasjonen når det er nødvendig og viser hvilke tegn som bruker mer enn én byte. Verktøyet fungerer på norsk og engelsk, i lys og mørk modus.

Kommuneregisteret hentes som en versjonslåst avhengighet fra [norske-kommuneforkortelser](https://github.com/wilhel1812/norske-kommuneforkortelser). En automatisert jobb holder avhengigheten oppdatert.

## UN/LOCODE-oppslag

Stedskoder og stedsnavn utenfor Norge er hentet fra **UN/LOCODE 2025-1**, utgitt av United Nations Economic Commission for Europe (UNECE). Se [UNECEs publisering](https://unlocode.unece.org/publications/) og [kilderegisteret](https://opensource.unicc.org/un/unece/uncefact/vocab-locode).

Generatoren laster bare oppslagsfilen for valgt land når en fullstendig kode er angitt. Filene inneholder kode og stedsnavn. Importen utelater koder merket for sletting og beholder det første publiserte navnet hvis en kode har flere navn.

For å oppdatere, last ned produksjonsutgaven som ZIP fra UNECE. Kjør importen med utgavenummeret fra publiseringssiden og stien til ZIP-filen:

```sh
python3 scripts/import-unlocode.py 2025-1 /sti/til/unece-release.zip
```

Kontroller endringene i `src/unlocode.json` og `public/unlocode/`. Fjern mappen for den gamle utgaven når den nye erstatter den. SHA-256 for ZIP-filen som ble brukt til 2025-1 er `ad409fc7149b10f98d61190c34d9daf78b78bb8b31464cc66de1a89d09b01b5d`.

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
