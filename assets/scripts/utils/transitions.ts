export const TRANSITIONS ={

    fr:{
        answers : {
            correct:["Bravo ! C'était la bonne réponse.", "Excellent. Tu es le meilleur !", "Pas mal ! Boss."],
            wrong:["Oh non !", "Tu l'as manqué de peu !", "Oh ! mauvaise réponse."]
        },

        rounds : [
            "Tu es un bon joueur… On y va pour la suite, remportes cette partie et sois le champion",
            "Félicitations, prêt pour la partie suivante ?",
            "Champion, prêt pour le quizz?",
            "J’aimerais bien tester tes connaissances en assainissement avec la manche 1 image 4 mots. On y va !!!",
            "Penses-tu pouvoir gagner la prochaine manche contre ton adversaire ?"
        ],

        levels: [
            "Bravooooo, tu viens de débloquer le second niveau. Es-tu prêt pour le niveau intermédiaire?",
            "Super, tu as d’excellentes notions en assainissement. Next step",
            "Les questions liées à l’assainissement semblent ne pas avoir de secrets pour toi. Voyons si le niveau moyen nous le confirme",
            "Niveau difficile !!! tu es à quelques pas d’être l’ultra champion de l’assainissement. C’est parti"
        ],
        wc : [
            "Tu es vraiment chanceux!!! Des bonus te sont accordés. Récupère les en jouant au WC de la fortune"
        ],
        sanitize:[
            `Le savais-tu? Les poop coins que tu as collecté tout au long du jeu peuvent te permettre d’investir dans l’assainissement et le développement durable de ta ville.
            Tu es curieux de savoir à quoi peut ressembler ta ville s’il y avait moins de pollution?C’est très simple, investis tes gains soit dans le biocarburant, ou dans l’agriculture bio ou encore dans le bio énergie. Tu peux investir dans tous les 3 secteurs si bien sûr tu as assez de pièces.
            Alors n’attends plus car le sort de ta ville ne dépend que de toi.`
        ],
        sanitize_no_coins:[
            `Tu n'as pas pu améliorer l’assainissement de ta ville par manque de pièces? Pas d’inquiétude! Tu as la possibilité de repartir jouer et de collecter plus de pièces pour achever le nettoyage de ta ville. A toi de jouer champion.`
        ],
        
        failed:[
            "Tout n’est pas perdu. Tu peux encore gagner en rejouant la partie"
        ]

    }
}
