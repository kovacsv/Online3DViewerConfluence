let fs = require ('fs');
let path = require ('path');
let express = require ('express');
let ngrok = require ('@ngrok/ngrok');

let app = express ();
let port = 8080;

app.listen (port);
console.log ('Server listening on port: ' + port.toString ());

(async function () {
    console.log (process.env);
    let connection = await ngrok.connect ({
        addr : port,
        authtoken : process.env.NGROK_AUTHTOKEN
    });
    let publicUrl = connection.url ();
    let connectUrl = publicUrl + '/atlassian-connect.json';
    console.log ('Public url: ' + publicUrl);
    console.log ('Connect url: ' + connectUrl);

    let rootDir = path.dirname (__dirname);
    let publicDir = path.join (rootDir, 'public');
    app.get ('/atlassian-connect.json', (req, res) => {
        let jsonStr = fs.readFileSync (path.join (publicDir, 'atlassian-connect.json'));
        let jsonContent = JSON.parse (jsonStr);
        jsonContent.baseUrl = publicUrl;
        res.json (jsonContent);
    });
    app.use (express.static (publicDir));
})();
