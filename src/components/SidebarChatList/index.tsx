"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type TSidebarChatListProps = {
  friends: IUser[];
  sessionId: string;
};

const SidebarChatList: React.FC<TSidebarChatListProps> = ({
  friends,
  sessionId,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [unseenMessages, setUnseenMessages] = React.useState<IMessage[]>([]);

  React.useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessageCount = unseenMessages.filter(
          (unseenMessage) => unseenMessage.senderId === friend.id
        ).length;

        console.log({ id: friend.id });
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-700 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {unseenMessageCount > 0 && (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessageCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
