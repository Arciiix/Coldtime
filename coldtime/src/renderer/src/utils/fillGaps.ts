export default function fillDataGaps(
  result: {
    name?: string;
    color?: string;
    data: { x: Date; y: number | null }[];
  }[],
  time: number,
  numberOfDataPointsStripped: number,
  dateFrom: number | null,
  dateTo: number | null
): { name?: string; color?: string; data: { x: Date; y: number | null }[] }[] {
  // TODO: Better maths 😅
  // If some data points were stripped, adjust the max time accordingly
  //   time = time + time * numberOfDataPointsStripped;

  // (timeDifference / 1000) - range in seconds
  // timeDifference / time - number of points in the range; but better - dataLength + strippedPoints
  // points / stripped - every nth point is removed
  // timeIntervalAfterRemoval = timeDifference / (ceil(points / (n-1)) - 1)
  if (numberOfDataPointsStripped) {
    const timeDifference =
      (dateTo ?? new Date().getTime()) -
      (dateFrom ?? new Date(result[0].data[0].x).getTime());

    const noPoints =
      result.reduce((prev, curr) => prev + curr.data.length, 0) +
      numberOfDataPointsStripped;
    const numMeasurementsAfterRemoval = noPoints - numberOfDataPointsStripped;
    const nthPointRemoved = noPoints / numberOfDataPointsStripped;

    let newTime =
      time * ((noPoints - 1) / (numMeasurementsAfterRemoval - 1) + 2);

    /* 
    numRemovedMeasurements = Math.floor((numMeasurements - 1) / n);
    numMeasurementsAfterRemoval = numMeasurements - numRemovedMeasurements;
    timeAfterRemoval = time * (numMeasurements - 1) / (numMeasurementsAfterRemoval - 1);
*/

    console.log(
      `fixed time of diff: ${timeDifference}; noPoints: ${noPoints}; stripped: ${numberOfDataPointsStripped}, time: ${time}, nthPointRemoved: ${nthPointRemoved}, numMeasurementsAfterRemoval: ${numMeasurementsAfterRemoval}
      
      =
      
      ${newTime}`
    );
    time = newTime;
  } else {
    console.log("no data points stripped");
  }

  const filledResult: {
    name?: string;
    color?: string;
    data: { x: Date; y: number | null }[];
  }[] = [];

  for (const item of result) {
    const filledData: { x: Date; y: number | null }[] = [];

    if (item.data.length === 0) {
      filledResult.push({ name: item.name, color: item.color, data: [] });
      continue;
    }

    filledData.push({ x: item.data[0].x, y: item.data[0].y });

    for (let i = 1; i < item.data.length; i++) {
      const prevDate = new Date(item.data[i - 1].x);
      const currentDate = new Date(item.data[i].x);
      const timeDiff = currentDate.getTime() - prevDate.getTime();

      if (timeDiff > time) {
        const fillDate = new Date(prevDate.getTime() + time);
        filledData.push({ x: fillDate, y: null });
      }

      filledData.push({ x: currentDate, y: item.data[i].y });
    }

    filledResult.push({ name: item.name, color: item.color, data: filledData });
  }

  return filledResult;
}
