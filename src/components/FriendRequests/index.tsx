"use client";

import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

type TFriendRequestProps = {
  incomingFriendRequests: IIncomeningFriendRequest[];
  sessionId: string;
};

const FriendRequests: React.FC<TFriendRequestProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();

  const [friendRequest, setFriendRequest] = React.useState<
    IIncomeningFriendRequest[]
  >(incomingFriendRequests);

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/accept", { id: senderId });

      setFriendRequest((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/reject", { id: senderId });

      setFriendRequest((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {friendRequest.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here ...</p>
      ) : (
        friendRequest.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              onClick={() => acceptFriend(request.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button
              onClick={() => rejectFriend(request.senderId)}
              aria-label="reject friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
