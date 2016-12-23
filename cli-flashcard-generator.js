const inquirer = require('inquirer');
const dataImport = require('./flashcard_import.js');

//============VARIABLES / CONSTANTS===========================================================
let flashCardArr = [];
let clozeArr = [];
let cardData = dataImport.data();
let FlashCard = dataImport.flash(); //flashcard constructor
let ClozeCard = dataImport.cloze(); //cloze constructor

//================FUNCTIONS===================================================================

//function to generate flashcards
const createFlashCards = (data) => {

    data.forEach((element, ind) => {

        let card = new FlashCard(element['question'], element['answer']);
        flashCardArr.push(card);

        let cloze = new ClozeCard(element['cloze'], element['answer']);
        clozeArr.push(cloze);

    });
}

//determine whether user will be playing regular or cloze flashcards
const gameType = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'game',
        message: 'What type of flashcard game do you want to play?',
        choices: [
            'Regular',
            'Cloze'
        ]
    }]).then(function(answers) {

    	let card = newCard(answers['game']);
    	displayCard(card);

    });

}

const displayCard = (card) => {

	let flash = card.next();

    if (flash.done === false){
    	inquirer.prompt(flash.value)
    	.then((ans) => {

    		displayCard(card);

    	});
    } else {
    	console.log('Congrats, you went through all of the flash cards!');
    }

}

//play either Regular or Cloze flashcard game
//SETUP AS AN ES6 GENERATOR...
function* newCard(type) {

        //determine array that will be used to control game
        let cardType = type;
        let data = (cardType === 'Regular') ? flashCardArr : clozeArr;
        let promptArray = [];
        let cards = data.length;

        //create an array of inquirer prompts with flash / cloze card data
        for (let i = 0; i < cards; i++) {
            //capture answer and question
            let answer = data[i]['answer'].toLowerCase();
            let question = (type === 'Regular') ? data[i]['text'] : data[i]['text'].replace(/\$/g, '...');

            //build inquirer input and push to an array of flashcards to be iterated through later
            let newQuestion = {
                type: 'input',
                name: 'question',
                message: question,
                validate: function(value) {
                    let resp = value.toLowerCase().trim();
                    if (resp === answer) {
                        console.log('\nYou were correct!');
                    } else {
                        console.log('\nNope, the correct answer is: ');
                        console.log(answer);
                    }
                    return true
                }
            }
            yield newQuestion
        }

    }
    /*
    let newCard = (type) => {
     
        //determine array that will be used to control game
        let cardType = type;
        let data = (cardType === 'Regular') ? flashCardArr : clozeArr;
        let promptArray = [];
        let cards = data.length;

        //create an array of inquirer prompts with flash / cloze card data
        for (let i = 0; i < cards; i++) {
        	//capture answer and question
            let answer = data[i]['answer'].toLowerCase();
            let question = (type === 'Regular') ? data[i]['text'] : data[i]['text'].replace(/\$/g, '...');

            //build inquirer input and push to an array of flashcards to be iterated through later
            let newQuestion = {
            	type: 'input',
            	name: 'question',
            	message: question,
            	validate: function(value){
            		let resp = value.toLowerCase().trim();
            		if (resp === answer){
            			console.log('\nYou were correct!');
            		}
            		else {
            			console.log('\nNope, the correct answer is: ');
            			console.log(answer);
            		}
            		return true
            	}
            }
            promptArray.push(newQuestion);
        }

        //display the flash / cloze card
        displayCard(promptArray);
    }
    */


//========================GAME PLAY==========================================================

cardData.then((data) => {

    //create flash cards and then send to game module
    createFlashCards(data);

    //begin CLI game
    gameType();

}).catch((err) => {

    console.log(err);

});
