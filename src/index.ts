const fs = require('fs');

const lyrics = 'But still Im having memories of high speeds when the cops ' +
  'crashed\nAs I';

// write to a new file named 2pac.txt
fs.writeFile('/mnt/d/Home/Universidad/DSI/Pract8/dist/2pac.txt', lyrics, (err: any) => {
  if (err) throw err;

  // success case, the file was saved
  console.log('Lyric saved!');
});
