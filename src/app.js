const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const conf = require('../conf');

let win;

app.on('ready', function() {
    if(conf.debug){
        reloadOnFileChange()
    }
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

function reloadOnFileChange(){
    try {
        var bs = require("browser-sync").create();

        bs.watch(__dirname+"/static/**/*", function (event, file) {
            if (event == "change" && file.match(/(.scss|.js)$/g)) {
                win.reload();
            }
        });
    } catch (e) {
        console.log(e);
    }
}


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600,show: false});
    win.setMenu(null);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();


    win.once('ready-to-show', () => {
        win.show();
        win.webContents.send("conf", conf);
        initialized();
    })

    win.on('closed', () => {
        win = null
    })
}



var listen = function(topic,callback){
    ipcMain.on(topic, (event, arg) => {
        if(conf.debug){
            console.log("data received on topic: "+ topic);
        }
        console.log(arg);
    });
};

var send = function(topic,msg){
    win.webContents.send(topic, msg);
}



var initialized = function(){
    listen("ping",function(e,arg){
        console.log(arg);
    });

    send("ping", "ping")
};