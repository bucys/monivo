export function ServicesPerformedCard({ count }: { count: number }) {
  return (
    <section
      aria-label="Aptarnavimai šį mėnesį"
      className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[30px]"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        Aptarnavimai šį mėnesį
      </div>

      {count > 0 ? (
        <>
          <div className="mt-2 text-[40px] font-semibold leading-tight tracking-[-0.028em] tabular-nums text-ink-900/90 lg:text-[44px] lg:tracking-[-0.032em]">
            {count}
          </div>
          <div className="mt-1 text-[13px] text-ink-500">
            pagal pajamų įrašus
          </div>
        </>
      ) : (
        <p className="mt-2 text-[13px] leading-[1.55] text-ink-500">
          Pradėk registruoti pajamas — čia matysi mėnesio aptarnavimų skaičių.
        </p>
      )}
    </section>
  );
}
