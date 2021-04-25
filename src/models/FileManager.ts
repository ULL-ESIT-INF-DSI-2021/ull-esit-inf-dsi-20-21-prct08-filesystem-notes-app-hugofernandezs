import * as chalk from 'chalk';

export const enum color {
  red = "Red",
  yellow = "Yellow",
  green = "Green",
  blue = "Blue",
};


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
      console.log("File exists");
      return true;
    } else {
      return false;
    }
  }


  /**
   * Returns all the notes from the user.
   * @param user User to find the notes.
   * @returns A list with all the names of the notes.
   */
  public getUserNotes(user: string): string[] | undefined {
    const notesList: string[] = [];
    if (!this.existsUserFile(user)) {
      return undefined;
    } else {
      const file: string = `${this.folderPath_}/${user}.json`;
      console.log(`Checking ${this.folderPath_}/${user}.json file...`);
      const userNotes: any[] = JSON.parse(this.fs_.readFileSync(file)).notes;
      userNotes.forEach((note) => {
        switch (note.color) {
          case color.blue:
            notesList.push(chalk.blue(note.title));
            break;
          case color.red:
            notesList.push(chalk.red(note.title));
            break;
          case color.yellow:
            notesList.push(chalk.yellow(note.title));
            break;
          case color.green:
            notesList.push(chalk.green(note.title));
            break;
          default:
            notesList.push(note.title);
            break;
        }
      });
    }
    return notesList;
  }
}

const fm: FileManager = FileManager.instance;
const userNotes: string[] | undefined = fm.getUserNotes('hugo');
if (!(typeof userNotes === 'undefined')) {
  userNotes.forEach((note) => {
    console.log(note);
  });
}
