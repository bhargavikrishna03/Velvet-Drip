
const Hero = () => {
  const whatsappNumber = "MyNumber"; // Replace with your WhatsApp number, including country code

  const whatsappMessage = encodeURIComponent(
    "Hello Velvet Drip! I would like to know more about your cafe menu."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#fffaf3]"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#e9c9a8]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#d9a982]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-10">

        {/* LEFT CONTENT */}
        <div className="relative z-10 space-y-7">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d5c2] bg-[#f7eee4] px-4 py-2">
            <span className="text-[#b77752]">✦</span>
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#9a6345]">
              Welcome to Velvet Drip
            </span>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#a4775b]">
              A place to slow down
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-[#513326] sm:text-6xl lg:text-7xl">
              Your Daily
              <span className="block font-serif font-normal italic text-[#b77752]">
                Dose of
              </span>
              Happiness.
            </h1>
          </div>

          <p className="max-w-lg text-base leading-8 text-[#806b5b] md:text-lg">
            Great coffee, delicious bites and beautiful little
            moments. Discover your favourite corner at Velvet Drip,
            where every cup is brewed with love.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4">

            {/* Explore Full Menu */}
            <a
              href="/#full-menu"
              className="group rounded-full bg-[#713f2b] px-7 py-4 font-bold text-white shadow-lg shadow-[#713f2b]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#a35f40]"
            >
              Explore Our Menu
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* WhatsApp Contact */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#b88b70] bg-white/60 px-7 py-4 font-bold text-[#713f2b] transition duration-300 hover:-translate-y-1 hover:bg-[#f1e5d8]"
            >
              <span className="mr-2">☏</span>
              Let's Talk
            </a>
          </div>

          {/* HIGHLIGHTS */}
          <div className="grid grid-cols-3 gap-4 border-t border-[#eadfd2] pt-7">

            <div>
              <span className="text-2xl">☕</span>
              <h3 className="mt-2 text-sm font-bold text-[#713f2b] sm:text-base">
                Freshly Brewed
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#907a69]">
                Every single day
              </p>
            </div>

            <div>
              <span className="text-2xl">♡</span>
              <h3 className="mt-2 text-sm font-bold text-[#713f2b] sm:text-base">
                Made with Love
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#907a69]">
                Crafted with care
              </p>
            </div>

            <div>
              <span className="text-2xl">✧</span>
              <h3 className="mt-2 text-sm font-bold text-[#713f2b] sm:text-base">
                Cozy Moments
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#907a69]">
                Your happy place
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mx-auto w-full max-w-xl">

          <div className="absolute -right-6 -top-6 h-48 w-48 rounded-full bg-[#e9c9a8]/60 blur-3xl" />

          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-[#b77752]/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border-[8px] border-white shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1100&q=90"
              alt="Freshly brewed coffee in a cozy cafe"
              className="h-[420px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[500px] md:h-[560px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#2c170e]/50 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur-lg">

              <p className="text-xs font-bold uppercase tracking-[2px] text-[#a4775b]">
                Your daily coffee ritual
              </p>

              <h3 className="mt-1 font-serif text-2xl font-bold text-[#513326]">
                Brewed to perfection.
              </h3>

              <p className="mt-1 text-sm text-[#806b5b]">
                Take a sip. Take a break. Feel the difference.
              </p>

            </div>
          </div>

          {/* FLOATING LABEL */}
          <div className="absolute -bottom-5 -right-3 rounded-full bg-[#713f2b] px-6 py-4 text-sm font-bold text-white shadow-xl sm:-right-5">
            Made with ♥
          </div>

          <div className="absolute -left-5 top-10 hidden rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xl sm:block">
            <span className="text-2xl">☕</span>
            <p className="mt-1 text-xs font-bold text-[#513326]">
              Sip. Smile. Repeat.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
