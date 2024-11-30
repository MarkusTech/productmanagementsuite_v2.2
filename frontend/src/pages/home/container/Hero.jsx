import React from "react";
import { images } from "../../../constants";

const Hero = () => {
  return (
    <section className="container mx-auto flex flex-col px-5 py-5 lg:flex-row">
      <div className="mt-10 lg:w-1/2">
        <h1 className="text-3xl text-center font-bold text-dark-soft md:text-5xl lg:text-4xl xl:text-5xl lg:text-left lg:max-w-[540px]">
          Kiehana Jewelry Supplies
        </h1>
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left">
          Crafting Beauty Since 2023: From live selling to a global online
          presence, we specialize in made-to-order and pre-order jewelry
          designs. With expert craftsmanship and a commitment to quality, every
          piece is meticulously inspected to meet new-generation standards.
        </p>
        <p className="text-dark-light mt-4 text-center md:text-xl lg:text-base xl:text-xl lg:text-left">
          Powered by experience, passion, and the trust of our clients, we
          continue to evolve and excel. Join us on this journey, where elegance
          meets expertise.
        </p>
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <img
          className="w-full"
          src={images.Jewery}
          alt="Users are reading articles"
        />
      </div>
    </section>
  );
};

export default Hero;
