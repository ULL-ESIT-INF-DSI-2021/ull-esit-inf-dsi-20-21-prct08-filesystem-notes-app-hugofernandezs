# **PRÁCTICA 8 - Aplicación de procesamiento de notas de texto**



## **OBJETIVO DE LA PRÁCTICA**
El objetivo de la práctica consiste en realizar una serie de problemas propuestos y resolverlos usando TypeScript y las funcionalidades de Node.js para familiarizarnos con el lenguaje y su funcionamiento.

En esta práctica nos centraremos especialmente en el funcionamiento de Node.js y sus funciones para trabajar con ficheros, así como el manejo de comandos mediante yargs y el coloreado del texto con chalk. 



## **Descripción de la aplicación de procesamiento de notas de texto**


### **Requisitos**

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente.
2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).
3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:


### **Funcionalidades**

- Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.
- Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.
- Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.
- Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. Use el paquete chalk para ello.
- Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola.
- Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. Use el paquete chalk para ello.
- Hacer persistente la lista de notas de cada usuario. Aquí es donde entra en juego el uso de la API síncrona de Node.js para trabajar con el sistema de ficheros:
  - Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.
  - Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.


## **Desarrollo**

### **La clase FileManager**

Para esta aplicación nos hemos centrado principalmente en el desarrollo de una clase que nos permita manejar ficheros. Dicha clase ha sido llamada **FileManager** y se ha creado usando el patrón **Singleton**. Este patrón se suele emplear cuando se crean objetos que pueden acceder a recursos compartidos, como por ejemplo archivos, para evitar conflictos a la hora de acceder a estos. Para implementar esta única instancia, crea una única instancia de la misma mediante un atributo estático, y llamando luego a un método *instance()* que devuelve el objeto, impidiendo así múltiples instancias de la clase.

```typescript
export class FileManager {
  private fs_ = require('fs');
  private static instance_: FileManager;
  private readonly folderPath_: string;

  public constructor() {
    this.folderPath_ = "./data";
    if (!this.fs_.existsSync(this.folderPath_)) {
      this.fs_.mkdirSync(this.folderPath_, {recursive: true});
    }
  }

  public static get instance(): FileManager {
    if (!this.instance_) {
      this.instance_ = new FileManager();
    }
    return this.instance_;
  }
  // Más funciones debajo.
}
```

Como atributos almacena la instancia de la misma, la ruta de la carpeta donde se almacenarán las notas y el módulo **fs**. Este módulo es un paquete especial de **Node.js**, que nos ayuda a la hora de trabajar con ficheros y manejarlos. Dándonos la posibilidad de escribir en un fichero, leer, modificar, borrar, crear... Utilizando funciones de alto nivel y así olvidarnos de detalles de bajo nivel. Además nos proporciona una serie de funciones *síncronas*, que realizan las mismas funcionalidades pero de manera síncrona, es decir, se coordina para escribir en los archivos evitando así condiciones de carrera.

#### **Funciones de la clase FileManager**

Como funciones de la clase tenemos las siguientes:

##### **getUserFiles**

Es una función auxiliar que comprueba si un usuario tiene un archivo .json creado con sus notas.

```typescript
private existsUserFile(user: string): boolean {
  if (this.fs_.existsSync(`${this.folderPath_}/${user}.json`)) {
    return true;
  } else {
    return false;
  }
}
```

##### **getUserNotes**

Devuelve un array con todas las notas de un usuario.

```typescript
public getUserNotes(user: string): Note[] | undefined {
  if (!this.existsUserFile(user)) {
    return undefined;
  } else {
    const data: any = JSON.parse(this.fs_.readFileSync(
      `${this.folderPath_}/${user}.json`));
    return data.notes;
  }
}
```

##### **getNotesTitle**

Muy similar a la anterior, pero devuelve un array con los títulos de las notas.

```typescript
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
    case Color.white:
      notesList.push(chalk.white(note.title));
      break;
    default:
      notesList.push(note.title);
      break;
    }
  });
  return notesList;
}
```

##### **addNote**

Añade una nueva nota a la lista de un usuario. Primero comprueba que dicha nota no exista. Luego añade la nota a una cadena de caractéres en formato JSON, junto a las demás notas ya existentes, y sobrescribe el archivo con la nueva nota.

```typescript
public addNote(user: string, note: Note): Note[] | undefined {
  const allNotes: Note[] | undefined = this.getUserNotes(user);
  let data: string = `{\n\t"notes": [\n\t\t`;
  if (typeof allNotes === 'undefined') {
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
  } else {
    allNotes.forEach((arrNote) => {
      if (arrNote.title === note.title) {
        return undefined;
      }
      const jsonFormat: string = JSON.stringify(arrNote);
      data += `${jsonFormat},\n\t\t`;
    });
  }
  const jsonFormat: string = JSON.stringify(note);
  data += `${jsonFormat}\n\t]\n}`;
  data = this.noteJsonFormat(data);
  this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
  return this.getUserNotes(user);
}
```

##### **removeNote**

Realiza los mismos pasos que la función add. Pero esta vez comprueba que no exista, luego almacena todas las notas en un vector y elimina del vector la nota deseada. Después se formatea el vector en formato JSON y se añade a la lista de notas del usuario sobrescribiendo el archivo.

```typescript
public removeNote(user: string, note: string): Note[] | undefined {
  const allNotes: Note[] | undefined = this.getUserNotes(user);
  let data: string = `{\n\t"notes": [\n\t\t`;
  if (typeof allNotes === 'undefined') {
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
    return undefined;
  }
  let index: number = -1;
  allNotes.forEach((arrNote) => {
    if (arrNote.title === note) {
      index = allNotes.indexOf(arrNote);
    }
  });
  if (index === -1) {
    return undefined;
  }
  delete allNotes[index];
  allNotes.forEach((arrNote) => {
    const jsonFormat: string = JSON.stringify(arrNote);
    data += `${jsonFormat},\n\t\t`;
  });
  data = data.substring(0, data.length - 4);
  data += `\n\t]\n}`;
  data = this.noteJsonFormat(data);
  this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
  return this.getUserNotes(user);
}
```

##### **editNote**

Igual que las anteriores almacena todas las notas en un vector. Busca una nota en el vector con el título indicado y la sustituye con la nueva nota pasada para luego sobrescribir el archivo con el array modificado.

```typescript
public editNote(user: string, oldNote: string, editedNote: Note):
    Note[] | undefined {
  const allNotes: Note[] | undefined = this.getUserNotes(user);
  let data: string = `{\n\t"notes": [\n\t\t`;
  if (typeof allNotes === 'undefined') {
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
    console.log(chalk.red(`Error en el formato del archivo ${user}.json.`));
    return undefined;
  }
  let index: number = -1;
  allNotes.forEach((arrNote) => {
    if (arrNote.title === oldNote) {
      index = allNotes.indexOf(arrNote);
    }
  });
  if (index === -1) {
    return undefined;
  }
  allNotes[index] = editedNote;
  allNotes.forEach((arrNote) => {
    const jsonFormat: string = JSON.stringify(arrNote);
    data += `${jsonFormat},\n\t\t`;
  });
  data = data.substring(0, data.length - 4);
  data += `\n\t]\n}`;
  data = this.noteJsonFormat(data);
  this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
  return this.getUserNotes(user);
}
```

##### **removeUser**

Elimina un usuario del programa. El funcionamiento es fácil. Basta con eliminar el archivo .json del usuario.

```typescript
public removeUser(user :string): boolean {
  this.fs_.rmSync(`${this.folderPath_}/${user}.json`);
  return true;
}
```

##### **noteJsonFormat**

Función auxiliar. Pasada una cadena de caracteres con objetos en formato JSON. Añade retoques para formatear la cadena a un formato más legible pero sin dejar de ser JSON.

```typescript
private noteJsonFormat(data: string): string {
  let aux: string = data;
  aux = aux.replace(/,/g, ",\n\t\t\t");
  aux = aux.replace(/:/g, ": ");
  aux = aux.replace(/{"/g, "{\n\t\t\t\"");
  aux = aux.replace(/"}/g, "\"\n\t\t}");
  aux = aux.replace(/},\n\t\t\t\n/g, "},\n");
  return aux;
}
```


### **La clase Note**

Además he creado una clase **Note** que nos ayudará a almacenar las notas de los usuarios y a manejar sus atributos de forma más ordenada.

```typescript
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
```

Es una clase muy sencilla cuya única finalidad es la de ordenar la clase nota y hacer más fácil el trabajo, pues no implementa ninguna función especial.