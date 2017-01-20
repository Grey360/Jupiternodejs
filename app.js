var app = require('express')(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
fs = require('fs');

//gestion des équipes
team1_croiseur = 3;
team2_croiseur = 3;
team1_score = 0;
team2_score = 0;

team1Callisto_score=0;
team2Callisto_score=0;

team1Europa_score=0;
team2Europa_score=0;

team1Ganymede_score=0;
team2Ganymede_score=0;

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo, team) {
  // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
  socket.on('nouveau_client', function(pseudo, score, team) {
	pseudo = ent.encode(pseudo);
	socket.pseudo = pseudo;
	socket.multi = 1;
	socket.score=0;
  	socket.auto=0;
	socket.croiseur=0;
	
	console.log("nouveau client connecte :", pseudo, team);
    score = score;
    team=team;
    socket.team= team;
    socket.broadcast.emit('nouveau_client', pseudo, score, team);
   socket.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
   socket.emit('clic_Europa', team1Europa_score,team2Europa_score);
   socket.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
  });



  // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
  socket.on('message', function (message, score, team) {
    message = ent.encode(message);
    score = ent.encode(score);
    team = ent.encode(team);
    socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message, score: score, team: team});
  });
  socket.on('score', function (score, team, pseudo) {
    score = ent.encode(score);
    socket.broadcast.emit('score', {pseudo: pseudo, score: score, team: team});
  });

  socket.on('nouveau_multi', function () {

	if (socket.score >= 50 * (socket.multi*socket.multi))
	{
    		
		socket.score = socket.score - (50*(socket.multi*socket.multi));
		socket.multi += 1;
	}

	socket.emit('nouveau_multi', socket.multi, socket.score);

  });


  socket.on('clic_Callisto', function (team) {
    team=ent.encode(team);

	if(team == "TERRANS")
		team1Callisto_score +=socket.multi;
	else
		team2Callisto_score +=socket.multi;
		
	socket.score += socket.multi;
	console.log("TERRANS", team1Callisto_score);
	console.log("ZERGS", team2Callisto_score);
	message = "test";

   socket.broadcast.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
   socket.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
   socket.emit('nouveau_score', socket.score);
	console.log("score emit");
  });


socket.on('auto_C', function (team) {
         team=ent.encode(team);

         if (socket.score >= 200 + (socket.auto*socket.auto*100))
         {
          socket.score= socket.score - (100 + (socket.auto*socket.auto*100));
          socket.auto +=1;
          socket.emit('nouveau_auto', socket.auto);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
                  team1Callisto_score +=socket.multi;
                else
                  team2Callisto_score +=socket.multi;
              
                socket.score += socket.multi;
                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
                socket.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });





  socket.on('clic_Europa', function (team) {
    team=ent.encode(team);
   console.log("test clic clic_Europa");

  if(team == "TERRANS")
    team1Europa_score +=socket.multi;
  else
    team2Europa_score +=socket.multi;
    
  socket.score += socket.multi;
  
   socket.broadcast.emit('clic_Europa', team1Europa_score,team2Europa_score);
   socket.emit('clic_Europa', team1Europa_score,team2Europa_score);
   socket.emit('nouveau_score', socket.score);
  console.log("score emit");
  });


socket.on('auto_E', function (team) {
         team=ent.encode(team);

         if (socket.score >= 200 + (socket.auto*socket.auto*100))
         {
          socket.score= socket.score - (100 + (socket.auto*socket.auto*100));
          socket.auto +=1;
          socket.emit('nouveau_auto', socket.auto);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
                  team1Europa_score +=socket.multi;
                else
                  team2Europa_score +=socket.multi;
              
                socket.score += socket.multi;
                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Europa', team1Europa_score,team2Europa_score);
                socket.emit('clic_Europa', team1Europa_score,team2Europa_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });


socket.on('clic_Ganymede', function (team) {
    team=ent.encode(team);

  if(team == "TERRANS")
    team1Ganymede_score +=socket.multi;
  else
    team2Ganymede_score +=socket.multi;
    
  socket.score += socket.multi;
  console.log("TERRANS", team1Callisto_score);
  console.log("ZERGS", team2Callisto_score);
  message = "test";

   socket.broadcast.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
   socket.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
   socket.emit('nouveau_score', socket.score);
  console.log("score emit");
  });


socket.on('auto_G', function (team) {
         team=ent.encode(team);

         if (socket.score >= 200 + (socket.auto*socket.auto*100))
         {
          socket.score= socket.score - (200 + (socket.auto*socket.auto*100));
          socket.auto +=1;
          socket.emit('nouveau_auto', socket.auto);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
                  team1Ganymede_score +=socket.multi;
                else
                  team2Ganymede_score +=socket.multi;
              
                socket.score += socket.multi;
                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
                socket.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });

socket.on('croiseur_G', function (team) {
         team=ent.encode(team);

         if (socket.score >= 400 + (socket.croiseur*socket.croiseur*200))
         {
          socket.score= socket.score - (400 + (socket.croiseur*socket.croiseur*200));
          socket.croiseur +=1;
          socket.emit('nouveau_croiseur', socket.croiseur);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
		{
                  team2Ganymede_score -=socket.multi*team1_croiseur;
			if (team2Ganymede_score <0)
				team2Ganymede_score=0;	
		}
                else
		{
                  team1Ganymede_score -=socket.multi*team2_croiseur;
              		if (team1Ganymede_score <0)
				team1Ganymede_score=0;	
		}

                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
                socket.emit('clic_Ganymede', team1Ganymede_score,team2Ganymede_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });socket.on('croiseur_C', function (team) {
         team=ent.encode(team);

         if (socket.score >= 400 + (socket.croiseur*socket.croiseur*200))
         {
          socket.score= socket.score - (400 + (socket.croiseur*socket.croiseur*200));
          socket.croiseur +=1;
          socket.emit('nouveau_croiseur', socket.croiseur);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
		{
                  team2Callisto_score -=socket.multi*team1_croiseur;
			if (team2Callisto_score <0)
				team2Callisto_score=0;	
		}
                else
		{
                  team1Callisto_score -=socket.multi*team2_croiseur;
              		if (team1Callisto_score <0)
				team1Callisto_score=0;	
		}

                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
                socket.emit('clic_Callisto', team1Callisto_score,team2Callisto_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });


socket.on('croiseur_E', function (team) {
         team=ent.encode(team);

         if (socket.score >= 400 + (socket.croiseur*socket.croiseur*200))
         {
          socket.score= socket.score - (400 + (socket.croiseur*socket.croiseur*200));
          socket.croiseur +=1;
          socket.emit('nouveau_croiseur', socket.croiseur);
          socket.emit('nouveau_score', socket.score);


              setInterval(function(){ 

                if(socket.team == "TERRANS")
		{
                 	 team2Europa_score -=socket.multi*team1_croiseur;
			 if (team2Europa_score <0)
				team2Europa_score=0;	
		}                
		else
		{
                  team1Europa_score -=socket.multi*team2_croiseur;
              		if (team1Europa_score <0)
				team1Europa_score=0;	
		}
                console.log("TERRANS", team1Callisto_score);
                console.log("ZERGS", team2Callisto_score);
            

                socket.broadcast.emit('clic_Europa', team1Europa_score,team2Europa_score);
                socket.emit('clic_Europa', team1Europa_score,team2Europa_score);
                socket.emit('nouveau_score', socket.score);

            
      
      },
     2000);

    }
    
    

  });



});

server.listen(8080);
