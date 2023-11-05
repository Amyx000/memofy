"use client";

import useDarkMode from "@/hooks/useDarkMode";
import React from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import CustomModal from "../common/CustomModal";
import Notes from "./Notes";

function Home() {
  const [theme, setTheme] = useDarkMode();
  return (
    <>
      <div className="flex-1 gap-[20px] relative flex flex-col">
        <div className="absolute top-0 right-0 text-2xl text-dark dark:text-light">
          <div className="p-[10px] rounded-full shadow-lg dark:shadow-inner dark:shadow-[#303030] duration-300 ease-in flex items-center justify-center">
            <button
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            >
              <BsFillMoonStarsFill />
            </button>
          </div>
        </div>
        <div className="font-bold text-5xl text-center h-max flex justify-center select-none">
          Memofy
        </div>
        <Notes />
      </div>
    </>
  );
}

export default Home;
