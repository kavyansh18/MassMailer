import React from "react";
import Meteors from "./UI/Meteors.jsx";
import logo from "../src/assets/logo.png";
import bmc from "../src/assets/bmc.png";
import ig from "../src/assets/ig.svg";
import github from "../src/assets/github.svg";
import twitter from "../src/assets/twitter.svg";
import { NavLink } from "react-router-dom";

export function Homepg() {
  return (
    <div className="h-screen w-full flex flex-col justify-start items-center mt-[40px]">
      <div className="rounded-full border flex items-center justify-center mb-5 border-gray-500">
        <img className="w-[120px]" src={logo} alt="" />
      </div>
      <div className=" w-full relative lg:mx-[250px]">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start lg:mx-[180px] mx-[50px]">
          <h1 className="font-bold lg:text-[40px] text-[23px] bg-gradient-to-r from-slate-300 to-slate-500 text-transparent bg-clip-text mb-2 relative z-50 ">
            Welcome to MassMailer
          </h1>

          <h5 className="font-bold lg:text-[24px] text-[14px] text-blue-400 text-center bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text mb-2 relative z-50">
            Reach Your Audience with One Click
          </h5>

          <p className="font-normal text-base text-slate-500 relative z-50">
            The ultimate solution for all your email marketing needs. Our
            massmailer allows you to send personalized emails to multiple
            recipients in just a few clicks, making it the perfect tool for
            businesses, marketers, and information spreaders.
          </p>

          <NavLink
            to="/form"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-2"
            activeClassName="active-link-class" // Add this if you want to apply active styles
            type="button"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 text-m font-medium text-white backdrop-blur-3xl">
              Start
            </span>
          </NavLink>

          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        <a
          className="lg:w-12 lg:mt-12 w-12 mt-10"
          href="https://instagram.com/kavyansh.in"
          target="_blank"
        >
          <img src={ig} alt="" />
        </a>

        <a
          className="lg:w-24 lg:mt-12 w-20 mt-10"
          href="https://buymeacoffee.com/kavyansh"
          target="_blank"
        >
          <img src={bmc} alt="" />
        </a>

        <a
          className="lg:w-7 lg:mt-12 w-7 mt-10"
          href="https://github.com/kavyansh18"
          target="_blank"
        >
          <img src={github} alt="" />
        </a>

        <a
          className="lg:w-7 lg:mt-12 w-7 mt-10"
          href="https://x.com/the_kavyansh"
          target="_blank"
        >
          <img src={twitter} alt="" />
        </a>
      </div>
    </div>
  );
}
