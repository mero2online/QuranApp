// eslint-disable-next-line no-undef
var Deploy = require('ftp-deploy');

var ftpDeploy = new Deploy();

var config = {
  // eslint-disable-next-line no-undef
  host: process.env.FTP_HOST,
  // eslint-disable-next-line no-undef
  port: process.env.FTP_PORT,
  // eslint-disable-next-line no-undef
  remoteRoot: process.env.FTP_REMOTEDIR,
  // eslint-disable-next-line no-undef
  localRoot: __dirname + '/dist',
  // eslint-disable-next-line no-undef
  user: process.env.FTP_USER,
  // eslint-disable-next-line no-undef
  password: process.env.FTP_PASSWORD,
  include: ['*'],
  exclude: ['*.jpg'],
  deleteRemote: false,
};
ftpDeploy.on('uploading', (data) => {
  data.totalFilesCount;
  data.transferredFileCount;
  data.filename;
});
ftpDeploy.deploy(config, (err, res) => {
  if (err) console.log(err);
  else console.log('finished:', res);
});
ftpDeploy.on('uploaded', (data) => {
  console.log(
    'uploaded',
    data.transferredFileCount,
    'of',
    data.totalFilesCount,
    data.filename
  );
});
ftpDeploy.on('log', (data) => {
  console.log('log', data);
});
ftpDeploy.on('upload-error', (data) => {
  console.log('upload-error', data.err);
});
