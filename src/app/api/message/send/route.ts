import { QueryDB } from "@/enum";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageValidator, TMessage } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export const POST = async (req: Request) => {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response("Unauthorized", { status: 401 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `${QueryDB.USER}:${session.user.id}:${QueryDB.FRIENDS}`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) new Response("Unauthorized", { status: 401 });

    const rawSender = (await fetchRedis(
      "get",
      `${QueryDB.USER}:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender);

    const timestamp = Date.now();
    const messageData: TMessage = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageData);

    await db.zadd(`${QueryDB.CHAT}:${chatId}:${QueryDB.MESSAGES}`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("Success send message");
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });

    return new Response("Internal server error", { status: 500 });
  }
};
