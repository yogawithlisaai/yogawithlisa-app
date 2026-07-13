import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-serif text-2xl italic lowercase text-white">yoga with lisa</p>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Helping you find <em className="italic">stillness</em> in a loud world, one grounded
            practice at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">Explore</p>
            <ul className="space-y-3 text-sm text-white/65">
              <li><Link href="/classes" className="hover:text-white">Classes</Link></li>
              <li><Link href="/recipes" className="hover:text-white">Recipes</Link></li>
              <li><Link href="/mindshift" className="hover:text-white">MindShift</Link></li>
              <li><Link href="/wellness" className="hover:text-white">Wellness</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">Connect</p>
            <ul className="space-y-3 text-sm text-white/65">
              <li><Link href="/book" className="hover:text-white">Book with Lisa</Link></li>
              <li><Link href="/reminders" className="hover:text-white">Reminders</Link></li>
              <li><a href="https://calendly.com/contact-yogawithlisa/30min" target="_blank" rel="noreferrer" className="hover:text-white">Discovery Call</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-line-dark)] px-5 py-6 text-center text-xs text-white/35 sm:px-6">
        © {new Date().getFullYear()} Yoga with Lisa. All rights reserved.
      </div>
    </footer>
  );
}
