import { QueryDB } from "@/enum";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

type TChatProps = {
  params: {
    chatId: string;
  };
};

const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `${QueryDB.CHAT}:${chatId}:${QueryDB.MESSAGES}`,
      0,
      -1
    );

    const dbMessages = results.map(
      (message) => JSON.parse(message) as IMessage
    );

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    console.log(error);
    notFound();
  }
};

const Chat = async ({ params }: TChatProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(
    `${QueryDB.USER}:${chatPartnerId}`
  )) as IUser;
  const initialMessages = await getChatMessages(chatId);

  return <div>{params.chatId}</div>;
};

export default Chat;
