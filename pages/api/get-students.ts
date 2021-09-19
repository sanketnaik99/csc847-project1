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
  keyFilename: "./keys.json",
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<StudentResponse>
) => {
  try {
    const ref = await db.collection("Students").get();
    let studentDocs: Student[] = [];
    await ref.docs.forEach((doc) => {
      studentDocs.push(doc.data() as Student);
    });
    return res.status(200).send({
      students: studentDocs,
      status: "SUCCESS",
      message: "Successfully retrieved student data.",
    });
  } catch (error) {
    return res.status(500).send({
      students: [],
      status: "ERROR",
      message:
        "There was an error while retrieving student data. Please try again.",
    });
  }
};

export default handler;
