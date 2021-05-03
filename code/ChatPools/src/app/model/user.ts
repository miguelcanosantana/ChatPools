/**
 * The User
 * @property {string} uid : The object id in FireBase and user's id
 * @property {string} nick : The user's nickname
 * @property {string} description? : User's profile description
 * @property {string} image? : User's url image
 * @property {boolean} isModerator? : Can the user moderate?
 * @property {boolean} isAdmin? : Moderate + Can access web panel?
 * @property {boolean} isBanned? : Cannot acess account
 * @property {Report[]} reports? : Array of reports to the user
 */

import { Report } from "./report";


export class User {

    uid: string;
    nick: string;
    description?: string;
    image?: string;
    isModerator?: boolean;
    isAdmin?: boolean;
    isBanned?: boolean;
    reports?: Report[] = []; // Initialize array

}
