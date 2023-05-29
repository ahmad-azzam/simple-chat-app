import AddFriendButton from "@/components/AddFriendButton";
import React from "react";

const Add: React.FC = () => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a Friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default Add;
