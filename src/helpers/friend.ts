import { QueryDB } from "@/enum";
import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  try {
    const friendIds = (await fetchRedis(
      "smembers",
      `${QueryDB.USER}:${userId}:${QueryDB.FRIENDS}`
    )) as string[];

    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const friend = (await fetchRedis(
          "get",
          `${QueryDB.USER}:${friendId}`
        )) as string;

        return JSON.parse(friend) as IUser;
      })
    );

    return friends;
  } catch (error) {
    console.log(error);
    return [];
  }
};
