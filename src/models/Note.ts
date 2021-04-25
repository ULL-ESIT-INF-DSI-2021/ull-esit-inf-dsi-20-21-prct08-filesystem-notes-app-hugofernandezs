

export enum Color {
  red = "Red",
  yellow = "Yellow",
  green = "Green",
  blue = "Blue",
  white = "White",
};


/**
 * Implements a user note.
 * @var title Title of the note.
 * @var color Color of the note.
 * @var body Body of the note_
 */
export class Note {
  public title: string;
  public color: Color;
  public body: string;

  constructor(newTitle: string, newColor: Color, newBody: string) {
    this.title = newTitle;
    this.color = newColor;
    this.body = newBody;
  }
}
