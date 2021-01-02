const socket = io();
const username = localStorage.getItem('name');
const room = localStorage.getItem('room');
const createRoom = localStorage.getItem('createRoom');
let casillasBloqueadas = [];
let enEspera=false;
let players = [];

//mostramos algunos datos importantes
players.push(username);
showData();

//esta es la condicion basica para todo
if(createRoom){
    socket.emit('room:new',{
        room: room
    });
    socket.emit('chat:message',{
        message:username+' Listo!',
        room:room,
        username:username
    });
    socket.on('chat:message', function(data){
        console.log(data);
    });
    
}else{
    console.log(createRoom);
}

sendMyData();

function sendMyData(){
    socket.emit('room:userData',{
        username:username,
        room:room
    });
}

function exit(){
    socket.emit('room:leave', {
        room:room,
        username:username
    });
    localStorage.clear();
    location.href = '/start';
}

//el jgador siempre va a ser "X"
function cambiaTurno(casilla){
    if(casillasBloqueadas.indexOf(casilla)==-1 && !enEspera){
        document.getElementById(casilla).value = 'X';
        casillasBloqueadas.push(casilla);
        //activamos el modo espera para este usuario hasta que el proximo termine su turno
        enEspera = true;
        socket.emit('game:position',{
            casilla:casilla,
            room:room
        });
        comprobarGanacion('X');
        console.log('opcion enviada');
    }else if(enEspera){
        let chat = document.getElementById('chat');
        chat.insertAdjacentHTML('beforeend', `<p class="black-medium">
        <strong>System</strong>: No es su turno
        </p>`);
        console.log('no entró')
    }else{
        console.log('casilla ocupada');
    }
}

socket.on('game:position',function(data){
    const casilla = data.casilla;
    enEspera=false;
    document.getElementById(casilla).value = 'O';
    casillasBloqueadas.push(casilla);
    console.log('Se recibió')
});

let c=0;
socket.on('room:userData',function(data){
    players.push(data.username);
    showData();
    if(!c>1)sendMyData();
    c++;
});

socket.on('game:lose',function(data){
    lose();
});

function showData(){
    document.getElementById('roomName').value = room;
    document.getElementById('playersName').value = players;
}

function comprobarGanacion(val){
        console.log('compureba')
			var c1 = document.getElementById('c1').value;
			var c2 = document.getElementById('c2').value;
			var c3 = document.getElementById('c3').value;
			var c4 = document.getElementById('c4').value;
			var c5 = document.getElementById('c5').value;
			var c6 = document.getElementById('c6').value;
			var c7 = document.getElementById('c7').value;
			var c8 = document.getElementById('c8').value;
			var c9 = document.getElementById('c9').value;

			
			if((c1 == val && c2 == val && c3 == val) || (c4 == val && c5 == val && c6 == val) || (c7 == val && c8 == val && c9 == val))
			{
                win();
                console.log('ganacion')
			}
			else if((c1 == val && c4 == val && c7 == val) || (c2 == val && c5 == val && c8 == val) || (c3 == val && c6 == val && c9 == val))
			{
                win();
                console.log('ganacion')
			}
			else if((c1 == val && c5 == val && c9 == val) || (c3 == val && c5 == val && c7 == val))
			{
                win();
                console.log('ganacion')
			}
}

function win(){
    Swal.fire({
        title:"Felicidades, ganaste",
        icon: 'success'
    });

    socket.emit('game:lose',{
        room:room
    });
    limpiarTablero();
}
function lose(){
    Swal.fire({
        title:"Buena suerte para la proxima, perdiste",
        icon: 'error'
    });
    limpiarTablero();
}
function limpiarTablero(){
    for(var i = 0; i<9; i++){
        let c = 'c'+(i+1);
        document.getElementById(c).value = ' ';
    }
}

//messages
function onKeyUp(event) {
    var keycode = event.keyCode;
    if(keycode == '13'){
      let message = document.getElementById('message').value;
      socket.emit('chat:message',{
          room:room,
          message:message,
          username:username
      });
      document.getElementById('message').value = '';
    }
  }
/*
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->*/
socket.on('chat:message',function(data){
    let chat = document.getElementById('chat');
    chat.insertAdjacentHTML('beforeend', `<p class="black-medium">
    <strong>${data.username}</strong>: ${data.message}
    </p>`);
    document.getElementById('typing').innerHTML = '';
});

document.getElementById('message').addEventListener('keypress',function (){
    socket.emit('chat:typing', {
        room:room,
        username:username
    });
    document.getElementById('typing').innerHTML = '';
});

socket.on('chat:typing',function(data){
    document.getElementById('typing').innerHTML = `<p>
    <em>${data} is typing</em>
    </p>`;
});