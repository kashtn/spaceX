import React, { useState, useContext } from "react";
import { Context } from "../../../context";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

export function SortButton({ allLaunches }) {
  const [sortVal, setSortVal] = useState("down");
  const { setDataRenderContext } = useContext(Context);

  //сортировка
  function sortHandler() {
    //по убыванию
    if (sortVal === "down") {
      setSortVal("up");
      allLaunches.sort((firstLaunch, secondLaunch) => {
        return (
          new Date(secondLaunch.launch_date_local) -
          new Date(firstLaunch.launch_date_local)
        );
      });
    }
    //==
    //по возрастанию
    if (sortVal === "up") {
      setSortVal("down");
      allLaunches.sort((firstLaunch, secondLaunch) => {
        return (
          new Date(firstLaunch.launch_date_local) -
          new Date(secondLaunch.launch_date_local)
        );
      });
    }
    //==
    setDataRenderContext(allLaunches);
  }
  //==

  return (
    <>
      <button
        className="sortButton"
        onClick={() => {
          sortHandler();
        }}
      >
        Sort by Date{" "}
        {sortVal === "down" ? <CaretDownOutlined /> : <CaretUpOutlined />}
      </button>
    </>
  );
}
