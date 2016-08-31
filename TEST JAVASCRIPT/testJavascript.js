//fonction pour trouver le nunero de la salle dans lequel est le joueur (sinon return null )
var estDansUneSalle = function (){
        	var L =0;
         var H=0; 
         var xTest=0;
         var yTest=0;
         
         var numeroDeSalle=null;
	
	        for(var i in listeSalle)
	        {
	        	    L=0;
	        	    H=0;
                for(H; H<listeSalle[i].hauteur; H++) { // pour chaque y
     	                 for( L; L<listeSalle[i].largeur; L++) // pour chaque x
                      { 
                      	    xTest=L+listeSalle[i].xDebut;
                       	   yTest=H  + listeSalle[i].yDebut;
                       	   if(joueur.nowx==xTest &&                  joueur.nowy==yTest)
                       	   {
                       	        numeroDeSalle=i;
                       	   }
             	             
                       	}
                  	L=0;
                	}
	        }//fin for
	        return numeroDeSalle;
	
}

var joueur ={ // coordonnes click du joueur 
         nowx: 0,
         nowy:1,
	        x: 1,
	        y: 1,
}

var salle1 = {
	         hauteur : 3, 
	         largeur : 2, 
	         xDebut: 0, 
	         yDebut:0,
	         xPorte:1,
	         yPorte:0,
}
var salle2 = {
	         hauteur : 3, 
	         largeur : 2, 
	         xDebut: 10, 
	         yDebut:10,
	         xPorte:10,
	         yPorte:10,
}
var listeSalle= [];
listeSalle.push(salle1);
listeSalle.push(salle2);

//ici le joueur vient de  cliquer...

// on cherche s''il est dans une salle actuellement ( return numero de salle si oui, null si non)
var numeroSalle= estDansUneSalle();
console.log(numeroSalle);

console.log(listeSalle[0]);

//si le joueur nest pas dans une salle alors il a pas le droit de bouger dans une piece : sauf dans la porte

// si le joueur est dans une salle il a pas le droit de bouger en dehors que dans la salle


//si joueur dans salle mais que le click est en dehors de la salle alors on autorise pas deplacement 

var testMetierDuClick = function (){
	    var L =0;
        var H=0; 
        var xTest=0;
        var yTest=0;
        var autoriserDeplacement = true; 
	    var flagClickDansSalle=false;
	
	for ( var i in listeSalle){ // pour chaque salle
	   L=0;
       H=0;
        if(joueur.x == listeSalle[i].xPorte && joueur.y== listeSalle[i].yPorte || joueur.nowx== listeSalle[i].xPorte && joueur.nowy==listeSalle[i].yPorte)
        {
         	        	    console.log("ceci est une porte: on autorise deplacement ici");
         	        	    flagClickDansSalle=true;
         	        	    autoriserDeplacement=true;
         	        	    return  autoriserDeplacement;
        }
        else{
	             for(H; H<listeSalle[i].hauteur; H++)
	             { // pour chaque y
	                  L=0;
	                for( L; L<listeSalle[i].largeur; L++) // pour chaque x
                    {
             	       xTest=L+listeSalle[i].xDebut;
             	       yTest=H  + listeSalle[i].yDebut;
         	           console.log("x: "+ xTest + " y: " + yTest);
         	        
         	           //SI JOUEUR DEJA DANS LA SALLE 
         	           if(joueur.x==xTest && joueur.y==yTest &&  numeroSalle==i )
         	            {   
         	        	    flagClickDansSalle=true;
         	           	    console.log("droit de se deplacer ici car on se trouve dans la salle");
         	           	    autoriserDeplacement=true;
         	            } 
         	            // si le joueur est a lexterieur ou dans une autre salle 
         	            else if (joueur.x==xTest &&  joueur.y==yTest ){
         	        	      console.log("pas le droit de se deplacer ici car on se trouve a lexterieur")
         	        	      autoriserDeplacement=false;
         	        	      flagClickDansSalle=true;
         	            }
         	     
         	         }
	         
	             }
	            // si on est dans une salle et qu'on ne clique pas dans une salle => on a pas le droit 
	             if(numeroSalle !=null &&  flagClickDansSalle==false)
                { 
	                 autoriserDeplacement=false ; 
	            }
	            else if (numeroSalle == null && flagClickDansSalle == true)
	             {
		            autoriserDeplacement=false;
                }

	    console.log("autorisation deplacement = "+ autoriserDeplacement);
	         
	         }//fin else
	     
	}
	
	return autoriserDeplacement;
	// si on est danq une salle 

}//fin fonction testmetierduclick

testMetierDuClick();










