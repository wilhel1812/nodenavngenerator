# Navnekonvensjon for Meshtastic-noder

**[Åpne nodenavngeneratoren](https://wilhel1812.github.io/nodenavngenerator/)** — lag navn med riktige forkortelser og se antall UTF-8-byte.

Det finnes ingen offisiell navnekonvensjon for Meshtastic-noder. Dette er et frivillig forslag basert på lokale enigheter. Dersom du ønsker å følge konvensjonen, bruker du mønsteret:

`ROLLE-KOMMUNE-LOKASJON(-EIER)`

Fra og med firmware 2.8.0 støtter Meshtastic opptil 24 byte for lange nodenavn. Roller og kommunenavn forkortes slik at mest mulig av plassen kan brukes til å skrive stedsnavnet fullt ut. Eier og eventuelle andre opplysninger kan legges til som suffiks, så lenge hele navnet holder seg innenfor grensen.

## Rolle

Rollen forkortes til én bokstav (én byte):

| Kode | Rolle |
| --- | --- |
| R | ROUTER |
| L | ROUTER_LATE |
| B | CLIENT_BASE |
| C | CLIENT |
| M | CLIENT_MUTE |
| H | CLIENT_HIDDEN |
| S | SENSOR |
| T | TRACKER |
| F | LOST_AND_FOUND |
| K | TAK |
| E | TAK_TRACKER |

## Kommune

Kommunenavnet forkortes etter [kommunetabellen i norske-kommuneforkortelser](https://github.com/wilhel1812/norske-kommuneforkortelser/blob/main/data/kommuner.csv). Listen bygger, der det finnes egnede koder, på etablerte forkortelser fra blant annet UN/LOCODE. Resten er utviklet som en åpen, fellesskapsbasert standard.

## Lokasjon

Oppgi lokasjonen så nøyaktig du selv ønsker. Den skal gi en indikasjon på hvor noden står, men trenger ikke beskrive den nøyaktige plasseringen. Av hensyn til privatliv og nodens sikkerhet kan det være greit å beskrive et generelt område.

Merk at æ, ø, å og andre spesialtegn bruker mer enn én byte i UTF-8. Grensen på 24 byte gjelder hele navnet, inkludert bindestreker.

## Eier

Eier er valgfritt og gjør det lettere å se hvilke noder som har samme eier. Trenger du å få tak i eieren av en uovervåket router, kan du prøve å kontakte andre noder med samme eierfelt. Som radioamatør kan du bruke kallesignalet ditt; ellers kan du bruke navnet ditt eller et pseudonym.

## Eksempler

`R-OSL-Tryvann-LA8PV`

En router på Tryvann i Oslo, driftet av LA8PV. Navnet er på 19 byte.

`M-VOS-Finne-Kari`

En Client Mute fra Finne i Voss kommune, med Kari som eier. Navnet er på 16 byte.

## Vanlige spørsmål

### Lokasjon og rolle er allerede metadata. Hvorfor inkludere det i navnet?

Informasjonen kan være overflødig, men er ikke alltid tilgjengelig. I traceroutes gjør nodenavnene det enklere å forstå ruten signalet har tatt. Gode navn lar deg også se og sortere på lokasjon uten å bytte til kartvisning. Forskjellige apper viser posisjon og rolle i forskjellig grad, så navnet gjør informasjonen tilgjengelig flere steder.

### Hva med mobile noder som ikke har en fast lokasjon?

Beskriv hvor noden kommer fra, omtrent som båter oppgir hjemmehavn. Da blir det lettere å se om noder er på besøk langveisfra. Rollen vil ofte også kunne indikere om noden er mobil.

---

Konvensjonen er flyttet hit fra [MeshWiki.no](https://meshwiki.no/meshtastic/navnekonvensjon). Se [utviklingsdokumentasjonen](DEVELOPMENT.md) for arbeid med generatoren og [LICENSE](LICENSE) for GPL-3.0-only.
