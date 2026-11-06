import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CircleHelp,
  Copy,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { copy, type Language } from "./i18n";
import { municipalities } from "./municipalities";
import { generateName } from "./nameGenerator";
import { countryOptions, loadPlaceNames, normalizePlaceCode } from "./placeCodes";
import { roles } from "./roles";

type Theme = "system" | "light" | "dark";
type NamingMode = "national" | "international";

function readPreference<T extends string>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);
  return (value || fallback) as T;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() =>
    readPreference("language", "nb"),
  );
  const [theme, setTheme] = useState<Theme>(() =>
    readPreference("theme", "system"),
  );
  const [role, setRole] = useState("");
  const [mode, setMode] = useState<NamingMode>("national");
  const [country, setCountry] = useState("NO");
  const [placeCode, setPlaceCode] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [suffix, setSuffix] = useState("");
  const [copied, setCopied] = useState(false);
  const [lookup, setLookup] = useState<{
    country: string;
    names: Record<string, string> | null;
  }>();
  const text = copy[language];

  const international = mode === "international";
  const foreign = international && country !== "NO";
  const validPlaceCode = /^[A-Z2-9]{3}$/.test(placeCode);
  const lookupCountry = foreign && validPlaceCode ? country : "";
  const norwegianCode = municipality && international ? "NO" + municipality : municipality;
  const locationCode = foreign ? (lookupCountry ? country + placeCode : "") : norwegianCode;
  const countries = useMemo(() => countryOptions(language), [language]);

  const result = useMemo(
    () => generateName({ role, municipality: locationCode, location, owner, suffix }),
    [role, locationCode, location, owner, suffix],
  );

  useEffect(() => {
    if (!lookupCountry) return;
    const controller = new AbortController();
    loadPlaceNames(lookupCountry, controller.signal).then(
      (names) => {
        if (!controller.signal.aborted) setLookup({ country: lookupCountry, names });
      },
      () => {
        if (!controller.signal.aborted) setLookup({ country: lookupCountry, names: null });
      },
    );
    return () => controller.abort();
  }, [lookupCountry]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.title = text.title;
  }, [language, text.title]);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    localStorage.setItem("theme", theme);
    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => setCopied(false), [result.displayName]);

  async function copyName() {
    if (!result.copyable) return;
    await navigator.clipboard.writeText(result.displayName);
    setCopied(true);
  }

  const invalidPlaceCode = foreign && placeCode !== "" && !validPlaceCode;
  const status = invalidPlaceCode
    ? text.invalidPlaceCode
    : result.missingRequired
      ? text.missing
      : result.truncated
        ? text.truncated(result.fullBytes)
        : !result.copyable
          ? text.tooLong
          : null;
  let lookupStatus = "";
  if (lookupCountry) {
    if (lookup?.country !== lookupCountry) {
      lookupStatus = text.lookupLoading;
    } else if (!lookup.names) {
      lookupStatus = text.lookupUnavailable;
    } else {
      const placeName = lookup.names[placeCode];
      lookupStatus = placeName ? `${locationCode} — ${placeName}` : text.lookupNoMatch;
    }
  }
  const resultStatus = [status, lookupStatus].filter(Boolean).join(" · ");

  return (
    <main className="page-shell">
      <header className="header">
        <h1>{text.title}</h1>
        <div className="header-controls">
          <label className="language-control">
            <span className="sr-only">{text.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              aria-label={text.language}
            >
              <option value="nb">Norsk</option>
              <option value="en">English</option>
            </select>
          </label>

          <div className="theme-control" aria-label={text.theme}>
            {(
              [
                ["system", Monitor, text.system],
                ["light", Sun, text.light],
                ["dark", Moon, text.dark],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                className={theme === value ? "active" : ""}
                aria-label={label}
                aria-pressed={theme === value}
                title={label}
                onClick={() => setTheme(value)}
              >
                <Icon aria-hidden="true" />
              </button>
            ))}
          </div>

          <a
            className="help-link"
            href="https://github.com/wilhel1812/nodenavngenerator#readme"
            target="_blank"
            rel="noreferrer"
            aria-label={text.convention}
            title={text.convention}
          >
            <CircleHelp aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="form-grid" aria-label={text.title}>
        <div className="naming-controls">
          <label className="field">
            <span>{text.mode}</span>
            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as NamingMode);
                setLookup(undefined);
              }}
            >
              <option value="national">{text.national}</option>
              <option value="international">{text.international}</option>
            </select>
          </label>
          {international && (
            <label className="field">
              <span>{text.country}</span>
              <select
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  setPlaceCode("");
                  setLookup(undefined);
                }}
              >
                {countries.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <label className="field role-field">
          <span>
            {text.role} <b aria-hidden="true">*</b>
          </span>
          <select
            data-testid="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">{text.chooseRole}</option>
            {roles.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field municipality-field">
          <span>
            {foreign ? text.placeCode : text.municipality} <b aria-hidden="true">*</b>
          </span>
          {foreign ? (
            <input
              value={placeCode}
              onChange={(event) => setPlaceCode(normalizePlaceCode(event.target.value))}
              placeholder="STO"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={invalidPlaceCode || undefined}
              aria-describedby="result-status"
            />
          ) : (
            <select
              data-testid="municipality"
              value={municipality}
              onChange={(event) => setMunicipality(event.target.value)}
            >
              <option value="">{text.chooseMunicipality}</option>
              {municipalities.map((item) => (
                <option key={item.number} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className="field location-field">
          <span>
            {text.location} <b aria-hidden="true">*</b>
          </span>
          <input
            data-testid="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder={text.locationPlaceholder}
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span>{text.owner}</span>
          <input
            data-testid="owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder={text.ownerPlaceholder}
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span>{text.suffix}</span>
          <input
            data-testid="suffix"
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            autoComplete="off"
          />
        </label>
      </section>

      <button
        type="button"
        className={`result-panel ${
          status ? "result-panel-warning" : "result-panel-valid"
        }`}
        onClick={copyName}
        disabled={!result.copyable}
        aria-describedby={resultStatus ? "result-status" : undefined}
      >
        <span className="result-name">
          {result.displayName || <span aria-hidden="true">—</span>}
        </span>
        <span className="copy-affordance">
          {copied ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          <span>{copied ? text.copied : text.copy}</span>
        </span>
        <span className="byte-count">
          {text.byteCount(result.displayBytes)}
        </span>
        {(foreign || resultStatus) && (
          <span className="status-message" id="result-status" aria-live="polite">
            {resultStatus}
          </span>
        )}
      </button>

      {result.multibyte.length > 0 && (
        <p className="multibyte-note" aria-live="polite">
          {result.multibyte
            .map(({ character, count, totalBytes, bytesEach }) =>
              count === 1
                ? text.multibyteSingle(character, bytesEach)
                : text.multibyteMultiple(
                    character,
                    count,
                    totalBytes,
                    bytesEach,
                  ),
            )
            .join(" ")}
        </p>
      )}
    </main>
  );
}
