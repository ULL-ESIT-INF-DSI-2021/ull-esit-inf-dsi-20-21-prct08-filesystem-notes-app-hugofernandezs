import 'mocha';
import {expect} from 'chai';
import chalk from 'chalk';
import {FileManager} from '../src/models/FileManager';
import {Color, Note} from '../src/models/Note';


const user: string = "hugo";
const fm: FileManager = FileManager.instance;
const notesTitles: string[] = [chalk.red("Nota1"), chalk.blue("Nota2")];
const userData = require(`../data/${user}.json`);
const userNotes: Note[] = userData.notes;
const newNote: Note = new Note("nuevaNota", Color.green, "Nuevo cuerpo");


describe('Funcionamiento básico de la clase FileManager.',
    () => {
      it('Se pueden obtener las notas de un usuario.', () => {
        expect(fm.getUserNotes(`${user}`)).to.deep.equal(userNotes);
      });
      it('Se pueden listar los títulos de las notas de un usuario.', () => {
        expect(fm.getNotesTitle(`${user}`)).to.deep.equal(notesTitles);
      });
      it('Se pueden añadir una nueva nota.', () => {
        const auxNotes = userNotes;
        auxNotes.push(newNote);
        expect(fm.addNote(`${user}`, newNote)).to.deep.equal(auxNotes);
      });
    },
);

