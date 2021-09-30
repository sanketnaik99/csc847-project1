// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DocumentData, Firestore } from "@google-cloud/firestore";
import { Student } from "./types";

type StandardResponse = {
  status: string;
  message: string;
};

const db = new Firestore({
  projectId: "csc-8-326008",
  // keyFilename: "./keys.json",
  credentials: {
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
  },
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse>
) => {
  console.log(req.body);
  try {
    const docRef = await db.collection("Students").doc();
    const dataRef = await docRef.set({
      ...(req.body as Student),
      docID: docRef.id,
    });
    if (docRef.id) {
      return res.status(200).send({
        status: "SUCCESS",
        message: "Student added to database successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "ERROR",
      message:
        "There was an error while adding the student to the database. Please try again!",
    });
  }
};

export default handler;
