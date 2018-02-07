var five = require("johnny-five");
var entrar = 0;
var saida = 0;
var tinhaObstaculo = false;
var tinhaobs = false;
var final;
var board = five.Board({
    port: "COM5"
}

);
board.on("ready", function () {
    var SensorEntrada = new five.Proximity({
        controller: "HCSR04",
        pin: 7,
        freq: 50
    })
    var SensorSaida = new five.Proximity({
        controller: "HCSR04",
        pin: 6,
        freq: 50
    })

    SensorEntrada.on("data", function () {
        // se tinhaObstaculo e agora não tem mais
        var temObstaculo = this.cm < 15;

        if (tinhaObstaculo && !temObstaculo) {
            entrar++;
        }

        tinhaObstaculo = temObstaculo;
    });
    SensorSaida.on("data", function () {

        var temobs = this.cm < 15;

        if (tinhaobs && !temobs) {
            saida++;
        }
        tinhaobs = temobs;
        
        final = (entrar - saida);
        if (final <= 0 ) {
             saida = 0;
             entrar = 0;
        }
         console.log("Número de pessoas:   ");
        console.log(final);
    
            });
   
})
