export default function ShopLoading() {
  return (
    <div className="wrap pt-8" aria-busy="true">
      <div className="skeleton h-8 w-52" />
      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-28 shrink-0" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-[4/5] w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
