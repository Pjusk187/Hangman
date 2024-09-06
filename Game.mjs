
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}



import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';


const MESSAGES_TO_DISPLAY_TO_THE_USER = {
    PROMPT_FOR_CHAR:"Guess a char or the word : ",
    CONGRATULATION:"Congratulation, winer winner chicken dinner",
    GAME_OVER:"Game Over",
    PROMPT_PLAYER_TO_PLAY_AGAIN_MESSAGE: "Do you want to play again?"

}
const WORDS = ["cat", "dog", "goat", "snake", "cow", "horse", "chicken", "sheep", "monkey", "tiger", "lion", "wolf", "bison", "owl", "lepard", "crocodile", "aligator", "giraff", "eagel", "shark"]


let correctWord;
let numberOfCharInWord;
let guessedWord; 
let wordDisplay;
let isGameOver;
let wasGuessCorrect;
let wrongGuesses;
let correctGuess;

async function resetGameData() {
    correctWord=WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
    numberOfCharInWord = correctWord.length;
    wasGuessCorrect = false;
    guessedWord = "".padStart(correctWord.length, "_");
    wordDisplay = "";
    isGameOver = false;
    wrongGuesses = [];
    correctGuess = [];
    await startGame();
}



function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
    
        if (guessedWord[i] != "_") {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
   
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}
async function startGame() {
   
    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[wrongGuesses.length]);

        const answer = (await askQuestion(MESSAGES_TO_DISPLAY_TO_THE_USER.PROMPT_FOR_CHAR)).toLowerCase();

        if (answer == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        } else if (ifPlayerGuessedLetter(answer)) {

            let org = guessedWord;
            guessedWord = "";

            let isCorrect = false;
            for (let i = 0; i < correctWord.length; i++) {
                if (correctWord[i] == answer) {
                    guessedWord += answer;
                    isCorrect = true;
                } else {
                    guessedWord += org[i];
                }
            }

    if (correctGuess.includes(answer)){
        isCorrect = false;
    }

            if (isCorrect == true) {
                correctGuess.push(answer);
            }
            if (isCorrect == false) {
                wrongGuesses.push(answer);
            } else if (guessedWord == correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
            }
        }

        if (wrongGuesses.length == HANGMAN_UI.length) {
            isGameOver = true;
        }
        if (isGameOver == true || wasGuessCorrect){
            console.log(ANSI.COLOR.YELLOW + MESSAGES_TO_DISPLAY_TO_THE_USER.CONGRATULATION);
            console.log(ANSI.RESET);
            showPlayerStats();
            await askPlayerToPlayAgain();
        }
    }
}

async function askPlayerToPlayAgain() {
    const usersInput = await askQuestion(MESSAGES_TO_DISPLAY_TO_THE_USER.PROMPT_PLAYER_TO_PLAY_AGAIN_MESSAGE);
    
    if (usersInput == "yes") {
        resetGameData();
    } else {
        process.exit();
    }
}



await resetGameData();

console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);


console.log(MESSAGES_TO_DISPLAY_TO_THE_USER.GAME_OVER);
process.exit();

function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}


function showPlayerStats() {
    let res="";
    for (let i = 0;i < wrongGuesses.length; i++){
        res = res + "\n" + ANSI.COLOR.RED + wrongGuesses[i];
    }
    console.log(res);
}



