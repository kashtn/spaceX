import "antd/dist/antd.css";
import { Select } from "antd";
import React, { useContext } from "react";
import { Context } from "../../../context";

const { Option } = Select;

export function Filter(props) {
  const { setRocketFiltercontext, setSiteFilterContext } = useContext(Context);

  function onChange(chosenFilter) {
    if (!chosenFilter.startsWith("all")) {
      chosenFilter.startsWith("Rocket")
        ? setRocketFiltercontext(chosenFilter.split(" ").slice(1).join(" "))
        : setSiteFilterContext(chosenFilter.split(" ").slice(1).join(" "));
    }
    if (chosenFilter === "allRocket") {
      setRocketFiltercontext("");
    }
    if (chosenFilter === "allSite") {
      setSiteFilterContext("");
    }
  }

  return (
    <>
      <div className="filter">
        {props.launches && props.launches[0].startsWith("Rocket") ? (
          <h2>Rocket</h2>
        ) : (
          <h2>Launch Site</h2>
        )}
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a filter"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          Name
          {props.launches && props.launches[0].startsWith("Rocket") ? (
            <Option key="allRocket">All</Option>
          ) : (
            <Option key="allSite">All</Option>
          )}
          {props.launches &&
            props.launches.map((name) => <Option key={name}>{name}</Option>)}
        </Select>
      </div>
    </>
  );
}
