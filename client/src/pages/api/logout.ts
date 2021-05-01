import type { NextApiRequest, NextApiResponse } from "next";
import { unsetAuthCookies } from "next-firebase-auth";

import { initialize } from "../../services";
initialize();

export default async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await unsetAuthCookies(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
  return res.status(200).json({ status: true });
}
