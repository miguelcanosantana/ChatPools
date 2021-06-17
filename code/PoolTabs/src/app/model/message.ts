export class Message {

  id?: string;
  userId: string;
  content: string;
  image?: string;
  time: number;
  isDeleted: boolean;
  localChatNick?: string;
  localChatImage?: string;
}
