import { QueryDB } from "@/enum";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `${QueryDB.USER}:${session.user.id}:${QueryDB.FRIENDS}`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already Friends", { status: 400 });
    }

    const hasFriendRequests = await fetchRedis(
      "sismember",
      `${QueryDB.USER}:${session.user.id}:${QueryDB.INCOMING_FRIEND_REQUEST}`,
      idToAdd
    );

    if (!hasFriendRequests) {
      return new Response("No friend requests", { status: 400 });
    }

    await db.sadd(
      `${QueryDB.USER}:${session.user.id}:${QueryDB.FRIENDS}`,
      idToAdd
    );
    await db.sadd(
      `${QueryDB.USER}:${idToAdd}:${QueryDB.FRIENDS}`,
      session.user.id
    );

    // await db.srem(`${QueryDB.USER}:${idToAdd}:${QueryDB.OUTBOUND_FRIEND_REQUEST}`, session.user.id);
    await db.srem(
      `${QueryDB.USER}:${session.user.id}:${QueryDB.INCOMING_FRIEND_REQUEST}`,
      idToAdd
    );

    return new Response("Success add friend");
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
};
