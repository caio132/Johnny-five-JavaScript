var five = require("johnny-five");
var mqtt = require("mqtt");
var board = new five.Board({
    port: "COM6"
});

board.on("ready", function () {

    console.log('deu o connect!');
    // a partir daqui, a bord do johnny-five esta porta

    console.log("Estou pronta para ser usada");

    var button = new five.Button(8)
    var button2 = new five.Button(4)
    var led = new five.Led(6)
    var portaoAberto = false;
    var servo = new five.Servo({
        pin: 7,
        startArt: 19
    });

    function fecharPortao() {
        servo.to(19, 1 * 10);
        portaoAberto = false;
        console.log("Portão fechado");
        //led.blink(10000);
        acendeApagaLed(true);
    }
    function abrirPortao() {
        servo.to(120, 1 * 10);
        portaoAberto = true;
        console.log("Portão aberto");
        acendeApagaLed(false);
    }
    function acendeApagaLed(acende) {
        if (acende) {
            led.off();
        }
        else {
            led.on();
        }
    }

    button2.on("down", function () {
        led.toggle();
    })
    button.on("down", function () {
        if (portaoAberto) {
            fecharPortao();
        } else {
            abrirPortao();
        }

    });



    var client = mqtt.connect("mqtt://localhost");
    client.on("connect", function () {
        console.log('MQTT Conectado');
        // a partir daqui, estamos conectador ao broker MQTT

        client.subscribe("garagem");
        client.subscribe("led");
        function callback(topic, payload) {
            // recebemos "1" para abrir  o portao
            // e "0" para fechar o portao  
            var msg = payload.toString();

            if (topic === "garagem") {
                if (msg === "1") {
                    abrirPortao();
                } else if (msg === "0") {
                    fecharPortao();
                } else {
                    console.log(topic);
                    console.log(msg);
                }
            }
            if (topic === "led") {
                if (msg === "1") {
                    led.on();
                } else if (msg === "0") {
                    led.off();
                }
            }
        }
        client.on("message", callback);
    });
});
