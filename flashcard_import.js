/*  ========HOMEWORK GUIDLINES - CODE BELOW THIS SECTION ==============================================================================

Create a new GitHub repository, named Flashcard-Generator or something similar.
 Clone this to your local drive.
Create a BasicFlashcard constructor. It should accept front and back arguments.
Create a ClozeFlashard constructor. It should accept text and cloze arguments.

ClozeFlashcard should have a method that returns only the cloze-deleted portion of the text.

You are free to experiment with the other details of your implementation, but you must store 
at least one property, and equip cloze-deleted flashcards with at least one additional method.

Your application should provide a way for users to save any flashcards they might create to a text file.

What data should you save?

Where might it make sense to add a method for saving flashcards?

As a bonus, create a frontend that uses your flashcard data. This front-end can be either a 
command-line prompt or a browser-based application.

When passed a basic flashcard, this program should present the front text; wait for user input;
 and then display the back text.

When passed a cloze-deleted flashcard, this program should present the partial text; wait for user input; 
and then display the full text.

The backend will essentially constitute an API that allows users to create two types of flashcards.
Basic flashcards, which have a front ("Who was the first president of the United States?"), and a back 
("George Washington").

Cloze-Deleted flashcards, which present partial text ("... was the first president of the United States."), and the 
full text when the user requests it ("George Washington was the first president of the United States.")

====================================END OF HOMEWORK GUIDLINES===================================================
*/

//===================Required Libararies==========================
let mysql = require('mysql');


//==================Connect to MySQL==============================
let db = 'flashcards_db';
let table = 'flashcards';

//establish DB connection
let con = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'MGoblue3!',
    database: db

});

con.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connection established');
});

//import data for flashcards...selecting all as dataset will be small
const dataImport = () => {
    return new Promise((resolve, reject) => {

        con.query('SELECT * FROM ' + table, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

    });
}

//===================CONSTRUCTORS AND OTHER VARIABLES==============

//constructor to create a flash card
const makeFlash = () => {
    return function FlashCard(front, back) {
        this.text = front;
        this.answer = back;
    }
}

//constructor to created a closed card
const makeCruze = () => {
    return function ClozeCard(text, cloze) {
        this.text = text; //partial text
        this.answer = cloze; //remaining text to be revealed
    }
}


//===============EXPORTS==========================================
let exp = module.exports = {};

exp.data = dataImport;
exp.flash = makeFlash;
exp.cloze = makeCruze;

//================================================================
