const singularSubjects = [
    'Mark',
    'Bob',
    'Steve',
    'Steven',
    'Ayesha',
    'Sarah',
    'Matthew',
    'Johanna',
    'Claire',
    'the bird',
    'Olivia',
    'the dog',
    'the animal',
    'the car',
    'the bear',
    'the fish',
    'the reptile',
    'the lizard',
    'the dinosaur'
];

const singularVerbs = [
    'likes',
    'hates',
    'loves',
    'bought',
    'wants',
    'chases'
];

const pluralVerbs = [
    'like',
    'hate',
    'love',
    'buy',
    'want',
    'chase'
];

const auxVerbs = [
    'does',
    'should',
    'will',
];

const intWords = [
    'what',
    'where',
    'who',
    'why',
    'when',
    'how'
]

/*
0 = singular subjects
1 = singular verbs
2 = auxVerb
3 = intWords

*/
const phrases = [
    [0, 1, 0, 100],
    [3, 2, 0, 4, 101]
];

//set word map
const wordMap = new Map();
wordMap.set(0, singularSubjects);
wordMap.set(1, singularVerbs);
wordMap.set(2, auxVerbs);
wordMap.set(3, intWords);
wordMap.set(4, pluralVerbs);
wordMap.set(100, ['.']);
wordMap.set(101, ['?']);

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generate() {
    const phraseObj = { 'phrase': '', 'map': new Map() };
    let phrase = '';
    let mapIndex = 0;
    const phraseIndex = Math.floor(Math.random() * phrases.length);

    phrases[phraseIndex].forEach((w, index) => {
        const wordArray = wordMap.get(w);
        const i = Math.floor(Math.random() * wordArray.length);
        const word = wordArray[i];
        //capitalize first word
        if (index == 0) {
            phrase += capFirst(word);
        }
        //last word should have no space after and a period
        else {
            phrase += word;
        }

        if (index < phrases[phraseIndex].length - 1) {
            //update map
            const mapWords = word.split(' ');
            mapWords.forEach(mapWord => {
                //if array is empty
                if (!phraseObj.map.has(mapWord.toLowerCase())) {
                    phraseObj.map.set(mapWord.toLowerCase(), []);
                }
                phraseObj.map.get(mapWord.toLowerCase()).push(mapIndex++);
            });
        }

        //add a space if there are more words left
        if (index < phrases[phraseIndex].length - 2) {
            phrase += ' ';
        }
    })
    phraseObj.phrase = phrase;
    console.log(phraseObj.map);
    return phraseObj;
}

function scramble(phrase) {
    let words = [];
    let i = 0;
    let word = '';
    for (const c of phrase) {
        if ((c == ' ') || (c == '\t') || (c == '\n') || (c == '!') || (c == '.') || (c == '?')) {
            if (word.length > 0) {
                words.push(word);
            }
            //reset word
            word = '';
        }
        else {
            //build word
            word += '' + c;
        }
    }
    if (word.length > 0) {
        words.push(word);
    }

    words = shuffleArray(words);

    let newPhrase = '';
    console.log(words);
    words.forEach((w, index) => {
        newPhrase += w;
        if (index < words.length - 1) {
            newPhrase += ' ';
        }
    })
    return newPhrase.toLowerCase();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

class Phrase {
    constructor() {
        const phraseObj = generate();
        this.phrase = phraseObj.phrase;
        this.map = phraseObj.map;
        this.scrambled = scramble(this.phrase);
        console.log(this.phrase);
    }

    getScrambled() {
        return this.scrambled;
    }

    toString() {
        return this.phrase;
    }

    setPhrase(newPhrase) {
        this.phrase = newPhrase;
        let i = 0;
        let word = '';
        this.map = new Map();
        for (const c of newPhrase) {
            if ((c == ' ') || (c == '\t') || (c == '\n') || (c == '!') || (c == '.') || (c == '?')) {
                //if array is empty
                if (word.length > 0) {
                    if (!this.map.has(word.toLowerCase())) {
                        this.map.set(word.toLowerCase(), []);
                    }
                    this.map.get(word.toLowerCase()).push(i++);
                }
                //reset word
                word = '';
            }
            else {
                //build word
                word += '' + c;
            }
        }

        //if array is empty
        if (word.length > 0) {
            if (!this.map.has(word.toLowerCase())) {
                this.map.set(word.toLowerCase(), []);
            }
            this.map.get(word.toLowerCase()).push(i++);
        }

        this.scrambled = scramble(this.phrase);
        console.log(this.map);
    }

    check(phrase) {
        let currWord = '';
        let i = 0;
        let correct = 0;
        //unique index set
        const set = new Set();
        //iterate over every character
        for (const c of phrase) {
            //if empty space
            if ((c == ' ') || (c == '\t') || (c == '\n') || (c == '!') || (c == '.') || (c == '?')) {
                //check word
                //move to lowercase to ensure it is case insensitive
                currWord = currWord.toLowerCase();
                //console.log(currWord + " " + this.map.get(currWord));
                if (this.map.has(currWord)) {
                    this.map.get(currWord).forEach(wordIndex => {
                        if (!set.has(wordIndex) && i == wordIndex) {
                            console.log('match');
                            set.add(wordIndex);
                            correct++;
                        }
                        else {
                            //console.log('nope');
                        }
                    });
                }
                //reset word
                if (currWord.length > 0) {
                    currWord = '';
                    i++;
                }
            }
            else {
                //build word
                currWord += '' + c;
            }
        }
        //check word
        // //move to lowercase to ensure it is case insensitive
        // currWord = currWord.toLowerCase();
        // console.log(currWord + " " + this.map.get(currWord));
        // if (this.map.get(currWord) == i) {
        //     console.log('match');
        //     set.add(i);
        //     correct++;
        // }

        //console.log('got ' + (correct) + "/" + i + " words");
        return correct / i;
    }
}
module.exports = {
    generate,
    Phrase,
}