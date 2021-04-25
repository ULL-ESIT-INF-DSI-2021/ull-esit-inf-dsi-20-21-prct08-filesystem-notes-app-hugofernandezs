import chalk from 'chalk';
import {Color, Note} from './Note';


/**
 * Implements a user file.
 * @var fs_ Node.js file system.
 * @var instance_ Single instance of the FileManager.
 * @var folderPath_ Path to the notes folder.
 */
export class FileManager {
  private fs_ = require('fs');
  private static instance_: FileManager;
  private readonly folderPath_: string;


  /**
   * Constructor.
   * Checks if the data folder exists. If not, it creates a new one.
   */
  public constructor() {
    this.folderPath_ = "./data";
    if (!this.fs_.existsSync(this.folderPath_)) {
      this.fs_.mkdirSync(this.folderPath_, {recursive: true});
    }
  }


  /**
   * Returns the single instance of the FileManager.
   * @returns The single instance of the FileManager.
   */
  public static get instance(): FileManager {
    if (!this.instance_) {
      this.instance_ = new FileManager();
    }
    return this.instance_;
  }

  /**
   * Checks if the user allready has a file.
   * @param user User to look for.
   * @returns True if the file is found. False if not.
   */
  public existsUserFile(user: string): boolean {
    if (this.fs_.existsSync(`${this.folderPath_}/${user}.json`)) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Returns all the notes from the user.
   * @param user User to find the notes.
   * @returns A list with all the notes.
   */
  public getUserNotes(user: string): Note[] | undefined {
    if (!this.existsUserFile(user)) {
      return undefined;
    } else {
      const data: any = JSON.parse(this.fs_.readFileSync(
          `${this.folderPath_}/${user}.json`));
      return data.notes;
    }
  }


  /**
   * Returns all the note titles of an user.
   * @param user User to find the notes titles.
   * @returns A list with all the titles of the notes.
   */
  public getNotesTitle(user: string): string[] | undefined {
    const notesList: string[] = [];
    const userNotes: Note[] | undefined = this.getUserNotes(user);
    if (typeof userNotes === 'undefined') {
      return undefined;
    }
    userNotes.forEach((note: Note) => {
      switch (note.color) {
        case Color.blue:
          notesList.push(chalk.blue(note.title));
          break;
        case Color.red:
          notesList.push(chalk.red(note.title));
          break;
        case Color.yellow:
          notesList.push(chalk.yellow(note.title));
          break;
        case Color.green:
          notesList.push(chalk.green(note.title));
          break;
        default:
          notesList.push(note.title);
          break;
      }
    });
    return notesList;
  }

  /**
   * Adds a note to a user file.
   * @param user User to add the note.
   * @param note Note to be added.
   * @returns True if the note is added. False is something goes wrong.
   */
  public addNote(user: string, note: Note): Note[] | undefined {
    const allNotes: Note[] | undefined = this.getUserNotes(user);
    if (typeof allNotes === 'undefined') {
      return undefined;
    }
    let data: string = `{\n\t"notes": [\n\t\t`;
    allNotes.forEach((arrNote) => {
      const jsonFormat: string = JSON.stringify(arrNote);
      data += `${jsonFormat},\n\t\t`;
    });
    const jsonFormat: string = JSON.stringify(note);
    data += `${jsonFormat}\n\t]\n}`;
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
    return this.getUserNotes(user);
  }
}
