
import React from "react";

export default function About() {
  const values = [
    {
      icon: "☕",
      title: "Quality in Every Cup",
      description:
        "Every cup is prepared with care, bringing you a comforting coffee experience.",
    },
    {
      icon: "🥐",
      title: "Freshly Prepared",
      description:
        "We believe good food and coffee make every moment a little more special.",
    },
    {
      icon: "🤎",
      title: "A Cozy Experience",
      description:
        "A welcoming place to relax, connect with friends, or enjoy your own little break.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-[#f8f3ec] px-5 py-20 md:px-10 lg:px-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* About Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1445116572660-236099ec97a0"
            alt="Cozy coffee shop interior"
            className="h-[350px] w-full rounded-3xl object-cover shadow-xl md:h-[480px]"
          />

          <div className="absolute -bottom-6 right-5 rounded-2xl bg-[#5b3828] p-5 text-white shadow-xl md:right-8">
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-[#ead8c8]">
              Made with care
            </p>
          </div>
        </div>

        {/* About Content */}
        <div className="pt-5 lg:pt-0">
          <p className="mb-3 font-semibold uppercase tracking-[4px] text-[#b8734e]">
            About Velvet Drip
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-[#3e2723] md:text-5xl">
            More Than Coffee,
            <span className="block text-[#b8734e]">
              It's an Experience.
            </span>
          </h2>

          <p className="mb-5 leading-8 text-[#76645a]">
            Welcome to Velvet Drip, where every sip brings a little
            happiness. We believe that coffee is more than just a
            drink — it's a moment to pause, relax, and enjoy.
          </p>

          <p className="mb-8 leading-8 text-[#76645a]">
            From your morning coffee to an evening treat, our goal
            is to make every visit warm, comfortable, and memorable.
          </p>
<a
  href="/#full-menu"
  className="inline-block rounded-full bg-[#5b3828] px-8 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#8b5e46]"
>
  Explore Our Menu →
</a>
        </div>
      </div>

      {/* Our Values */}
      <div className="mx-auto mt-24 grid max-w-7xl gap-7 md:grid-cols-3">
        {values.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl border border-[#eadfd3] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">{item.icon}</div>

            <h3 className="mb-3 text-xl font-bold text-[#3e2723]">
              {item.title}
            </h3>

            <p className="leading-7 text-[#76645a]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
