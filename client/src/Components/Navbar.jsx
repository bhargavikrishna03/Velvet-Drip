
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Menu", href: "/#full-menu" },
  { name: "About Us", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#eadfd2] bg-[#fffaf3]/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10">

        {/* BRAND LOGO */}
        <a
          href="#home"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#713f2b] text-2xl text-white shadow-md transition duration-300 group-hover:rotate-6 group-hover:bg-[#a35f40]">
            ☕
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#513326]">
              Velvet Drip<span className="text-[#b77752]">.</span>
            </h1>
            <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#a4775b]">
              Coffee & Conversations
            </p>
          </div>
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative py-2 text-sm font-semibold text-[#684c3b] transition duration-300 hover:text-[#b77752] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#b77752] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfd2] text-[#713f2b] transition hover:bg-[#f5ece1]"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
            >
              <path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L22 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b77752] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <a
            href="/#full-menu"
            className="rounded-full bg-[#713f2b] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#a35f40] hover:shadow-lg"
          >
            Explore Menu <span className="ml-1">→</span>
          </a>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd2] text-[#713f2b]"
            aria-label="Shopping cart"
          >
            <span className="text-xl">🛍</span>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b77752] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e9dd] text-xl text-[#513326] transition hover:bg-[#eadfd2]"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="border-t border-[#eadfd2] bg-[#fffaf3] px-5 py-6 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-semibold text-[#684c3b] transition hover:bg-[#f5ece1] hover:text-[#b77752]"
              >
                <span className="mr-3 text-xs text-[#b77752]">
                  0{index + 1}
                </span>
                {link.name}
              </a>
            ))}

            <a
              href="#menu"
              onClick={closeMenu}
              className="mt-3 rounded-full bg-[#713f2b] px-5 py-3 text-center font-bold text-white transition hover:bg-[#a35f40]"
            >
              Explore Our Menu →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
