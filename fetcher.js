const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const inputUrl = process.argv[2];
const localFilePath = process.argv[3];


request(inputUrl, (error, response, body) => {

  if (error || response.statusCode > 400) {
    console.log(`error: invalid URL`);
    process.exit();
  }

  //check if file exists; err = doesn't exist, !err = exists.
  fs.access(localFilePath, fs.constants.F_OK, (err) => {
    //if file exists: 
    if (!err) {
      rl.question(`OOPS! ${localFilePath} already exists! Overwrite Y/N?\n`, (answer) => {
        if (answer === '\u0059' || answer === '\u0079') {
          console.log('OK! overwriting......');
          fs.writeFile(localFilePath, body, err => {
            if (err) {
              console.log(err);
              return;
            }
            const fileSize = body.length;
            console.log(`Downloaded and saved ${fileSize} bytes to ${localFilePath}`);
          })
          rl.close();
        }
        rl.close();
      });
    }
    //if file doesn't exist: 
    if (err) {
      fs.writeFile(localFilePath, body, err => {
        if (err) {
          console.log(err);
          return;
        }
        const fileSize = body.length;
        console.log(`Downloaded and saved ${fileSize} bytes to ${localFilePath}`);
        process.exit();
      })
    }
  })
});

////////below is another way to fetch file size with fs.stat! :) //////////
// fs.stat(localFilePath, (err, stats) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   const fileSize = stats.size;
//   console.log(`Downloaded and saved ${fileSize} bytes to ${localFilePath}`);
// });