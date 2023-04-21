import { Flex } from "@chakra-ui/react";
import { CHART_GRAY, CHART_GREEN, CHART_RED } from "@renderer/theme";
import { AIReturnType, IDeviceState } from "@renderer/types/device";
import { formatDateToTimestamp } from "@renderer/utils/formatDate";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

interface IChartComponentProps {
  data: IDeviceState[];
  aiData?: AIReturnType | null;
}

export default function ChartComponent({ data, aiData }: IChartComponentProps) {
  const { t } = useTranslation();

  const transformedData = useMemo(() => {
    if (!data.length && !aiData) return;

    if (aiData) {
      if (!aiData.lastPoints.length && !aiData.predictions.length) return;

      const sortedData = [...aiData.lastPoints]
        .filter((e) => e.data)
        .map((e) => ({
          date: new Date(e.date),
          temperature: e.data!.temperature,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      const parsedData = [...sortedData, ...aiData.predictions];

      return {
        data: [
          {
            name: t("device.status.temperature"),
            data: parsedData
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((e) => ({
                x: new Date(e.date).getTime(),
                y: e.temperature,
              })),
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
            xaxis: [
              {
                x: [...sortedData].reverse()[0].date.getTime(),
                borderColor: "#ffffff",
                label: {
                  style: {
                    color: "#000000",
                  },
                  text: t("device.ai.startOfAi").toString(),
                },
              },
            ],
          },
          fill: {},
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
    } else {
      // We need date ascending
      let newData = data.sort((a, b) => a.date.getTime() - b.date.getTime());

      let result: XAxisAnnotations[] = [];

      let currentState: string | null = null;
      let currentColor: string = "#808080"; // Gray
      let currentFromDate: Date | null = null;

      for (const [index, item] of newData.entries()) {
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
              x2:
                index < 2
                  ? new Date(item.date).getTime()
                  : new Date(newData[index - 1].date).getTime(),
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
          // currentFromDate = new Date(item.date);
          currentFromDate =
            index < 2 ? new Date(item.date) : new Date(newData[index - 1].date);
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

      return {
        data: [
          {
            name: t("device.status.temperature"),
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
    }
  }, [data, aiData]);

  if (
    (!aiData && !data.length) ||
    (aiData && !aiData.lastPoints.length && !aiData.predictions.length)
  )
    return <></>;

  return (
    <Flex justifyContent={"center"} w={"100%"} marginX={"auto"}>
      <Chart
        // @ts-ignore
        options={transformedData!.options}
        series={transformedData!.data}
        type="line"
        height={600}
        width={"100%"}
        style={{
          flex: 1,
          flexShrink: 1,
        }}
      />
    </Flex>
  );
}
