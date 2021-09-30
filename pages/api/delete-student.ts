// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { DocumentData, Firestore } from "@google-cloud/firestore";
import { Student } from "./types";

type StandardResponse = {
  status: string;
  message: string;
};

type StudentResponse = StandardResponse & { students: Student[] };

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
  try {
    const ref = await db.collection("Students").doc(req.body.id).delete();
    return res.status(200).send({
      status: "SUCCESS",
      message: "Successfully deleted the student's record.",
    });
  } catch (error) {
    return res.status(500).send({
      status: "ERROR",
      message:
        "There was an error while deleting the student's record. Please try again.",
    });
  }
};

export default handler;
