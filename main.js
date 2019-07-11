// let sqlite = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');

// db.serialize(() =>
// {
//     db.run
//     (
//         `
//         CREATE TABLE IF NOT EXISTS vid
//         (
//         );
//         `
//     );
// });

// db.close();

const express = require('express');
const app     = express();
const helmet  = require('helmet');
const path    = require('path');
const https   = require('https');
const fs      = require('fs');

const this_dir   = path.dirname(__filename);
const public_dir = path.join(this_dir, 'public');
const index_html = path.join(public_dir, 'index.html');

let https_options;
if(process.env.fullchain && process.env.privkey)
{
    https_options =
    {
        cert : fs.readFileSync(process.env.fullchain),
        key  : fs.readFileSync(process.env.privkey)
    };

    app.use((req, res, next) =>
    {
        if(!req.secure)
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        else
            next();
    });
}

app.use(express.static(public_dir));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('*', (req, res) =>
{
    return res.sendFile(index_html);
});

const server = app.listen(process.env.PORT || '9001').on('listening', () =>
{
	if(https_options) https.createServer(https_options, app).listen(443);
	console.info(server.address());
});