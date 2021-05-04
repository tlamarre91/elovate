import type { NextApiRequest, NextApiResponse } from "next";
import { setAuthCookies } from "next-firebase-auth";
import Cookies from "cookies";

import "../../services";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await setAuthCookies(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
  return res.status(200).json({ status: true });
}
