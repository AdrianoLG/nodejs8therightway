'use strict';

const dir = require('node-dir');
const parseRDF = require('./lib/parse-rdf.js');
const dirname = process.argv[2];
const options = {
   match: /\.rdf$/, // Match .rdf files
   exclude: ['pg0.rdf'], // Ignore the template RDF file ID=0
};

let cont = 0;
dir.readFiles(dirname, options, (err, content, next) => {
   process.stdout.on('error', err => {
      if (err.code === 'EPIPE') {
         process.exit();
      }
      throw err;
   });
   const doc = parseRDF(content);
   console.log(JSON.stringify({ index: { _id: `pg${doc.id}` } }));
   console.log(JSON.stringify(doc));
   if(cont > 10) {
      setTimeout(() => {
         cont = 0;
         next();
      }, 200);
   } else {
      cont++;
      next();
   }
});

