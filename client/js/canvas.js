window.onload = function()
{
	var socket = io();
	socket.emit('happy');
	var BrouillardDeGuerre = true;

	//les données du joueur qui se connecte
	var player = {
	    room : '',
	    equipe :'',
	    placement_x : '5',
	    placement_y : '1',
	    pseudo: '',
	    Couleur: '#eeff00',
	    AsonTour: false,
	    NbDeplacement: 5,
	    vision : 2,
	}
    //liste de tous les joueurs actuellement connecté 
	var ListePlayer = [];

	$('#flic').change(function () {
	  
	    if($(this).is(':checked'))
	    {
	        //on décoche l'autre 
	        $('#voleur').attr("checked", false);
	        //l'equipe du joueur passe à flic et sa couleur passe à jaune 
	        player.equipe = "gentil";
	        player.Couleur = "#eeff00";
	    }
	});

	$('#voleur').change(function () {

	    if ($(this).is(':checked')) {
	        //on décoche l'autre 
	        $('#flic').attr("checked", false);
	        //l'equipe du joueur passe à méchant et sa couleur passe à rouge 
	        player.equipe = "mechant";
	        player.Couleur = "#e02121";
	    }

	});


	$("#setpseudo").click(function (e) {

	    if ($("#pseudo").val() != "" && player.equipe!=""/* && $("#room").val() != "" */)
	        {
	            player.pseudo = $("#pseudo").val();
	            player.room = $("#room").val();
              
	             $("#test").append($("#pseudo").val());
                
                 //on ajoute le joueur à la liste des joueurs 
	             ListePlayer.push(player);
	              //on envois au serveur "mes" données (joeuur en cours)  
	             socket.emit('ValidJoueur', player);

	           //on dessinne le board game pour afficher sa pièce 
	             DrawBoard();
	        }
	   
	});

	socket.on('ActionEffectue', function (DataListePlayer) {
	    var index;
	    for (var i in DataListePlayer) {
	        if (DataListePlayer[i].room == player.room /*&& DataListePlayer.pseudo != player.pseudo*/) {
	            //si la room est la même alors on actualise la liste des joueurs ( avec le premier de la liste qui est toujours le player )
	            index = arrayObjectIndexOf(ListePlayer, DataListePlayer[i].pseudo, "pseudo");
	            ListePlayer[index] = DataListePlayer[i];
	        }
	    }

	    //on REdessinne le board game pour l'actualiser
	    DrawBoard();
        //on met à jour le tableau des equipes
	    CreateTableauEquipe();

	});
    

    /**DECONNECTION d'un joueur qui est dans la partie ! **/
	socket.on('Decojoueur', function (pseudoDuDeco) {

	    for (var i in ListePlayer) {
	        if (ListePlayer[i].pseudo == pseudoDuDeco) {

	            ListePlayer.splice(i, 1);

	        }
	    }
	    //on REdessinne le board game pour l'actualiser
	    DrawBoard();
	    //on met à jour le tableau des equipes
	    CreateTableauEquipe();

	});
    /**FIN DECONNECTION **/



    /**CONNECTION d'un nouveau joueur à la partie ! **/
	socket.on('nouveauJoueur',function(DataListePlayer){
		alert("Nouveau joueur");
		var flag = true;
		var index;
		for (var i in DataListePlayer)
		{
		    flag = true;
		    index= arrayObjectIndexOf(ListePlayer, DataListePlayer[i].pseudo, "pseudo");
		    if (index != -1)
		    {
		        flag = false;
		    }

		    if (DataListePlayer[i].room == player.room && DataListePlayer[i].pseudo != player.pseudo && flag) //si la room est la même que player
		        {
                        //si la room est la même alors on ajoute à la liste 
		                ListePlayer.push(DataListePlayer[i]);   
				 }
		}
	    //on dessinne le board game pour afficher le nouveau utilisateur
		DrawBoard();
	    //on met à jour le tableau des equipes
		CreateTableauEquipe();
	 });
    /**FIN CONNECTION **/


	
	/**l'objet Damier**/
	var Damier={
	 boardId: document.getElementById('moncanvas'),
	 colonne : 10,
	 ligne : 10,
	 tailleCase : 50,
	 taillePiece : 30,
	 PieceCoordonnee: [],
	 
	}
	
	/** Initialisation canvas **/
    var canvas = document.getElementById('moncanvas');
	if(!canvas){alert("Impossible de récupérer le canvas");return;} 
	var context = canvas.getContext('2d');
    if(!context){ alert("Impossible de récupérer le context du canvas");return;}
   //On n'oublie pas de récupérer le canvas et son context.

   
    /*DESSINNER le board : on dessinne le board du jeux quand on veut**/
	var DrawBoard = function(){
		/**On dessinne ici le damier **/ 
		var color = 0; //flag pour savoir la couleur de la case du damier
		var x=0; //coordonnée x, multiplicateur pour l'axe des absysses 
		var y=0; //coordonnée y, multiplicateur pour l'axe des ordonnées
		
		var xDif = 0; //différence X entre position du joueur et case pointé 
		var yDif = 0; //Différence Y entre position du joueur et case pointé

			for(i=0; i<Damier.ligne; i++)
			{
					//couleur rouge 
					if(color==0){context.fillStyle = "#e1f4ee"; color =1;}
					//couleur noir 
					else{context.fillStyle = "#00a1ff";color = 0;}
				
				for(j=0; j<Damier.colonne; j++)
				{
				    xDif = Math.abs(player.placement_x-x);
				    yDif = Math.abs(player.placement_y - y);
				    if(xDif + yDif > player.vision && BrouillardDeGuerre ==true)
				    {
				        if (color == 1)
				        {
				            context.fillStyle = "#4b82a0"; //bleu foncé 
				            color = 0;
				        }
				        else
				        {
				            context.fillStyle = "#9cada7"; //blanc foncé 
				            color = 1;
				        }
				    }
					//couleur rouge 
					else if(color==0){context.fillStyle = "#e1f4ee"; color =1;}
					//couleur noir 
					else { context.fillStyle = "#00a1ff"; color = 0; }

					
					// on dessinne un carré
					context.fillRect(x*Damier.tailleCase,y*Damier.tailleCase,Damier.tailleCase,Damier.tailleCase);
					x= x+1;
				}
				x=0; //on reinitialise les abscisses 
				y=y+1; //et on ajoute 1 à l'ordonnée 
						
			}

             /**On dessinne les salles  **/
			DrawSalle();


			  /**On dessinne ici les pièces **/
				
			for (var i in ListePlayer)
			{
			    context.fillStyle = ListePlayer[i].Couleur; //jaune ou rouge
			    var radius = Damier.taillePiece / 2;

			    context.beginPath();
			    context.arc(((ListePlayer[i].placement_x * Damier.tailleCase + ((Damier.tailleCase - Damier.taillePiece) / 2)) + radius), ((ListePlayer[i].placement_y * Damier.tailleCase + ((Damier.tailleCase - Damier.taillePiece) / 2)) + radius), radius, 0, Math.PI * 2, false);
			    context.fill();
			    context.stroke();
			}

	}
	
    /**Initialisation des Salles **/
    ///ICI on peut déclarer des salles et les ajouter à la liste des salles, toutes salles ajouter à lal iste des salles et dessinner lors de l'appel de Drawboard
           ///une salle est composé d'une hauteur et d'une largeur ainsi qu'une coordonnée (x,y) de début et une coordonnée (x,y) de la porte permettant d'entrer dans la salle 
	var Salle1=
	{
		 hauteurSalle : 3,
	     largeurSalle : 2,
	     xDebut : 1,
	     yDebut : 5,
		 xPorte :1,
		 yPorte : 5,
	}
	var Salle2=
	{
		 hauteurSalle : 2,
	     largeurSalle : 2,
	     xDebut : 0,
	     yDebut : 0,
		 xPorte :1,
		 yPorte : 0,
	}
	var listeSalle = [];
	listeSalle.push(Salle1);
	listeSalle.push(Salle2);
    /**FIN Initialisation des Salles **/

    /** Dessinner les salles ( à appeller quand on dessinne le tableau )  **/
	var DrawSalle = function () {

	    /**On dessinne ici les salles ( une salle en en (1,5)/(2,5) jusqu'à (1,7)(2,7)   **/
	    
	    context.fillStyle = "#ff0000";//rouge
	    var im = new Image();
	    im.src = "client/img/mur-coinHG.png";
	for(var s in listeSalle)
	{
		
	    var x = listeSalle[s].xDebut;
	    var y =  listeSalle[s].yDebut;
		
	    for (var i = 0; i < listeSalle[s].hauteurSalle; i++) {

	        for (var j = 0; j < listeSalle[s].largeurSalle; j++) {
				
				if(j+listeSalle[s].xDebut== listeSalle[s].xPorte && i+listeSalle[s].yDebut == listeSalle[s].yPorte)
				{
					 im.src = "client/img/porte.png";
				}
				else if(i==0 && j==0)
				{
					  im.src = "client/img/mur-coinHG.png";
				}
				else if( j==listeSalle[s].largeurSalle-1 && i==0)
				{
					  im.src = "client/img/mur-coinHD.png";
				}
				else if(j<listeSalle[s].largeurSalle-1 && i==0)
				{
					 im.src = "client/img/mur-haut.png";
				}
				else if(j==0 && i<listeSalle[s].hauteurSalle-1)
				{
					 im.src = "client/img/mur-gauche.png";
				}
				else if(j==0 && i==listeSalle[s].hauteurSalle-1)
				{
					 im.src = "client/img/mur-coinBG.png";
				}
				else if(j < listeSalle[s].largeurSalle-1 &&  i < listeSalle[s].hauteurSalle-1 )
				{
					 im.src = "client/img/no-mur.png";
				}
				else if(j == listeSalle[s].largeurSalle-1  && i == listeSalle[s].hauteurSalle-1)
				{
					im.src = "client/img/mur-coinBD.png";
				}
				else if(j == listeSalle[s].largeurSalle-1 && i < listeSalle[s].hauteurSalle -1)
				{
				    im.src = "client/img/mur-droite.png";	
				}
				else if(j < listeSalle[s].largeurSalle-1 && i == listeSalle[s].hauteurSalle -1)
				{
				    im.src = "client/img/mur-bas.png";	
				}
				
	            // on dessinne un carré
	            context.fillRect(x * Damier.tailleCase, y * Damier.tailleCase, Damier.tailleCase, Damier.tailleCase);
	            context.drawImage(im, x * Damier.tailleCase, y * Damier.tailleCase, Damier.tailleCase, Damier.tailleCase);

	            x = x + 1;
	        }
				 
	        x = listeSalle[s].xDebut; //on reinitialise les abscisses 
	        y = y + 1; //et on ajoute 1 à l'ordonnée 

	    }
	}

	}


	//on dessinne le tableau la première fois.
      DrawBoard();
   



	/*** DECLARATION DE FONCTION ET DE JQUERY EVENT ***/
      
    /**Gestion du click**/
      $("#moncanvas").click(function (e) {	 // récupérer les coordonnées Au click à la souris 

     
				var cursorX;
			    var cursorY;
			    var xDif = 0;
			    var yDif = 0;
				// get the coordinates
					for(i=0;i<=Damier.colonne;i++){

						if(e.offsetX > (i * Damier.tailleCase) && e.offsetX < ((i + 1) * Damier.tailleCase)){
							cursorX = i;
						}

						if( e.offsetY > (i * Damier.tailleCase) && e.offsetY < ((i + 1) * Damier.tailleCase)){
							cursorY = i;
						}
					}
                        
                    // on cherche s''il est dans une salle actuellement ( return numero de salle si oui, null si non)
					var numeroSalle = estDansUneSalle();
                    //on fait des test pour savoir si l'utilisateur à le droit de se deplacer là où il a cliqué ( test pour les salles ) 
                    var TestDeplacementMur = testMetierDuClick(numeroSalle, cursorX, cursorY);

                    if (TestDeplacementMur) {
                        if (cursorX != undefined && cursorY != undefined) //si on clique pile-poil entre deux case les coordonnées sont undefined ! 
                        {
                            //si on a cliqué sur notre pièce
                            if (cursorX == player.placement_x && cursorY == player.placement_y) {
                                alert("J'ai cliqué sur ma pièce ");
                            }

                            /** Deplacement Case par CASE **/
                            xDif = Math.abs(cursorX - player.placement_x);
                            yDif = Math.abs(cursorY - player.placement_y);

                            if ((xDif + yDif) <= 1) {
                                //on met à jour les coordonnées de player
                                player.placement_x = cursorX;
                                player.placement_y = cursorY;

                                //on dessinne le tableau pour montrer les changements
                                DrawBoard();

                                //on INFORME le serveur qu'on a fait un deplacement et on lui envois toutes les nouvelles données du joueur en cours
                                socket.emit('OnDeplacement', player);
                            }
                            else {
                                alert("Il faut se déplacer case par case");
                            }


                        }
                    }
                    else {
                        alert("interdiction de traverser un mur ")
                    }
		});


    //Click sur le boutton terminer ! 
      $("#terminer").click(function (e) {

          alert("TERMINER");
      });


    //form chat submit !
      $("#chat-form").submit(function (e) {
          e.preventDefault();
          socket.emit('sendMsgToServer', $("#chat-input").val());
          $("#chat-input").val("");
      });
      socket.on('addToChat', function (data) {
          $("#chat-text").append('<div>' + data + '</div>');
      });

    //Function de generation des tableaux equipes
      var CreateTableauEquipe = function () {
          var pseudo = "";
          var equipe = "";
          var deplacement = "";
          var cssClass = "success";
          htmlString = "";
          htmlStringVoleur = "";
          for (var i in ListePlayer) {
              if (ListePlayer[i].room == player.room) {
                  if (ListePlayer[i].pseudo == player.pseudo) {
                      cssClass = "info";
                  }
                  else if (ListePlayer[i].equipe=="mechant") {
                      cssClass = "danger";
                  }
                  else {
                      cssClass = "success";
                  }
                  pseudo = ListePlayer[i].pseudo;
                  equipe = ListePlayer[i].equipe;
                  deplacement = ListePlayer[i].NbDeplacement;

                  if (ListePlayer[i].equipe == "gentil") {
                      htmlString = htmlString + "<tr class='" + cssClass + "'> <td>" + pseudo + " " + "</td> <td>" + equipe + "</td> <td>" + deplacement + "</td></tr> ";
                  }
                  else {
                      htmlStringVoleur = htmlStringVoleur + "<tr class='" + cssClass + "'> <td>" + pseudo + " " + "</td> <td>" + equipe + "</td> <td>" + deplacement + "</td></tr> ";
                  }

              }
          }
          $("#TableauEquipeFlic").html(htmlString);
          $("#TableauEquipeVoleur").html(htmlStringVoleur);

      }

	 
    //fonction pour trouver le nunero de la salle dans lequel est le joueur (sinon return null )
      var estDansUneSalle = function () {
          var L = 0;
          var H = 0;
          var xTest = 0;
          var yTest = 0;
          var numeroDeSalle = null;

          for (var i in listeSalle) {
              L = 0;
              H = 0;
              for (H; H < listeSalle[i].hauteurSalle; H++) { // pour chaque y
                  for (L; L < listeSalle[i].largeurSalle; L++) // pour chaque x
                  {
                      xTest = L + listeSalle[i].xDebut;
                      yTest = H + listeSalle[i].yDebut;
                      if (player.placement_x == xTest && player.placement_y == yTest) {
                          numeroDeSalle = i;
                      }

                  }
                  L = 0;
              }
          }//fin for
          return numeroDeSalle;
      }
	
      var testMetierDuClick = function (numeroSalle, cursorX, cursorY) {
          var L = 0;
          var H = 0;
          var xTest = 0;
          var yTest = 0;
          var autoriserDeplacement = true;
          var flagClickDansSalle = false;

          for (var i in listeSalle) { // pour chaque salle
              L = 0;
              H = 0;
              if (cursorX == listeSalle[i].xPorte && cursorY == listeSalle[i].yPorte || player.placement_x == listeSalle[i].xPorte && player.placement_y == listeSalle[i].yPorte) {
                  console.log("ceci est une porte: on autorise deplacement ici");
                  flagClickDansSalle = true;
                  autoriserDeplacement = true;
                  return autoriserDeplacement;
              }
              else {
                  for (H; H < listeSalle[i].hauteurSalle; H++) { // pour chaque y
                      L = 0;
                      for (L; L < listeSalle[i].largeurSalle; L++) // pour chaque x
                      {
                          xTest = L + listeSalle[i].xDebut;
                          yTest = H + listeSalle[i].yDebut;
                          console.log("x: " + xTest + " y: " + yTest);

                          //SI JOUEUR DEJA DANS LA SALLE 
                          if (cursorX == xTest && cursorY == yTest && numeroSalle == i) {
                              flagClickDansSalle = true;
                              console.log("droit de se deplacer ici car on se trouve dans la salle");
                              autoriserDeplacement = true;
                          }
                              // si le joueur est a lexterieur ou dans une autre salle 
                          else if (cursorX == xTest && cursorY == yTest) {
                              console.log("pas le droit de se deplacer ici car on se trouve a lexterieur")
                              autoriserDeplacement = false;
                              flagClickDansSalle = true;
                          }

                      }
                  }
                  // si on est dans une salle et qu'on ne clique pas dans une salle => on a pas le droit 
                  if (numeroSalle != null && flagClickDansSalle == false) {
                      autoriserDeplacement = false;
                  }
                  else if (numeroSalle == null && flagClickDansSalle == true) {
                      autoriserDeplacement = false;
                  }

                  console.log("autorisation deplacement = " + autoriserDeplacement);

              }//fin else

          } //fin boucle sur les salles 

          return autoriserDeplacement;

      }//fin fonction testmetierduclick

	
	
}