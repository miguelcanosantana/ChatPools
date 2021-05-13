  /**
   * Message inside a Pool
   * @property {string} id? : The object id in FireBase
   * @property {string} userId : The user who sends the message
   * @property {string} content : The content of the message
   * @property {string} image? : The image of the message
   * @property {Date} time : When was the message sent
   * @property {boolean} isDeleted : Has the message been deleted?
   */

  
export class Groupmessage {

    id?: string;
    userId: string;
    content: string;
    image?: string;
    time: Date;
    isDeleted: boolean;
}
