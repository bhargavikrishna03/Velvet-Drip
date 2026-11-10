
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // Replace this with the same WhatsApp number used in Checkout
  const WHATSAPP_NUMBER = "91YOURNUMBER";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `Hello Velvet Drip!

Name: ${formData.name}
Phone: ${formData.phone}
Message: ${formData.message}`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    setFormData({
      name: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section
      id="contact"
      className="bg-[#fffaf4] px-5 py-20 md:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-semibold uppercase tracking-[4px] text-[#b8734e]">
            Get In Touch
          </p>

          <h2 className="text-4xl font-bold text-[#3e2723] md:text-5xl">
            We'd Love to Hear From You
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#76645a]">
            Have a question, suggestion, or feedback?
            Send us a message. We'd be happy to connect with you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}
          <div className="rounded-3xl bg-[#5b3828] p-8 text-white md:p-10">
            <h3 className="mb-3 text-2xl font-bold">
              Contact Information
            </h3>

            <p className="mb-10 leading-7 text-[#ead8c8]">
              Visit us, give us a call, or send us a message.
              We're always happy to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h4 className="font-semibold">Our Location</h4>
                  <p className="mt-1 text-sm text-[#ead8c8]">
                    Add your cafe address here
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="font-semibold">Phone Number</h4>
                  <p className="mt-1 text-sm text-[#ead8c8]">
                    Add your cafe phone number
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <h4 className="font-semibold">Email Address</h4>
                  <p className="mt-1 text-sm text-[#ead8c8]">
                    Add your cafe email address
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">🕒</span>
                <div>
                  <h4 className="font-semibold">Opening Hours</h4>
                  <p className="mt-1 text-sm text-[#ead8c8]">
                    Add your cafe opening and closing times
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full bg-[#f2c49b] px-7 py-3 font-semibold text-[#3e2723] transition hover:bg-white"
            >
              Chat on WhatsApp →
            </a>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-[#eadfd3] bg-white p-8 shadow-sm md:p-10">
            <h3 className="mb-2 text-2xl font-bold text-[#3e2723]">
              Send Us a Message
            </h3>

            <p className="mb-8 text-sm text-[#76645a]">
              Fill in the details below and we'll connect through WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block font-medium text-[#3e2723]">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-[#e5d8ca] px-4 py-3 outline-none transition focus:border-[#b8734e] focus:ring-2 focus:ring-[#b8734e]/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#3e2723]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  pattern="[0-9]{10}"
                  title="Enter a valid 10-digit phone number"
                  className="w-full rounded-xl border border-[#e5d8ca] px-4 py-3 outline-none transition focus:border-[#b8734e] focus:ring-2 focus:ring-[#b8734e]/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#3e2723]">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="5"
                  required
                  className="w-full resize-none rounded-xl border border-[#e5d8ca] px-4 py-3 outline-none transition focus:border-[#b8734e] focus:ring-2 focus:ring-[#b8734e]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#5b3828] py-4 font-semibold text-white transition hover:bg-[#8b5e46]"
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
