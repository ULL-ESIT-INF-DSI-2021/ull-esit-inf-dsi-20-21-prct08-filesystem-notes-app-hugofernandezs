import 'mocha';
import {expect} from 'chai';
import {File} from '../src/models/File';


const file = new File('./fileSpec.txt', 'Fichero de prueba', 'rojo', 'Cuerpo');


describe('Funcionamiento básico de la clase File.',
    () => {
      it('Se puede escribir contenido nuevo.', () => {
        expect(file.write('Mensaje de prueba.')).to.deep.equal(
            "Content added to fileSpec.txt",
        );
      });
      it('Se puede leer su contenido.', () => {
        expect(file.read()).to.deep.equal(
            "Mensaje de prueba.",
        );
      });
    },
);

