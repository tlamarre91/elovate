import type { NextApiRequest, NextApiResponse } from "next";
import { setAuthCookies } from "next-firebase-auth";
import Cookies from "cookies";

import { initialize } from "../../services";
initialize();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(req.headers.authorization)) {
    return res.status(400).json({ error: "where's your hall pass" });
    // TODO
  }
  const token = req.headers.authorization;
  return res.status(200).json({ status: true });
}

