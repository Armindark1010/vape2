export default function ProductLoading() {
  return (
    <div className="wrap pt-6 pb-10" aria-busy="true">
      <div className="skeleton mb-6 h-5 w-56" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="skeleton aspect-[4/5] w-full" />
        <div className="space-y-4 pt-2">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-9 w-3/4" />
          <div className="skeleton h-7 w-44" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
