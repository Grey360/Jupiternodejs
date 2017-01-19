/*Exemple jusqu'à la partie 10 */	
var $bouton = document.getElementById("bouton"),
$multiplicateur = document.getElementById("multiplicateur"),
$score = document.getElementById("score"),
score = 0,
nbMultiplicateur = 1;



function afficherScore() 
{
	$score.innerHTML = "Score : " + score;
}

function afficherNbMultiplicateur()
{
	$multiplicateur.innerHTML = "Multiplicateur x" + nbMultiplicateur + " (prix du prochain : " + prix() + ")";
}

function clic() 
{
	score = score + nbMultiplicateur;
	afficherScore();
}

function prix() 
{
	return 50 * nbMultiplicateur * nbMultiplicateur;
}

function acheterMultiplicateur() 
{
	if (score >= prix()) 
	{
		score = score - prix();
        	nbMultiplicateur = nbMultiplicateur + 1;
        	afficherNbMultiplicateur();
        	afficherScore();
	} 
	else
	{
        	alert("Votre score est insuffisant !");
	}
}

$bouton.onclick = clic;
$multiplicateur.onclick = acheterMultiplicateur;
afficherScore();
afficherNbMultiplicateur();

/*Cadeau : http://a-pellegrini.developpez.com/tutoriels/coding-style/ */	
