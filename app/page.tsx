import React from 'react';
import Image from 'next/image';
import logo from '../public/images/afritouch_logo_transparent.png'; // Update the path to your logo image

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center hero-section" style={{ backgroundImage: 'url(/images/hero_background.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold">Taste the Best Food for Every Occasion</h1>
          <button className="mt-4 px-8 py-4 bg-[#f8f3e7] text-[#333] rounded-full hover:bg-[#f7f2e4] transition">Get a Free Quote</button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#f8f3e7] text-center">
        <h2 className="text-4xl font-semibold">About Us</h2>
        <p className="mt-4 max-w-2xl mx-auto text-[#333]">At Afritouch, we specialize in providing exquisite catering services tailored to your needs.</p>
      </section>

      {/* Services Offered */}
      <section className="py-20 bg-[#f8f3e7]">
        <h2 className="text-4xl font-semibold text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold">Weddings</h3>
            <p>Elegant catering for your special day.</p>
          </div>
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold">Corporate Events</h3>
            <p>Professional catering for your business needs.</p>
          </div>
          <div className="service-item bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold">Private Parties</h3>
            <p>Customized catering for your celebrations.</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-4xl font-semibold text-center">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <img src="images/hero_image_afritouch.jpg" alt="Delicious Dish 1" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition" />
          <img src="images/hero_image_afritouch_2.jpg" alt="Delicious Dish 2" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition" />
          <img src="images/hero_image_afritouch_3.jpg" alt="Delicious Dish 3" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition" />
          <img src="images/hero_image_afritouch_4.jpg" alt="Delicious Dish 4" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition" />
          <img src="images/hero_image_afritouch_5.jpg" alt="Delicious Dish 5" className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <h2 className="text-4xl font-semibold text-center">What Our Clients Say</h2>
        <blockquote className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <p className="text-lg italic">"The catering was fantastic! Everyone enjoyed the food!"</p>
          <footer className="mt-4 text-gray-600">- Satisfied Customer</footer>
        </blockquote>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-4xl font-semibold text-center">Contact Us</h2>
        <p className="mt-4 text-center">Email: info@afritouchcaterers.co.ke</p>
        <p className="text-center">Phone: (123) 456-7890</p>
        <form className="mt-8 max-w-md mx-auto">
          <label className="block mb-2">Name:</label>
          <input type="text" name="name" required className="w-full p-2 mb-4 border rounded" />
          <label className="block mb-2">Email:</label>
          <input type="email" name="email" required className="w-full p-2 mb-4 border rounded" />
          <label className="block mb-2">Message:</label>
          <textarea name="message" required className="w-full p-2 mb-4 border rounded"></textarea>
          <button type="submit" className="w-full px-8 py-4 bg-[#f8f3e7] text-[#333] rounded-full hover:bg-[#f7f2e4] transition">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Afritouch Caterers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;