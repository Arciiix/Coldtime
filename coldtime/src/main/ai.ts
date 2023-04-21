import { IDeviceStateRaw } from "./deviceState";

import * as tf from "@tensorflow/tfjs";
import { prisma } from ".";

export async function predictNewData(
  deviceId: string,
  epochs: number = 100,
  pointsToGenerate: number = 5
): Promise<IDeviceStateRaw[]> {
  // Get device data from lifetime
  let historicalData = await prisma.data.findMany({
    where: {
      deviceId,
      isConnected: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  historicalData = historicalData.filter(
    (e) => e.temperature !== null && !isNaN(e.temperature)
  );

  // Prepare data

  // Input - [minutesAfterMidnight, temperature]
  // temperature and isRunning here comes from the previous data (so that the predicted data is not that random)
  let input: number[][] = [];

  // Output - [temperature]
  let output: number[][] = [];

  // Since we also need the next temperature, we go from the first element to the last but one (length - 2)
  for (let i = 0; i < historicalData.length - 2; i++) {
    const entry = historicalData[i];

    const inputRow = [
      //   new Date(entry.date).getHours(),
      //   new Date(entry.date).getMinutes(),
      entry.date.getHours() * 60 + entry.date.getMinutes(),
      entry.temperature!,
    ];
    const outputRow = [historicalData[i + 1].temperature!];
    input.push(inputRow);
    output.push(outputRow);
  }

  // Normalize input and output data
  const inputTensor = tf.tensor2d(input).div(tf.scalar(10));
  const outputTensor = tf.tensor2d(output).div(tf.scalar(10));

  // Define model architecture
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, activation: "relu", inputShape: [2] })
  );
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  // Train the model
  await model.fit(inputTensor, outputTensor, { epochs });

  // Use model to predict next 5 points
  const lastData = historicalData[historicalData.length - 1];
  const inputRow = [
    lastData.date.getHours() * 60 + lastData.date.getMinutes() + 5,
    lastData.temperature!,
  ];
  let predictions: IDeviceStateRaw[] = [];
  for (let i = 0; i < pointsToGenerate; i++) {
    const inputTensor = tf.tensor2d([inputRow]).div(tf.scalar(10));
    const predictionTensor = model.predict(inputTensor);

    // @ts-ignore
    const prediction = predictionTensor.dataSync()[0] * 10;

    predictions.push({
      temperature: parseFloat(prediction.toFixed(2)), // change to 2 decimal places
      date: new Date(
        new Date(lastData.date).getTime() +
          1000 *
            60 *
            // inputRow is number of minutes after midnight; to create date, we have to subtract the initial number of minutes after midnight
            (inputRow[0] -
              (new Date(lastData.date).getHours() * 60 +
                new Date(lastData.date).getMinutes()))
      ),
    });
    inputRow[0] += 5; // 5 minutes
    inputRow[1] = prediction;
  }

  return predictions;
}
