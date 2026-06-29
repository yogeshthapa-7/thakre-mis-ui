import axios from "axios";
import { useState, useEffect } from "react";
import { type ChartComponentProps, ChartComponent } from "./dashboard-element";
import type{ DashboardItem } from "../../types/dashboard";
import { BASE_URL, BEARER_TOKEN } from "../../../config";

const ChartComponentRenderer = (item: DashboardItem) => {
  const [data, setData] = useState<ChartComponentProps>();

  useEffect(() => {
    getData();
    async function getData() {
      const props = item.DefaultProps ? JSON.parse(item.DefaultProps) : null;

      const response = await axios.post(
        `${BASE_URL}/GetDashboardElementDetails`,
        {
          ElementKey: item.ElementKey,
          DashboardId: item.DashboardId,
          Properties: props?.apiProps,
        },
        {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.status == 200) {
        const data = response.data;
        if (data.Success) {
          const { Series: seriesDefinition, ...metadata } = data.Data.MetaData;
          const newData = {
            chartMetadata: {
              chartType: item.ChartType,
              title: item.Title,
              seriesDefinition: JSON.parse(seriesDefinition),
              ...metadata,
            },
            chartData: data.Data.Data,
          };
          if (item.ElementKey == "WardPopulation")
            console.log("newData", newData);
          setData(newData);
        }
      }
    }
  }, [item]);

  return <>{data && <ChartComponent {...data} />}</>;
};

export default ChartComponentRenderer;
