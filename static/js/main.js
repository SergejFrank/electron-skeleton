window.initialized = function(){
    console.log("ready");

    listen("ping",function(e,data){
        log(data);
        send("ping","pong");
    });

};