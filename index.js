const http = require('http');
const fs = require("fs");
const path = require("path");
const formidable = require('formidable');
const translate = require('translate-platforms');

const github = 'https://github.com/dottobr83/translate-platform-api'

async function main() {
    createServer();
}

async function createServer() {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'))

    http.createServer(async function (request, response) {
        if (request.method == 'POST') {
            try {
                response.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
                });

                const form = formidable({ multiples: true });
                form.parse(request, async (err, fields, files) => {
                    let { platform, to, from, word } = fields;
                    if (!word || !platform || !to) return response.end(JSON.stringify({
                        status: 2,
                        msg: 'Parameter error!'
                    }));

                    try {
                        let data = await translate[platform](word, { to, from });

                        response.end(JSON.stringify({
                            status: 0,
                            msg: 'tranlate success',
                            data
                        }));
                    } catch (error) {
                        response.end(JSON.stringify({
                            status: 3,
                            msg: error.message
                        }));
                    }

                });
                         
            } catch (error) {
                response.end(JSON.stringify({
                    status: -1,
                    msg: `Has something wrong: ${error.message}. Please post a <a href="${github}/issues">Issue</a> to me.`
                }));
                console.error(error);
            }
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
            });
            response.end(html)
        }
    
    }).listen(8888);
    console.info('Server running at http://localhost:8888/');
}

main();
