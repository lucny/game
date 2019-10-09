try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}

/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        //noteContent += transcript;
        console.log(transcript);
        voiceControl(transcript, document.getElementById("start"));
    }
};

recognition.onstart = function() {
    //instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    //instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        //instructions.text('No speech was detected. Try again.');
    };
}

/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 2;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

$("#start").on('click', () => {
    recognition.start();
    readOutLoud('Start your instructions');
})

function voiceControl(instr, obj) {
    //let re = new RegExp(instr.trim());
    if (instr.match(/do.[ůu]/i))
        obj.style.top = parseInt(obj.style.top) ? parseInt(obj.style.top) + parseInt(instr.replace(/do.[ůu]/i, '')) + 'px' : '10px';

    if (instr.match(/text/i) || instr.match(/přepsat/i)) {
        obj.innerText = instr.replace(/text/i, '');
    }

    if (instr.match(/nahoru/i))
        obj.style.top = parseInt(obj.style.top) ? parseInt(obj.style.top) - parseInt(instr.replace(/nahoru/i, '')) + 'px' : '-10px';

    if (instr.match(/(doleva|vlevo)/i))
        obj.style.left = parseInt(obj.style.left) ? parseInt(obj.style.left) - parseInt(instr.replace(/(doleva|vlevo)/i, '')) + 'px' : '-10px';

    if (instr.match(/(do[ ]?prava|vpravo)/i))
        obj.style.left = parseInt(obj.style.left) ? parseInt(obj.style.left) + parseInt(instr.replace(/(do[ ]?prava|vpravo)/i, '')) + 'px' : '10px';

    if (instr.match(/(styď|hanba)/i) || instr.match(/shame/i)) {
        obj.style.backgroundColor = 'red';
        readOutLoud('Sorry, I am an idiot');
    }

    if (instr.match(/(nech toho|dobrý|hodný)/i) || instr.match(/good/i))
        obj.style.backgroundColor = 'gray';

    /*switch (re) {
        case 'doprava':
        case 'vpravo':
        case 'right':
            console.log('right');
            obj.style.left = parseInt(obj.style.left) ? parseInt(obj.style.left) + 10 + 'px' : '10px';
            break;
        case 'doleva':
        case 'vlevo':
        case 'left':
            console.log('left');
            obj.style.left = parseInt(obj.style.left) ? parseInt(obj.style.left) - 10 + 'px' : '0px';
            break;
        case 'nahoru':
        case 'up':
            console.log('top');
            obj.style.top = parseInt(obj.style.top) ? parseInt(obj.style.top) - 10 + 'px' : '0px';
            break;
        case /dolů/:
        case 'down':
            console.log('bottom');
            obj.style.top = parseInt(obj.style.top) ? parseInt(obj.style.top) + 10 + 'px' : '10px';
            break;
        case 'náhodná barva':
            console.log('color');
            break;
        case 'změnit text':
            console.log('text change');
            obj.innerText = 'Stop';
            break;
    }*/
}

let sensor = new Accelerometer();
sensor.addEventListener('reading', function(e) {
    document.getElementById('accelerometer').innerHTML = 'x: ' + e.target.x + ' y: ' + e.target.y + ' z: ' + e.target.z;
    console.log(e.target);
});
sensor.start();

sensor2 = new AmbientLightSensor();
sensor2.addEventListener('reading', function(e) {
    document.getElementById('light').innerHTML = e.target.illuminance;
    console.log(e.target.illuminance);

    var lux = e.target.illuminance;
    // console.log('L:', lux.map(0, 500, 0, 255));
    //var val = lux.map(0, 500, 0, 255);
    //document.getElementById('light').innerHTML = lux + ' lux';
    document.body.style.backgroundColor = 'yellow';
    document.body.style.backgroundColor = 'rgb(' + (lux % 256) + ',' + (lux % 256) + ',' + (lux % 256) + ')';
});
sensor2.start();

var sensor3 = new Magnetometer();
sensor3.addEventListener('reading', function(e) {
    let heading = Math.atan2(e.target.y, e.target.x) * (180 / Math.PI);
    document.getElementById('magnetometer').innerHTML = 'Heading in degrees: ' + heading;
});
sensor3.start();

let compass = document.getElementById('compass');
let sensor4 = new AbsoluteOrientationSensor();
sensor4.addEventListener('reading', function(e) {
    var q = e.target.quaternion;
    heading = Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]) * (180 / Math.PI);
    if (heading < 0) heading = 360 + heading;
    compass.style.Transform = 'rotate(' + heading + 'deg)';
})
sensor4.start();