export class User {

  uid: string;
  nick: string;
  description?: string;
  image?: string;
  isModerator?: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  //reports?: Report[] = []; // Initialize array
}
