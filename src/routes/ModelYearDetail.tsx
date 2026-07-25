import { useMemo } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { resolveSpec } from '../lib/resolveSpec';
import { CarProfile } from '../components/cars/CarProfile';
import { bodyArtKey } from '../components/cars/profileArt';
import { SpecBlock } from '../components/SpecBlock';
import { DifferentialCallout } from '../components/DifferentialCallout';
import { SpecialEditionCards } from '../components/SpecialEditionCards';
import { ColorChips } from '../components/ColorChips';
import { InspectionList } from '../components/InspectionList';
import { NotFound } from './NotFound';
import { num } from '../lib/format';
import { cascadeYear, pathFor, specKey, toggleParam } from '../lib/selection';
import s from '../components/blocks.module.css';

function AdjacentYearLink({
  genPath,
  year,
  trimId,
  back,
}: {
  genPath: string;
  year: number;
  trimId?: string;
  back?: boolean;
}) {
  const { selection, notice } = cascadeYear(genPath, year, trimId);
  return (
    <Link
      className={s.yearNavLink}
      to={pathFor(selection)}
      state={notice ? { trimNotice: notice } : undefined}
    >
      {back ? `← ${year}` : `${year} →`}
    </Link>
  );
}

export function ModelYearDetail() {
  const { gen, year, trim } = useParams();
  const [params] = useSearchParams();
  const { pathname, search } = useLocation();

  // URL is the state: useParams + one memoized selector. §2
  const spec = useMemo(() => resolveSpec(gen, Number(year), trim), [gen, year, trim]);

  if (!spec) return <NotFound />;

  const { generation, modelYear, trim: activeTrim } = spec;
  const genPath = generation.id.toLowerCase();
  const years = generation.modelYears.map((my) => my.year);
  const index = years.indexOf(modelYear.year);
  const prev = index > 0 ? years[index - 1] : null;
  const next = index >= 0 && index < years.length - 1 ? years[index + 1] : null;

  const trimYearCount = activeTrim?.productionByYear?.[modelYear.year];

  /*
   * ?color= is validated against the colours this year actually offered, so a stale or
   * hand-edited link degrades to the default rather than painting the car something Mazda
   * never sold. Falls back to the first colour of the year that has a swatch, then to the
   * generation accent.
   */
  const requested = params.get('color');
  const selectedColor =
    spec.colors.find((c) => c.name === requested) ?? spec.colors.find((c) => c.swatchHex);
  const paint = selectedColor?.swatchHex?.value ?? generation.accent.light;

  /*
   * Body style comes from ?body= the same way, falling back to the year's first listed
   * style. Roofline is the second-strongest identification cue after the generation itself,
   * so an NC year should be able to show its PRHT and an ND its RF.
   */
  const styles = modelYear.bodyStyles ?? [];
  const requestedStyle = params.get('body');
  const activeStyle = styles.find((b) => b === requestedStyle) ?? styles[0];
  const body = activeStyle ? bodyArtKey(activeStyle) : 'soft';

  return (
    <div className="page">
      {/* 1. Header */}
      <header className={s.header}>
        <div className={s.eyebrow}>
          <Link to={`/${genPath}`}>{generation.name} generation</Link>
          {modelYear.subGeneration ? ` · ${modelYear.subGeneration}` : ''}
        </div>
        <h1 className={s.title}>
          {modelYear.year} MX-5 Miata
          {activeTrim ? ` · ${activeTrim.name}` : ''}
        </h1>
        <div className={s.chipRow}>
          <span className={`${s.chip} ${s.chipAccent}`} title={`${generation.name} market range`}>
            {generation.marketRange}
          </span>
          {activeTrim?.trackRelevant && <span className={`${s.chip} ${s.chipTrack}`}>HPDE pick</span>}
          {trimYearCount && (
            <span className={s.chip}>
              {num(trimYearCount.value)} built in {modelYear.year}
            </span>
          )}
          <Link className={s.chip} to={`/checklist/${genPath}`}>
            Inspection checklist →
          </Link>
          <Link className={s.chip} to={`/compare?a=${specKey({ gen: genPath, year: modelYear.year, trim: activeTrim?.id })}`}>
            Compare →
          </Link>
        </div>
      </header>

      {/* The car itself, in whichever colour the ?color= chip selection names. */}
      <figure className={s.hero}>
        <CarProfile
          gen={generation.id}
          body={body}
          paint={paint}
          label={`${modelYear.year} MX-5 Miata${selectedColor ? ` in ${selectedColor.name}` : ''}`}
        />
        {selectedColor && (
          <figcaption className={s.heroCaption}>
            {selectedColor.name}
            {/* Most names already say it — "Merlot Mica · Mica" helps nobody. */}
            {selectedColor.finish &&
            selectedColor.finish !== 'solid' &&
            !selectedColor.name.toLowerCase().includes(selectedColor.finish)
              ? ` · ${selectedColor.finish}`
              : ''}
            <span className={s.heroHint}>approximate colour — pick another below</span>
          </figcaption>
        )}
      </figure>

      {/* 2. What changed — visual priority over the spec table. §4.3.2 */}
      <section className={s.whatChanged} aria-labelledby="what-changed">
        <h2 className={s.whatChangedTitle} id="what-changed">
          What changed in {modelYear.year}
        </h2>
        <ul className={s.whatChangedList}>
          {modelYear.whatChanged.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className={s.buyLine}>
          <span className={s.stars} aria-label={`Buy rating ${modelYear.buyRating} of 5`}>
            {'★'.repeat(modelYear.buyRating)}
            {'☆'.repeat(5 - modelYear.buyRating)}
          </span>
          <span>{modelYear.buyRatingWhy}</span>
        </p>
      </section>

      {/* 3. Spec block */}
      <SpecBlock spec={spec} />

      {/* 4. Differential callout */}
      <DifferentialCallout drivetrain={spec.drivetrain} />

      {/* Trim detail — what this package actually is */}
      {activeTrim && (
        <section className={s.section} aria-label="Trim detail">
          <h2 className={s.sectionTitle}>{activeTrim.name}</h2>
          <div className={s.card}>
            <p style={{ marginBottom: '0.5rem' }}>{activeTrim.blurb}</p>
            <div className={s.diffLabel}>Includes</div>
            <ul className={s.cardList}>
              {activeTrim.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            {activeTrim.excludes && activeTrim.excludes.length > 0 && (
              <>
                <div className={s.diffLabel} style={{ marginTop: '0.5rem' }}>
                  Deletes
                </div>
                <ul className={s.cardList}>
                  {activeTrim.excludes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            )}
            {activeTrim.productionCount && (
              <em className={s.footnote}>
                {num(activeTrim.productionCount.value)} built in total
                {activeTrim.productionCount.confidence !== 'confirmed'
                  ? ` (${activeTrim.productionCount.confidence})`
                  : ''}
                {activeTrim.productionCount.note ? ` — ${activeTrim.productionCount.note}` : ''}
              </em>
            )}
          </div>
        </section>
      )}

      {/* 5. Special editions */}
      <SpecialEditionCards editions={spec.specialEditions} gen={generation.id} colors={spec.colors} />

      {/* 6. Colors — the chips drive the hero above via ?color=. */}
      <ColorChips colors={spec.colors} year={modelYear.year} selected={selectedColor?.name} />

      {/* Body styles — like the colour chips, these repaint the car at the top. */}
      {styles.length > 0 && (
        <section className={s.section} aria-label="Body styles">
          <h2 className={s.sectionTitle}>Body styles in {modelYear.year}</h2>
          <div className={s.chipRow}>
            {/* toggleParam always sets here rather than toggling: there is no "no body style". */}
            {styles.map((b) => (
              <Link
                key={b}
                className={`${s.chip} ${b === activeStyle ? s.chipOn : ''}`}
                to={toggleParam(pathname, search, 'body', b, false)}
                replace
                preventScrollReset
                aria-pressed={b === activeStyle}
              >
                {b}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Year quirks + inspection filtered to this year */}
      {modelYear.yearQuirks && modelYear.yearQuirks.length > 0 && (
        <section className={s.section} aria-label="Year quirks">
          <h2 className={s.sectionTitle}>{modelYear.year} quirks</h2>
          <div className={s.card}>
            <ul className={s.cardList}>
              {modelYear.yearQuirks.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={s.section} aria-label="Inspection items">
        <h2 className={s.sectionTitle}>What to inspect on a {modelYear.year}</h2>
        <InspectionList items={spec.inspection} />
        <p className={s.colorNote}>
          <Link to={`/checklist/${genPath}`}>Open the printable {generation.name} checklist →</Link>
        </p>
      </section>

      {/*
        8. Prev/next year navigation. The operator scans adjacent years constantly to work out
        which side of a change a car falls on. Run the same cascade the Year dropdown uses so
        the URL never claims a trim that year didn't offer.
      */}
      <nav className={s.yearNav} aria-label="Adjacent model years">
        {prev !== null ? <AdjacentYearLink genPath={genPath} year={prev} trimId={activeTrim?.id} back /> : <span className={s.yearNavSpacer} />}
        {next !== null ? <AdjacentYearLink genPath={genPath} year={next} trimId={activeTrim?.id} /> : <span className={s.yearNavSpacer} />}
      </nav>
    </div>
  );
}
