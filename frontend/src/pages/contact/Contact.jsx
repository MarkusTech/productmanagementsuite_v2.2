import React from "react";
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const ContactPage = () => {
  return (
    <MainLayout>
      <section className="container mx-auto px-5 mt-25">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="md:w-1/2">
            <img
              className="w-full"
              src={images.Jewery}
              alt="Inventory Management"
            />
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0 text-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact us</h2>
            <p className="text-gray-600 text-lg">
              We'd love to hear from you! If you have any questions, feedback,
              or inquiries, please feel free to reach out to us using the
              contact information below:
            </p>

            <ul className="mt-6">
              <li className="flex items-center text-gray-600 mb-3">
                <FiPhone className="w-6 h-6 mr-2" />
                <span>Phone: (81)070-2333-2907</span>
              </li>
              <li className="flex items-center text-gray-600 mb-3">
                <FiMail className="w-6 h-6 mr-2" />
                <span>Email: caboanamarie715@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FiMapPin className="w-6 h-6 mr-2" />
                <span>
                  KIBA CORPORATION 102 DAIO-CHOU 8-16 MIYAKONOJO SHI, MIYAZAKI
                  KEN KYUSHU JAPAN 885-0026
                </span>
              </li>
            </ul>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
