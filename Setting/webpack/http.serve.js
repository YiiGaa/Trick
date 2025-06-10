const { exec } = require('child_process');
const config = require('./custom.js')

const port = config.port || 6789;
const command = `npx http-server Build -p ${port} -o`;
const child = exec(command);

child.stdout.on('data', (data) => {
    console.log(data);
});
child.stderr.on('data', (data) => {
    console.error(data);
});
child.on('close', (code) => {
    console.log(`http-server exited with code ${code}`);
});