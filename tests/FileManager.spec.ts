import 'mocha';
import {expect} from 'chai';
import chalk from 'chalk';
import {FileManager} from '../src/models/FileManager';
import {Color, Note} from '../src/models/Note';


const user: string = "spec";
const fm: FileManager = FileManager.instance;
const notesTitles: string[] = [chalk.red("Nota1"), chalk.blue("Nota2")];
const newNote: Note = new Note("nuevaNota", Color.green, "Nuevo cuerpo");
const note1: Note = new Note("Nota1", Color.red, "Cuerpo 1");
const note2: Note = new Note("Nota2", Color.blue, "Cuerpo2");
const userNotes: Note[] = [note1, note2];


describe('Funcionamiento básico de la clase FileManager.',
    () => {
      it('Se pueden añadir una nueva nota.', () => {
        fm.addNote(user, note1);
        expect(fm.addNote(user, note2)).to.deep.equal(userNotes);
      });
      it('Se pueden obtener las notas de un usuario.', () => {
        expect(fm.getUserNotes(user)).to.deep.equal(userNotes);
      });
      it('Se pueden listar los títulos de las notas de un usuario.', () => {
        expect(fm.getNotesTitle(user)).to.deep.equal(notesTitles);
      });
      it('Se pueden eliminar una nota.', () => {
        fm.addNote(user, newNote);
        expect(fm.removeNote(user, newNote)).to.deep.equal(userNotes);
      });
      it('Se pueden eliminar un usuario.', () => {
        expect(fm.removeUser(user)).to.deep.equal(true);
      });
    },
);

