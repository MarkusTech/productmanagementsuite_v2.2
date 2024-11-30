import React from "react";
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";

const AboutPage = () => {
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

          <div className="md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About us</h2>
            <p className="text-gray-600 text-lg">
              At our jewelry shop, we not only sell exquisite pieces but also
              provide resellers with the guidance they need to succeed in live
              selling. From invoicing to packaging and shipping, including
              international deliveries, we ensure each step is handled with
              utmost care and professionalism.
            </p>
            <br />
            <p className="text-gray-600 text-lg">
              Transparency is at the core of what we do. We believe in clear
              communication, whether it's on-screen during live sessions or
              behind the scenes. We advise our clients on potential surcharges
              upfront, helping them make informed decisions with confidence.
            </p>
            <br />
            <p className="text-gray-600 text-lg">
              Beyond sales, we are committed to fostering trust, offering more
              than just products—we offer support and expertise. Connect with us
              on Instagram, Facebook, TikTok, and Lineapp, or visit our official
              website (link to follow) to learn more.
            </p>
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

export default AboutPage;
