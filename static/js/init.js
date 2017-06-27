window.$ = window.jQuery = require('jquery');

window.ipcRenderer = require('electron').ipcRenderer;
window.conf = {};
window.logEnum = {
    LOG: 0,
    DEBUG: 1
}


window.send = function(topic,data){
    ipcRenderer.send(topic, data);
};

window.listen = function(topic, callback){
    ipcRenderer.on(topic, function (event, data) {
        log("data received on topic: "+ topic,logEnum.DEBUG);
        callback(event,data);
    });
};

window.log = function(msg,type){
    if(type == logEnum.DEBUG && !conf.debug){
        return;
    }else{
        console.log(msg);
    }
};

listen("conf",function(e,conf){
    window.conf = conf;
    initialized();
});