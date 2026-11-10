
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2f1d17] px-5 pb-6 pt-16 text-white md:px-10 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link to="/" className="text-3xl font-bold tracking-wide">
            Velvet <span className="text-[#d49a70]">Drip</span> ☕
          </Link>

          <p className="mt-5 max-w-xs leading-7 text-[#d6c4b7]">
            A little coffee, a lot of happiness. Enjoy comforting
            drinks, delicious treats, and beautiful moments with us.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3026] transition hover:bg-[#b8734e]"
            >
              IG
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3026] transition hover:bg-[#b8734e]"
            >
              f
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3026] transition hover:bg-[#b8734e]"
            >
              ▶
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-[#e5b18b]">
            Quick Links
          </h3>

          <ul className="space-y-4 text-[#d6c4b7]">
            <li>
              <Link to="/" className="transition hover:text-[#e5b18b]">
                Home
              </Link>
            </li>
            <li>
              <a href="/#menu" className="transition hover:text-[#e5b18b]">
                Our Menu
              </a>
            </li>
            <li>
              <a href="/#about" className="transition hover:text-[#e5b18b]">
                About Us
              </a>
            </li>
            <li>
              <a href="/#contact" className="transition hover:text-[#e5b18b]">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Menu Links */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-[#e5b18b]">
            Explore
          </h3>

          <ul className="space-y-4 text-[#d6c4b7]">
            <li>
              <a href="/#menu" className="transition hover:text-[#e5b18b]">
                Coffee & Beverages
              </a>
            </li>
            <li>
              <a href="/#menu" className="transition hover:text-[#e5b18b]">
                Snacks
              </a>
            </li>
            <li>
              <a href="/#menu" className="transition hover:text-[#e5b18b]">
                Desserts
              </a>
            </li>
            <li>
              <Link to="/cart" className="transition hover:text-[#e5b18b]">
                Your Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-[#e5b18b]">
            Visit Our Cafe
          </h3>

          <ul className="space-y-5 text-[#d6c4b7]">
            <li className="flex gap-3">
              <span>📍</span>
              <span>Add your cafe address here</span>
            </li>

            <li className="flex gap-3">
              <span>📞</span>
              <span>Add your cafe phone number</span>
            </li>

            <li className="flex gap-3">
              <span>✉️</span>
              <span>Add your cafe email address</span>
            </li>

            <li className="flex gap-3">
              <span>🕒</span>
              <span>Add your opening hours</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-14 max-w-7xl border-t border-[#604438] pt-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-[#cbb7a8] md:flex-row">
          <p>
            © {currentYear} Velvet Drip. All rights reserved.
          </p>

          <p>
            Made with <span className="text-[#d49a70]">♥</span> and coffee.
          </p>

          <Link
            to="/admin/login"
            className="transition hover:text-[#e5b18b]"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
