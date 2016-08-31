/**Fonction pour rechercher l'index d'un item dans un tableau pour une propriété donné  **/
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

var express = require('express');
var app=express();
var serv= require('http').Server(app);

app.get('/', function(req,res){
	res.sendFile(__dirname +'/client/index.html');
});
app.use('/client', express.static(__dirname +'/client'));
serv.listen(3000);
console.log('Le serveur vient de se lancer');



var player = {
	room : "",
	equipe : '',
	placement_x : 0,
    placement_y : 0,
    pseudo: '',
    Couleur: '',
    AsonTour: false,
    NbDeplacement: 5,
    vision :2,
}
//liste de tous les joueurs actuellement connecté 
var ListePlayer = [];


var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	console.log('socket connection');
	
	//quand un client envoit les données de son personnage
	var newplayer = player;
	socket.on('ValidJoueur', function (data) {
	    console.log('un joueur est entré dans la partie ' + data.room);
	    socket.join(data.room);
	    newplayer = data;
		ListePlayer.push(newplayer);

		io.in(newplayer.room).emit('nouveauJoueur', ListePlayer);
	});
	

    //lors d'un deplacement/Action du joueur
	socket.on('OnDeplacement', function (data) {
	   
	    var indexOfPlayer = arrayObjectIndexOf(ListePlayer, data.pseudo, "pseudo"); //on trouve l'index du joueur qui a été modifié par une action

	    ListePlayer[indexOfPlayer] = data; //le joueur à l'index trouvé est remplacé par ce même joueur avec les nouvelles informations

        //on notify le client qu'une action a été effectué et qu'il doit recharger le board game avec la nouvelle liste de joueur
	    io.in(newplayer.room).emit('ActionEffectue', ListePlayer);

	});
	
	
	socket.on('happy',function(){
		console.log('evenement happy');
	});
	
	
	socket.on('disconnect', function () {
	    console.log('Got disconnect!');

	    var indexOfPlayer = arrayObjectIndexOf(ListePlayer, newplayer.pseudo, "pseudo");
	    ListePlayer.splice(indexOfPlayer, 1);

	    //le type se deconnecte donc il effectue une action ( il n'existe plsu dans la liste ) 
	    io.in(newplayer.room).emit('Decojoueur', newplayer.pseudo);

	});

	socket.on('sendMsgToServer', function (data) {
	    //var playerName = ("" + socket.id).slice(2,7);
	    //for(var i in SOCKET_LIST){
	    //  SOCKET_LIST[i].emit('addToChat',playerName + ' '+ Player.list[socket.id].nomJoueur + ': ' + data);
	    //}
	    io.in(newplayer.room).emit('addToChat', data);

	});
	
	
	
});


 
 