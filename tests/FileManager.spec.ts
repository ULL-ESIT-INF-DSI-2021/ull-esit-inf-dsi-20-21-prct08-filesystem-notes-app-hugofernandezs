import 'mocha';
import {expect} from 'chai';
import chalk from 'chalk';
import {FileManager} from '../src/models/FileManager';
import {Note} from '../src/models/Note';


const user: string = "hugo";
const fm: FileManager = FileManager.instance;
const notesTitles: string[] = [chalk.red("Nota1"), chalk.blue("Nota2")];
const userData = require(`../data/${user}.json`);
const userNotes: Note[] = userData.notes;


describe('Funcionamiento básico de la clase FileManager.',
    () => {
      it('Se pueden obtener las notas de un usuario.', () => {
        expect(fm.getUserNotes(`${user}`)).to.deep.equal(userNotes);
      });
      it('Se pueden listar los títulos de las notas de un usuario.', () => {
        expect(fm.getNotesTitle(`${user}`)).to.deep.equal(notesTitles);
      });
    },
);

