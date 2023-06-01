import { QueryDB } from "@/enum";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = (await RESTResponse.json()) as { result: string | null };
    const idToAdd = data.result;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    const isAlreadyAdded = await fetchRedis(
      "sismember",
      `${QueryDB.USER}:${idToAdd}:${QueryDB.INCOMING_FRIEND_REQUEST}`,
      session.user.id
    );

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `${QueryDB.USER}:${session.user.id}:${QueryDB.FRIENDS}`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("You are already become a friend with this user", {
        status: 400,
      });
    }

    await db.sadd(
      `${QueryDB.USER}:${idToAdd}:${QueryDB.INCOMING_FRIEND_REQUEST}`,
      session.user.id
    );
    return new Response("Successfully added this user", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("invalid request", { status: 400 });
  }
};
