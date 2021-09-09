import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({
    message: "Testing Express app!",
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Successfully connected to port ${port}`);
  });
} catch (error) {
  console.log(error);
}
