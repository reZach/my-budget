// credit to https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
  }

  localpath(){
    return this.path;
  }

  exists(){
      return fs.existsSync(this.path);
  }
  
  get() {
    return fs.readFileSync(this.path, "utf-8");
  }
  
  set(data, callback) {
    fs.writeFile(this.path, data, "utf-8", callback);
  }

  setSync(data, callback){
    fs.writeFileSync(this.path, data, "utf-8", callback);
  }
}

var fileHelper = new Store({
    configName: "file"
});

export default fileHelper;