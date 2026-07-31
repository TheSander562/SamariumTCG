import { getAuth } from "@/lib/auth";

export const GET = async (req: Request) => {
  return getAuth().handler(req);
};

export const POST = async (req: Request) => {
  return getAuth().handler(req);
};
