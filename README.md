# Nodenavngenerator

Et lite, nettleserbasert verktøy for å lage nodenavn etter
[den norske navnekonvensjonen](https://meshwiki.no/meshtastic/navnekonvensjon).

Verktøyet:

- bygger navn fra rolle, kommune, lokasjon, eier og valgfritt suffiks
- teller UTF-8-byte mot grensen på 24 byte
- forkorter bare lokasjonen når det er nødvendig
- viser hvilke tegn som bruker mer enn én byte
- fungerer på norsk og engelsk, i lys og mørk modus

Kommuneregisteret hentes som en versjonslåst avhengighet fra
[`norske-kommuneforkortelser`](https://github.com/wilhel1812/norske-kommuneforkortelser).
En automatisert jobb holder avhengigheten oppdatert.

## Utvikling

```sh
git clone --recurse-submodules <repository-url>
npm install
npm run dev
```

Kontroller og produksjonsbygg:

```sh
npm run check
npm run build
```

## Uavhengig prosjekt

Meshtastic® er et registrert varemerke som tilhører Meshtastic LLC. Dette
uavhengige prosjektet er ikke tilknyttet eller godkjent av Meshtastic LLC.
