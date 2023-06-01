interface IUser {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface IChat {
  id: string;
  messages: IMessage[];
}

interface IFriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
