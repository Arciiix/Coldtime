import { CHART_GRAY, CHART_GREEN, CHART_RED } from "@renderer/theme";
import { IDeviceState } from "@renderer/types/device";
import { formatDateToTimestamp } from "@renderer/utils/formatDate";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

interface IChartComponentProps {
  data: IDeviceState[];
  // numberOfDataPointsStripped: number;
  // dateFrom: number | null;
  // dateTo: number | null;
}

export default function ChartComponent({
  data,
}: // numberOfDataPointsStripped,
// dateFrom,
// dateTo,
IChartComponentProps) {
  // const settings = useRecoilValue(settingsState);
  const { t } = useTranslation();
  // const transformedData = useMemo(() => {
  //   if (!data.length) return;
  //   // We need date ascending
  //   let newData = data.sort((a, b) => a.date.getTime() - b.date.getTime());

  //   let result: ApexAxisChartSeries = [];

  //   let currentState: string | null = null;
  //   let currentColor: string = "#808080"; // Gray
  //   let currentFromDate: Date | null = null;

  //   for (const item of newData) {
  //     let name;
  //     let color;
  //     if (item.data && item.data.isRunning) {
  //       name = t("chart.chartGreen");
  //       color = CHART_GREEN; // Green
  //     } else if (item.data && item.data.isRunning === false) {
  //       name = t("chart.chartRed");
  //       color = CHART_RED; // Red
  //     } else {
  //       name = t("chart.chartGray");
  //       color = CHART_GRAY; // Gray
  //     }

  //     if (name !== currentState) {
  //       if (currentState !== null) {
  //         result.push({
  //           name: currentState,
  //           color: currentColor,
  //           data: data
  //             .filter(
  //               (e) =>
  //                 e.date.getTime() >= currentFromDate!.getTime() &&
  //                 e.date.getTime() <= new Date(item.date).getTime()
  //             )
  //             .map((e) => ({
  //               x: new Date(e.date).getTime(),
  //               y: e.data?.temperature ?? null,
  //             })),
  //         });
  //       }

  //       currentState = name;
  //       currentColor = color;
  //       currentFromDate = new Date(item.date);
  //     }
  //   }

  //   if (currentState !== null) {
  //     result.push({
  //       name: currentState,
  //       color: currentColor,
  //       data: data
  //         .filter(
  //           (e) =>
  //             e.date.getTime() >= currentFromDate!.getTime() &&
  //             e.date.getTime() <=
  //               new Date(newData[newData.length - 1].date).getTime()
  //         )
  //         .map((e) => ({
  //           x: new Date(e.date).getTime(),
  //           y: e.data?.temperature ?? null,
  //         })),
  //     });
  //   }

  //   // Fill the points in between as null to show the empty gaps on chart
  //   const maxThreshold = (settings?.saveInterval.value || 60) * 1000 + 15000;

  //   result = fillDataGaps(
  //     result as { name?: string; data: { x: Date; y: number | null }[] }[],
  //     maxThreshold,
  //     numberOfDataPointsStripped,
  //     dateFrom,
  //     dateTo
  //   );

  //   return {
  //     data: result,
  //     options: {
  //       chart: {
  //         type: "line",
  //         zoom: {
  //           enabled: true,
  //         },
  //         animations: {
  //           enabled: false,
  //         },
  //         toolbar: {
  //           tools: {
  //             download: false,
  //           },
  //         },
  //       },
  //       fill: {
  //         colors: result.map((e) => e.color),
  //       },
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       stroke: {
  //         curve: "smooth",
  //       },
  //       xaxis: {
  //         type: "datetime",
  //         labels: {
  //           formatter: (_: string, timestamp: number) => {
  //             return formatDateToTimestamp(new Date(timestamp));
  //           },
  //         },
  //       },
  //       legend: {
  //         show: false,
  //       },
  //       theme: {
  //         mode: "dark",
  //       },
  //     } satisfies ApexOptions,
  //   };
  // }, [data]);

  const transformedData = useMemo(() => {
    if (!data.length) return;
    // We need date ascending
    let newData = data.sort((a, b) => a.date.getTime() - b.date.getTime());

    let result: XAxisAnnotations[] = [];

    let currentState: string | null = null;
    let currentColor: string = "#808080"; // Gray
    let currentFromDate: Date | null = null;

    for (const item of newData) {
      let name;
      let color;
      if (item.data && item.data.isRunning) {
        name = t("chart.chartGreen");
        color = CHART_GREEN; // Green
      } else if (item.data && item.data.isRunning === false) {
        name = t("chart.chartRed");
        color = CHART_RED; // Red
      } else {
        name = t("chart.chartGray");
        color = CHART_GRAY; // Gray
      }

      if (name !== currentState) {
        if (currentState !== null) {
          result.push({
            x: currentFromDate!.getTime(),
            x2: new Date(item.date).getTime(),
            fillColor: currentColor,
            opacity: 0.1,
            label: {
              style: {
                fontSize: "15px",
                color: "#ffffff",
                background: currentColor,
              },
              offsetY: -10,
              text: currentState,
            },
          });
        }

        currentState = name;
        currentColor = color;
        currentFromDate = new Date(item.date);
      }
    }

    if (currentState !== null) {
      result.push({
        x: currentFromDate!.getTime(),
        x2: new Date(newData[newData.length - 1].date).getTime(),
        fillColor: currentColor,
        opacity: 0.1,
        label: {
          style: {
            fontSize: "15px",
            color: "#ffffff",
            background: currentColor,
          },
          offsetY: -10,
          text: currentState,
        },
      });
    }

    // // Fill the points in between as null to show the empty gaps on chart
    // const maxThreshold = (settings?.saveInterval.value || 60) * 1000 + 15000;

    // result = fillDataGaps(
    //   result as { name?: string; data: { x: Date; y: number | null }[] }[],
    //   maxThreshold,
    //   numberOfDataPointsStripped,
    //   dateFrom,
    //   dateTo
    // );

    const grayAreas = result.filter(
      (e) => e.label!.text === t("chart.chartGray")
    );

    let parsedData: { x: number; y: number | null }[] = newData.map((e) => ({
      x: e.date.getTime(),
      y: e.data?.temperature ?? null,
    }));

    grayAreas.forEach((e) => {
      const dateFrom = e.x!;
      const dateTo = e.x2!;

      parsedData = parsedData.filter(
        (e) =>
          !(
            new Date(e.x).getTime() > dateFrom &&
            new Date(e.x).getTime() < dateTo
          )
      );

      parsedData.push({
        x: new Date(dateFrom).getTime(),
        y: null,
      });
    });

    console.log(parsedData);

    return {
      data: [
        {
          name: "data",
          data: parsedData,
        },
      ],

      options: {
        chart: {
          type: "line",
          zoom: {
            enabled: true,
          },
          animations: {
            enabled: false,
          },
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        annotations: {
          xaxis: result,
        },
        fill: {
          // colors: result.map((e) => e.color),
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          labels: {
            formatter: (_: string, timestamp: number) => {
              return formatDateToTimestamp(new Date(timestamp));
            },
          },
        },
        legend: {
          show: false,
        },
        theme: {
          mode: "dark",
        },
      } satisfies ApexOptions,
    };
  }, [data]);

  if (!data.length) return <></>;
  return (
    <div>
      <Chart
        // @ts-ignore
        options={transformedData!.options}
        series={transformedData!.data}
        type="line"
        height={600}
        width={"100%"}
      />
    </div>
  );
}
