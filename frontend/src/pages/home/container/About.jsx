import React from "react";
import { FiPackage, FiShoppingCart, FiBarChart2 } from "react-icons/fi";

const About = () => {
  return (
    <section className="container mx-auto px-5 mt-25">
      <div className="mt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiPackage className="inline-block mr-2 text-primary" />
              Custom Orders
            </h3>
            <p className="text-gray-600">
              We provide bespoke jewelry supplies tailored to your specific
              needs.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiShoppingCart className="inline-block mr-2 text-primary" />
              Expert Consultation
            </h3>
            <p className="text-gray-600">
              Get professional advice on selecting the perfect materials for
              your projects.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Reseller Guidance and Support
            </h3>
            <p className="text-gray-600">
              We offer support for resellers on live selling, including
              invoicing, boxing, and international shipping guidance. We ensure
              transparency and proper conduct throughout the process.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Jewelry Services
            </h3>
            <p className="text-gray-600">
              We offer jewelry repair, resizing, cleaning, and full
              customization. We also provide gold bar casting and fine jewelry
              crafting using high-grade materials.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Live Sales and Custom Orders
            </h3>
            <p className="text-gray-600">
              We welcome live sales events and provide custom-made jewelry.
              Reservations are encouraged for personalized attention.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Shipping and Logistics
            </h3>
            <p className="text-gray-600">
              We ship within Japan and internationally using secure methods like
              FedEx. Customers are responsible for shipping fees and additional
              taxes.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              High-Grade Jewelry Options
            </h3>
            <p className="text-gray-600">
              We offer a wide range of high-quality jewelry, including diamonds
              and gold jewelry from 24K to 10K, meeting the highest standards.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Multi-Language Support
            </h3>
            <p className="text-gray-600">
              We provide communication support in Tagalog, English, and Japanese
              for smooth transactions and customer satisfaction.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <FiBarChart2 className="inline-block mr-2 text-primary" />
              Online Presence
            </h3>
            <p className="text-gray-600">
              Follow us on Instagram, Facebook, TikTok, and Line app for
              updates. Visit our official website for more information and
              online orders.
            </p>
          </div>
        </div>
      </div>
      <br />
      <br />
    </section>
  );
};

export default About;
