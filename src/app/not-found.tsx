import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-8xl font-black text-berry" aria-hidden="true">
        404
      </p>
      <h1 className="mt-2 font-display text-heading">
        Someone ate this page
      </h1>
      <p className="mt-2 text-choco/70">
        Crumbs everywhere, page nowhere. Honestly, we respect the commitment.
        Here&apos;s the way back to the good stuff.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="shine min-h-[52px] rounded-full bg-gradient-to-br from-berry to-strawberry px-8 py-3 font-display text-lg font-black text-white transition hover:brightness-110 active:scale-95"
        >
          Take me home
        </Link>
        <Link
          href="/build"
          className="min-h-[52px] rounded-full border-2 border-choco/20 px-8 py-3 font-display text-lg font-black transition hover:border-choco active:scale-95"
        >
          Build something instead
        </Link>
      </div>
    </div>
  );
}
