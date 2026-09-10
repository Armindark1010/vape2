export default function AccountLoading() {
  return (
    <div className="wrap pt-8 pb-4 animate-pulse">
      {/* پروفایل skeleton */}
      <div className="card-g rounded-[24px] p-6">
        <div className="flex items-center gap-5">
          <div className="skeleton h-16 w-16 rounded-2xl shrink-0" />
          <div className="space-y-2.5 flex-1">
            <div className="skeleton h-5 w-40 rounded-lg" />
            <div className="skeleton h-3.5 w-60 rounded-lg" />
            <div className="skeleton h-3 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* آمار skeleton */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-g rounded-[20px] p-4 text-center">
            <div className="skeleton mx-auto h-5 w-16 rounded-lg" />
            <div className="skeleton mx-auto mt-2 h-3 w-12 rounded-lg" />
          </div>
        ))}
      </div>

      {/* سفارش‌ها skeleton */}
      <div className="skeleton mt-8 mb-4 h-5 w-28 rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-g rounded-[20px] p-4 flex items-center gap-3.5">
            <div className="skeleton h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded-lg" />
              <div className="skeleton h-3 w-44 rounded-lg" />
            </div>
            <div className="skeleton h-7 w-20 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
