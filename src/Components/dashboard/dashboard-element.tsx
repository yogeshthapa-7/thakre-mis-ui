import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Load the exporting module.
// import Exporting from "highcharts/modules/exporting";
// import Data from "highcharts/modules/data";
// // Initialize exporting module.
// Exporting(Highcharts);
// Data(Highcharts);


import type { AnyType } from "../../types/any-type";
import { Col, Card } from "antd";
export type ChartMetadata = {
  title: string;
  subtitle?: string;
  description?: string;
  chartType: string;
  seriesDefinition: SeriesDefinition[];
  stacking?: true;
  height?: number;
  polar?: true;
  widthSpan?: number;
};

export type SeriesDefinition = {
  order?: number;
  seriesColumn: string;
  label: string;
  title?: string;
  axis: "x" | "y";
  type: string;
};

export type ChartComponentProps = {
  chartMetadata: ChartMetadata;
  chartData: AnyType;
};

export const ChartComponent = ({
  chartMetadata: metadata,
  chartData,
}: ChartComponentProps) => {
  //Metadata not found for chart
  if (!metadata) {
    console.log("Metadata not found for chart");
    return <></>;
  }

  const seriesDefinition = metadata.seriesDefinition;

  const prepareDataSeries = (
    seriesDefinition: SeriesDefinition[],
    chartType: string
  ) => {
    //if series count is less than 2, return empty object;
    if (seriesDefinition.length < 2) {
      console.log("multiple series required for dashboard element");
      return {};
    }

    if (chartType.toLowerCase() === "pie") {
      return {
        series: [
          {
            name: seriesDefinition[1].label,
            type: "pie",
            yAxis: 1,
            // tooltip: {
            //   valueSuffix: ' Rs'
            // },
            data: chartData.map((item: AnyType) => {
              return {
                name: item[seriesDefinition[0].seriesColumn],
                y: item[seriesDefinition[1].seriesColumn],
              };
            }), // Data passed dynamically
          },
        ],
      };
    }

    //if chart type is other than pie
    const series: Highcharts.Options = {};
    const xSeries = seriesDefinition.filter((x) => x.axis === "x");
    if (xSeries && seriesDefinition.length === 1) {
      const x = xSeries[0];
      series.xAxis = {
        categories: chartData.map((item: AnyType) => item[x.seriesColumn]), // X-axis categories for labeling
        title: {
          text: x.title, // X-axis title
        },
        crosshair: true,

        tickmarkPlacement: "on",
        lineWidth: 0,
      };
    } else if (xSeries && seriesDefinition.length > 1) {
      series.xAxis = xSeries.map((x, index) => {
        return {
          categories: chartData.map((item: AnyType) => item[x.seriesColumn]), // X-axis categories for labeling
          opposite: index !== 0,
          reversed: index !== 0,
          linkedTo: index > 0 ? 0 : null,
          //For showing all labels
          //   labels: {
          //     step: 1,
          //   },
          title: {
            text: x.title, // X-axis title
          },
          labels: {
            enabled: true, // Ensure labels are enabled
            staggerLines: 1,
          },
          crosshair: true,
        } as Highcharts.XAxisOptions;
      });
    }
    if (metadata.stacking) {
      series.plotOptions = {
        series: {
          stacking: "normal",
        },
      };
    }
    const ySeries = seriesDefinition.filter((x) => x.axis === "y");
    series.series = ySeries.map((x) => {
      return {
        name: x.label,
        type: x.type,
        pointWidth: 25,
        yAxis: x.order,
        // tooltip: {
        //   valueSuffix: ' Rs'
        // },
        data: chartData.map((item: AnyType) => item[x.seriesColumn]), // Data passed dynamically
      } as Highcharts.SeriesOptionsType;
    });

    if (ySeries && ySeries.length > 1) {
      series.yAxis = ySeries.map((x, index) => {
        return {
          //   gridLineInterpolation: "polygon",
          //   lineWidth: 0,
          //   min: 0,
          // Secondary yAxis
          title: {
            text: x.title,
            style: {
              color: Highcharts.getOptions()?.colors?.[index],
            },
          },
          labels: {
            // format: '{value} mm',
            style: {
              color: Highcharts.getOptions()?.colors?.[index],
            },
          },
          opposite: index > 0,
        } as Highcharts.YAxisOptions;
      });
    } else {
      const x = ySeries[0],
        index = 0;

      series.yAxis = {
        // Secondary yAxis
        title: {
          text: x.title,
          style: {
            color: Highcharts.getOptions()?.colors?.[index],
          },
        },
        labels: {
          // format: '{value} mm',
          style: {
            color: Highcharts.getOptions()?.colors?.[index],
          },
        },
        opposite: index > 0,
      } as Highcharts.YAxisOptions;
    }

    return series;
  };

  const options = {
    chart: {
      polar: metadata.polar,
      type: metadata.chartType, // Dynamic chart type
      height: metadata.height || 300,
      zooming: {
        type: "xy",
      },
    },
    exporting: {
      enabled: true,
      showTable: true,
      // buttons: {
      //   contextButton: {
      //     menuItems: [
      //       "loadData", // This enables the view data option
      //       "viewData", // This enables the view data option
      //       "downloadPNG",
      //       "downloadJPEG",
      //       "downloadPDF",
      //       "downloadSVG",
      //     ],
      //   },
      // },
    } as Highcharts.ExportingOptions,
    title: {
      text: metadata.title,
      //   align: "left",
      style: {
        fontFamily: "Roboto, serif", // Change the font family
        fontSize: "1.2rem", // Change the font size
        fontWeight: "400", // Change the font weight
        color: "#333333", // Change the font color
      },
    },
    subtitle: {
      text: metadata.subtitle,
      align: "left",
    },
    credits: {
      text: "Source: Survey", //TODO: dynamic
    },
    tooltip: {
      shared: true,
      // valueSuffix: ' Rs'
    },
    ...prepareDataSeries(seriesDefinition, metadata.chartType),
  };

  return (
    <Col span={metadata.widthSpan || 10} xs={24} sm={metadata.widthSpan || 10}>
      <Card>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...options,
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500,
                    minWidth: 0,
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    xAxis: {
                      labels: {
                        rotation: -45,
                        style: {
                          fontSize: "0.6rem",
                        },
                        // formatter: function (data: AnyType) {
                        //   return data.value.charAt(data.value.length - 1);
                        // },
                      },
                    },
                    yAxis: {
                      labels: {
                        // align: "left",
                        // x: 0,
                        // y: -2,
                      },
                      title: {
                        text: "",
                      },
                    },
                    series: options.series?.map((x: AnyType) => {
                      return {
                        ...x,
                        pointWidth: 10,
                      };
                    }),
                  },
                },
              ],
            },
          }}
        />
        {metadata.description && (
          <div style={{ marginTop: "16px", fontSize: "14px", color: "#666", textAlign: "center" }}>
            {metadata.description}
          </div>
        )}
      </Card>
    </Col>
  );
};
