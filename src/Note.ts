import {writeFile, readFile} from 'fs';

/**
 * Implements a user file.
 * @var userName_ Contains the name of the user.
 * @var fileName_ Contains the path of the file.
 */
export class File {
  private readonly userName_: string;
  private readonly fileName_: string;

  /**
   * File constructor.
   * @param userName Name of the invoker user.
   * @param fileName Path to the file.
   */
  public constructor(userName: string, fileName: string) {
    this.userName_ = userName;
    this.fileName_ = fileName;
  }

  /**
   * Writes the passed text to the file.
   * @param text Text to write on in the file.
   * @returns An exception if something goes wrong.
   */
  public write(text: string): void {
    writeFile(this.fileName_, text, (err) => {
      if (err) {
        console.log('Something went wrong when writing your file');
      } else {
        console.log(`File ${text} has just been created`);
      }
    });
  }

  /**
   * Writes the passed text to the file.
   * @param text Text to write on in the file.
   * @returns An exception if something goes wrong.
   */
  public read(): void {
    readFile(this.fileName_, (err, data) => {
      if (err) {
        console.log('File not found!');
      } else {
        console.log(data.toString());
      }
    });
  }
}
