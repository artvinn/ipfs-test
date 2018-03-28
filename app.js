const fs = require("fs");
const path = require("path");
const IPFSFactory = require('ipfsd-ctl')
const f = IPFSFactory.create()

const REPOSITORY_PATH = "./ipfs_repo";
const initialized = fs.existsSync(REPOSITORY_PATH);

// node config
const config = {
  disposable: false,
  repoPath: REPOSITORY_PATH,
  init: false,
  start: false,
  type: "go"
};

// spawn new node
f.spawn(config, (err, ipfsd) => {
  if (err) console.log(err)

  if (initialized) {
    start(ipfsd);
  }
  else {
    init(ipfsd)
      .then(() => start(ipfsd))
      .catch(err => console.log(err));
  }

})

// initialize repository
function init(ipfsd) {
  return new Promise((resolve, reject) => {
    ipfsd.init(err => {
      if (err) return reject(err)
      
      resolve();
    })
  })
}

// start the daemon
function start(ipfsd) {

  ipfsd.start((err, ipfsApi) => {
    process.on('exit', ipfsd.stop);

    // setTimeout(() => {
    //   ipfsApi.stop(err => console.log(err))
    // }, 2000)

    if (err) console.log(err)

    // ipfsd.getConfig((err, obj) => {
    //   console.log(err);
    //   console.log(obj);
    // })

    // ipfsApi.pin.ls((err, pinset) => {
    //   if (err) console.log(err)

    //   console.log(pinset)
    // })

    // addFile(ipfsApi, path.join(__dirname, "files/artjom.txt"))
      // .then(res => {
        // console.log(res)
      // })
  })
}

function addFile(ipfsApi, path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      console.log(data)
      ipfsApi.files.add(data, (err, res) => {
        if (err) console.log(err)
        resolve(res[0])
      })
    })
  })
} 