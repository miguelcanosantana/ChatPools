export class Message {

  id?: string;
  userId: string;
  content: string;
  image?: string;
  time: Date;
  isDeleted: boolean;
  localChatNick?: string;
  localChatImage?: string;
}
