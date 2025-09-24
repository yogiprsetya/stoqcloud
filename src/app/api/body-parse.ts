import { NextRequest } from 'next/server';

export const bodyParse = async (req: NextRequest) => {
  const body = await new Response(req.body).json();
  return body;
};
