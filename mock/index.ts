import express, { Request, Response } from "express";

const PORT = 3823;

const app = express();

app.get("", (req: Request, res: Response) => {
  res.send("Hello world - the mock works!");
});

app.get("/v1/school/status", (req: Request, res: Response) => {
  console.log(`Got the data at ${new Date().toISOString()}`);
  // TODO: Make it dynamic
  res.send({
    IS_RUNNING: true,
    TEMPERATURE_MAIN: {
      value: 3039,
      error: false,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Mock has started listening on: ${PORT}`);
});
