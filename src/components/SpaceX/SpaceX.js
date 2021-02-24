import React, { useState, useEffect } from "react";
import "./SpaceX.scss";
import dateFormatter from "../dateFormatter.js";
import { Filter } from "./Filter/Filter";
import { SortButton } from "./SortButton/SortButton";
import { Context } from "../../context";
import { List } from "antd";

export default function SpaceX() {
  const [launches, setLaunches] = useState();
  const [dataRender, setDataRender] = useState("");

  const [rocketFilter, setRocketFilter] = useState();
  const [siteFilter, setSiteFilter] = useState();

  const [siteNames, setSiteNames] = useState();
  const [rocketNames, setRocketNames] = useState();

  const [sortedFlag, setSortedFlag] = useState(false);
  //загрузка запусков с апи
  useEffect(() => {
    async function getLaunches() {
      const response = await fetch("https://api.spacexdata.com/v3/launches");
      const result = await response.json();
      setLaunches(result);
    }
    getLaunches();
  }, []);
  //==
  //запись имен для селектов
  useEffect(() => {
    let namesArr = [];
    let rocketNames =
      launches &&
      launches.filter((launch) => {
        let searchResult = namesArr.find(
          (name) => name === launch.rocket.rocket_name
        );
        namesArr.push(launch.rocket.rocket_name);
        if (!searchResult) {
          return launch;
        }
      });
    setRocketNames(rocketNames);

    let sitesArr = [];
    let siteNames =
      launches &&
      launches.filter((launch) => {
        let searchResult = sitesArr.find(
          (site) => site === launch.launch_site.site_name_long
        );
        sitesArr.push(launch.launch_site.site_name_long);
        if (!searchResult) {
          return launch;
        }
      });
    setSiteNames(siteNames);
  }, [launches]);
  //==
  //контекст
  function setRocketFiltercontext(chosenFilter) {
    setRocketFilter(chosenFilter);
  }
  function setSiteFilterContext(chosenFilter) {
    setSiteFilter(chosenFilter);
  }
  function setDataRenderContext(sortedLaunches) {
    setDataRender(sortedLaunches); // отсортированный список запусков
    setSortedFlag((prev) => !prev); //почему без флага не перерендеривает
  }
  //==
  //фильтрация
  useEffect(() => {
    let dataToShow =
      (launches && rocketFilter) || siteFilter
        ? launches.filter((launch) => {
            if (rocketFilter && launch.rocket.rocket_name !== rocketFilter) {
              return false;
            }
            if (
              siteFilter &&
              launch.launch_site.site_name_long !== siteFilter
            ) {
              return false;
            }
            return true;
          })
        : launches;
    setDataRender(dataToShow);
  }, [launches, rocketFilter, siteFilter]);
  //==

  return (
    <>
      <Context.Provider
        value={{
          setRocketFiltercontext,
          setSiteFilterContext,
          setDataRenderContext
        }}
      >
        <div className="container">
          <h1>Launches</h1>
          {launches && dataRender ? ( //если загрузил и добавил для отрисовки
            <>
              <div className="filterContaier">
                <div className="filterButtons">
                  <Filter
                    launches={
                      launches &&
                      siteNames &&
                      siteNames.map(
                        (launch) => "Site: " + launch.launch_site.site_name_long
                      )
                    }
                  />
                  <Filter
                    launches={
                      launches &&
                      rocketNames &&
                      rocketNames.map(
                        (launch) => "Rocket: " + launch.rocket.rocket_name
                      )
                    }
                  />
                </div>
                <div className="sortButtonContainer">
                  <SortButton allLaunches={dataRender} />
                </div>
              </div>
              <List
                pagination={{
                  total: dataRender.length,
                  defaultPageSize: 50,
                  position: "both",
                  showSizeChanger: false,
                  size: "small",
                  total: dataRender.length,
                  showTotal: (total) => (
                    <p>Total launches: {dataRender.length}</p>
                  )
                }}
                dataSource={dataRender}
                renderItem={(launch, i) => (
                  <div key={i} className="launchContainer">
                    <div className="imgContainer">
                      <img
                        width="200"
                        height="200"
                        src={launch.links.mission_patch_small}
                        alt="Upcoming"
                      />
                    </div>
                    <div className="dataContainer">
                      <div className="topDataContainer">
                        <h3>{launch.mission_name}</h3>
                        <h4>{dateFormatter(launch.launch_date_local)}</h4>
                      </div>
                      <p>{launch.details || "Upcoming"}</p>
                    </div>
                  </div>
                )}
              />
            </>
          ) : (
            <h3>Loading...</h3>
          )}
        </div>
      </Context.Provider>
    </>
  );
}
