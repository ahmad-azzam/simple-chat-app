import { QueryDB } from "@/enum";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: idToReject } = z.object({ id: z.string() }).parse(body);

    await db.srem(
      `${QueryDB.USER}:${session.user.id}:${QueryDB.INCOMING_FRIEND_REQUEST}`,
      idToReject
    );

    return new Response("Success to reject the friend request");
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
};
