/**
 * Created by yotam on 25/6/2015.
 */
//import {bind} from 'angular2/di';
//var _ = require('lodash');
import _ = require('lodash');

function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i);
    unicodeString += theUnicode + ",";
  }
  return unicodeString;
}

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  var key = keys[ keys.length * Math.random() << 0]
  console.log("key",key);
  return "" + key;
};

export declare class Error {
  public name: string;
  public message: string;
  public stack: string;
  constructor(message?: string);
}

export class Exception extends Error {

  constructor(public message: string) {
    super(message);
    this.name = 'Exception';
    this.message = message;
    this.stack = (<any>new Error()).stack;
  }
  toString() {
    return this.name + ': ' + this.message;
  }
}

export enum PosEnum  {
  FIRST,
  MIDDLE,
  LAST
}

export var SoundEnum  = {
  KAMATZ : String.fromCharCode(1464),
  PATAH : String.fromCharCode(1463),
  HIRIK : String.fromCharCode(1460),
  KUBUZ : String.fromCharCode(1468),
  SHURUK : String.fromCharCode(1467),
  SEGOL : String.fromCharCode(1462),
  TZERE : String.fromCharCode(1461),
  SHVA : String.fromCharCode(1456),
  HOLAM : String.fromCharCode(1465),
  NONE : null
};

var LetterEnum = {
  ALEF :  String.fromCharCode(1488),
  BEIT :  String.fromCharCode(64305),
  VEIT :  String.fromCharCode(1489),
  GIMEL : String.fromCharCode(1490),
  DALET : String.fromCharCode(1491),
  HE : String.fromCharCode(1492),
  VAV : String.fromCharCode(1493),
  ZAIN : String.fromCharCode(1494),
  HET : String.fromCharCode(1495),
  TET : String.fromCharCode(1496),
  YUD : String.fromCharCode(1497),
  KHAF : String.fromCharCode(1499),
  KHAF_SOFIT : String.fromCharCode(1498),
  KAF : String.fromCharCode(64315),
  LAMED : String.fromCharCode(1500),
  MEM : String.fromCharCode(1502),
  MEM_SOFIT : String.fromCharCode(1501),
  NUN : String.fromCharCode(1504),
  NUN_SOFIT : String.fromCharCode(1503),
  SAMEH : String.fromCharCode(1505),
  AIN : String.fromCharCode(1506),
  PE : String.fromCharCode(64324),
  FE : String.fromCharCode(1508),
  FE_SOFIT : String.fromCharCode(1507),
  TZADIK : String.fromCharCode(1510),
  TZADIK_SOFIT : String.fromCharCode(1509),
  KOF : String.fromCharCode(1511),
  RESH : String.fromCharCode(1512),
  SHIN : String.fromCharCode(64298),
  SIN : String.fromCharCode(64299),
  SHIN_SOFIT : String.fromCharCode(1513),
  TAF : String.fromCharCode(1514),
  THAF : String.fromCharCode(64330),



};

var EMPHASIS = String.fromCharCode(1468);

function getSound (char){
  return _.findKey(SoundEnum, function(value) {
    return value === char;
  });
}
function getLetterName(char){
  return _.findKey(LetterEnum, function(value) {
    return value === char;
  });
}
function isEmphasis (char){
  return char === EMPHASIS;
}
function popRandomLetter(lettersCollection){
  var key =  getLetterName(_.sample(lettersCollection));
  delete lettersCollection[key];
  return key;
}
function popRandomSound(soundsCollection){
  return _.sample(soundsCollection);

}

interface ILetter {
  name : string;
  pos : PosEnum;
  sound : string;
  symbol : string;
  has (constraints) : boolean;
}

interface IWord {
  level : number;
  letters : Array<ILetter>;
  str : string;
  imgPath : string;
  has (constraints) : boolean;

}

interface IVocabularyGenerator {
  generateGameConstraints (game : string, params: any) : any[];
  filter(vocabulary : Array<Word>, wConstraints : Array<IWordConstraint>, wordsCount : number) : Array<Word>;
  groupWords (vocabulary : Array<Word>, groupingConstraints  :GroupConstraint) : Array<any>;
}

interface ILetterConstraint {
  pos? : PosEnum;
  name? : string;
  sounds? : any;
}

interface IWordConstraint {
  level : number,
  lettersConstraints : Array<ILetterConstraint>
}

interface IGroupConstraint {
  wordsAmount? : number;
  constraint? : IWordConstraint;
  children? : Array<{
    group :IGroupConstraint
    copies : number
  }>
}

export class GroupConstraint implements IGroupConstraint {
  constructor (public wordsAmount : number,public constraint : IWordConstraint,
               public children : Array<{copies : number, group : IGroupConstraint}> = null) {

  }
  addGroup (group : any) {
    this.children.push(group);
  }
}

export class WordConstraint implements IWordConstraint {
  constructor (public level : number, public lettersConstraints : Array<ILetterConstraint> = null) {

  }

  toString () {
    var str = "";
    for (let letter of this.lettersConstraints) {
      str += letter.toString();
    }
    return str;
  }
}

export class LetterConstraint implements ILetterConstraint {
  constructor (public name: string = null, public pos : PosEnum = null, public sounds : any = null) {
    if (name === "?") {
      this.name = randomProperty(LetterEnum);
      console.log("randomly generated letter constraint - name: ",this.name);
    }

  }

  toString() {
    return this.name + ", " + this.sound + ", " + this.pos;
  }
}

export class Letter implements ILetter {
  symbol : string;

  constructor (public name: string, public pos : PosEnum, public sound : string) {
    var soundStr = SoundEnum[sound] ? SoundEnum[sound] : "";
    this.symbol = LetterEnum[name] + soundStr;
  }

  /**
   * A letter passes the constraints if all the specified options are fulfilled.
   * (letter's name, position in word, and it's sound)
   * @param constraint Contains requirements on the letter.
   * @returns {boolean}
   */
  has(constraint : ILetterConstraint) {
    var hasSound = false;
    var pos = (typeof PosEnum[constraint.pos] !== 'undefined') ? (this.pos === constraint.pos) : true;
    if (_.isArray(constraint.sounds)){
      for (let sound of constraint.sounds){
        if (this.sound === sound){
          hasSound = true;
          break;
        }
      }
    } else { // constraint sounds is a string
      hasSound = constraint.sounds ? (this.sound === constraint.sounds) : true;
    }
    var name = constraint.name ? (this.name === constraint.name) : true;
    return (pos && hasSound && name);
  }

  toString() {
    var soundStr = SoundEnum[this.sound] ? SoundEnum[this.sound] : "";
    return (LetterEnum[this.name]) + soundStr + ", in " + PosEnum[this.pos];
  }

  static testConstraint() {

    var l = new Letter("ALEF",PosEnum.MIDDLE,"SEGOL");
    var l2 = new Letter("BEIT",PosEnum.FIRST,"KAMATZ");
    var constraint = new LetterConstraint("?",PosEnum.FIRST,"KAMATZ");
    console.log("l.symbol",l.toString());
    console.log("constraint",constraint);
    console.log("l.has(constraint)",l.has(constraint));
    console.log("l2.has(constraint)",l2.has(constraint));

  }

}

export class Word implements IWord {

  constructor (public str: string, public letters : Array<ILetter>, public level : number, public imgPath: string = null, metaRules : any = null) {

  }

  /**
   * Passes the constraints if it has all the constraints specified in the wConstraint object.
   * Constraints are :
   *  - the difficulty level of the word.
   *  - at least one of the word's letters in the Word must satisfy each LetterConstraint object.
   * @param wConstraint
   * @returns {boolean}
   */
  has(wConstraint : IWordConstraint) {
    var level = (wConstraint.level > 0) ? (this.level === wConstraint.level) : true;
    var lettersValid = true;
    if (wConstraint.lettersConstraints && wConstraint.lettersConstraints.length){
      for (let constraint of wConstraint.lettersConstraints){
        let constraintPass = false;
        for (let letter of this.letters){ //one of the letters must satisfy the constraint
          if (letter.has(constraint)){
            constraintPass = true ;
            break;
          }
        }
        if (!constraintPass){
          lettersValid = false; // all constraints must pass
          break;
        }
      }
    }
    return (level && lettersValid);
  }

  toString() {
    return this.str + " - image path : " +this.imgPath;
  }

  static testConstraint() {

    var w = new Word("אָבֶ",[new Letter("ALEF",PosEnum.FIRST,"PATAH")],1);
   // var constraint = new WordConstraint(1,[]);
    var constraint2 = new WordConstraint(1, [new LetterConstraint("ALEF")]);
    var constraint3 = new WordConstraint(1, [new LetterConstraint("ALEF",PosEnum.FIRST,"PATAH")]);
    var constraint4 = new WordConstraint(1, [new LetterConstraint("BEIT")]);
    var constraint5 = new WordConstraint(1, [new LetterConstraint("ALEF",PosEnum.MIDDLE)]);
    var constraint6 = new WordConstraint(1, [new LetterConstraint("ALEF",null,"KUBUZ")]);

   // console.log("w.has(constraint)",w.has(constraint));
    console.log("w.has(constraint)",w.has(constraint2));
    console.log("w.has(constraint)",w.has(constraint3));
    console.log("w.has(constraint)",!w.has(constraint4));
    console.log("w.has(constraint)",!w.has(constraint5));
    console.log("w.has(constraint)",!w.has(constraint6));
    console.log("toUnicode",toUnicode("ט"));


  }

}
// class which generates variety of vocabularies according to constraints on the words.
export class VocabularyGenerator implements IVocabularyGenerator {

  constructor () {
  }

  generateGameConstraints (game : string, paramsObj: any = null) {
    // a memory game constraints descriptor contains:
    // pairsNum , availableLetters (optional) , availableSounds (optional), array of combined letter constraints(optional).
    // for each pair, generate a word constraint with a different opening letter. and with one
    // of the available sounds.

    // Words constraints:
    var memoryGameCT:GroupConstraint = new GroupConstraint(null,null,[]);

    var position = paramsObj.position;

    var lettersBox = _.pick(_.clone(LetterEnum),paramsObj.lettersToSearch);
    console.log("lettersBox", lettersBox);
    for (var i = 0; i < paramsObj.pairsNum; i++){
      let letter = popRandomLetter(lettersBox);
      let sound = popRandomSound(paramsObj.sounds);
      let letterCT = new WordConstraint(1, [new LetterConstraint(letter,position,sound)]);
      let groupCT:GroupConstraint = new GroupConstraint(2,letterCT);
      memoryGameCT.addGroup({copies : 1,group : groupCT});

    }



   // var f_patah_ct = new WordConstraint(1, [wildcard_patah_lc]);

    // for each pair, generate a word constraint with a different opening letter.

/*    var f_a_patah_ct = new WordConstraint(1, [alefCT]);
    var f_b_patah_ct = new WordConstraint(1, [beitCT]);
    var f_c_patah_ct = new WordConstraint(1, [gimelCT]);*/





/*    var nested_f_patah_2g:GroupConstraint = new GroupConstraint(null,null,
        [{copies : 1,group : f_a_patah_2g},{copies : 1,group : f__b_patah_2g},{copies : 1,group : f_c_patah_2g}]);*/

    return memoryGameCT;

  }
  /**
   *
   * @param vocabulary A set of words to filter
   * @param wConstraints Array of constraints tha each of the filtered words should pass.
   * @param wordsCount Number of words that function should return
   * @returns {Array} All words that passed all of the given constraints.
   */
  filter (vocabulary : Array<Word>, wConstraints : Array<IWordConstraint>,
          wordsCount : number = null, copyWord :boolean = false ) {
    if (wordsCount === 0){
      throw new Exception("Max words must be greater than zero." );

    }
    var filteredWords : Array<Word> = [];
    var count = 0;
    var max = wordsCount;
    for (let word of vocabulary){ // iterate over all words in the given vocabulary.
      let wordPasses = true;
      for (let constraint of wConstraints){
        if (!word.has(constraint)){
          wordPasses = false;
          break;
        }
      }
      if (wordPasses){// add a word which passes all the constraints
        //var copyWord = true;
        if (copyWord && max){
          filteredWords = _.fill(Array(max), word);
          break;
        }
        filteredWords.push(word);
        count++;
        if (max !== null && (count >= max)){
          break;
        }
      }
    }
    if (filteredWords.length < wordsCount  ){
      throw new Exception("Couldn't find enough words. only " + filteredWords.length + " / "+ wordsCount );
    }
    return filteredWords;
    //

  }

  groupWords (vocabulary : Array<Word>, groupingConstraints  :GroupConstraint)  {
    var self = this;
    function recuresivelyGroup(node : IGroupConstraint, accWC : Array<WordConstraint>,parentArr : Array<any>) {
      // if there is a w.c. , add it to the accumulatedWC.
      var groupWC = _.clone(accWC, true)
      if (node.constraint) {
        groupWC.push(node.constraint)
      }

      // if there are no childeren - this is a leaf :
      // generate all the words in wordsAmount with the given accumulatedWC, and add it to the given parentArray

      if (!node.children) {
        //console.log("try to create group with "+ node.wordsAmount + " words.");
        //console.log(" accWC " + VocabularyGenerator.printConstraints(groupWC));
        //console.log(" vocabulary " + vocabulary);
        var groupWords = self.filter(vocabulary,groupWC,node.wordsAmount);
        //parentArr.push(groupWords);
        vocabulary = _.difference(vocabulary,groupWords);
        //console.log("created group: "+ groupWords);
        //console.log("vocabulary left: "+ vocabulary);

        return groupWords;
      } else {
        //console.log("iterating over each of "+node.children.length+" children");
        for (let child of node.children) {
          //console.log("creating  "+child.copies+" copies of the group");
          for (var i = 0; i < child.copies; i++) {
            //console.log("COPY "+ (i+1));

            parentArr.push(recuresivelyGroup(child.group, groupWC, parentArr));
          }
        }
        return parentArr;
      }
      // if there are children :
      // for each of the childrens
      // create a new children array in the result Array and pass it to the recursive function along with the accumulatedWC.

    }
    //var groupingConstraints = memoryConstraint;
    var result = [];
    var result = recuresivelyGroup(groupingConstraints,[],result);
    return result;


  }

  static createWordFromString (str : string, imgPath : string) {

    var letters : Array<Letter> = [];

    // iterate over the string array
    // for each character :
    var i = 0;
    while (i < str.length ) {
      let pos = (i === 0) ? PosEnum.FIRST : ((i === str.length -1) ? PosEnum.LAST : PosEnum.MIDDLE);
      let letterSymbol = str[i];
      let sound;
      if (true){ // if it's a letter:
        var nextChar = str[i+1] ;
        name = getLetterName(letterSymbol);
        if (nextChar){ // check the next character, if it's a sound add it to the letter Object. o/w set the sound to NONE.
          if (isEmphasis(nextChar)) {
            i++;
            nextChar = str[i+1]; // skip the emphasis, by checking the sound on the next letter and forwarding the index.
          }
          if (getLetterName(nextChar) === "VAV"){
            // check if it's a holam vav or a kubutz vav - if so treat it as a sound and skip.
            if (str[i+2] === EMPHASIS || getSound(str[i+2]) === "HOLAM"){
              i++;
              nextChar = str[i+1];
              sound = getSound(nextChar);

            }
          } else {
            sound = getSound(nextChar);
          }
          var letter = new Letter(name,pos,sound);

        } else {
          var letter = new Letter(name,pos,null);
        }

      }
      i+=2;
      letters.push(letter); // add it to the letters array (both the letter and the sound symbols together)
    }

    // if it's a sound, we have an error in word structure.

    var word = new Word(str, letters , 1, imgPath);
    // console.log("generated word : " + word.toString());

    return word;
  }

  static printTree (wordsTree : Array<any>) {
    var str = "";
    var self =this;
    for (let node of wordsTree ) {
      if (_.isArray(node)){
        str += " [ " + self.printTree(node) + "] ";
      } else {
        str += (node.toString() +" ** ");
      }
    }
    return str;
  }

  static printConstraints (wcArr : Array<IWordConstraint>) {
    var str = "- Constraints - \n";
    for (let wc of wcArr ) {
       str += wc.toString() +" | ";
    }
    return str;
  }

  static test() {

    var a = new Word("ALEF",[new Letter("ALEF",PosEnum.FIRST,"PATAH")],1);
    var b = new Word("BEIT",[new Letter("BEIT",PosEnum.FIRST,"PATAH")],1);
    var c = new Word("GIMEL_KUBUTZ_GIMEL_PATAH",[new Letter("GIMEL",PosEnum.FIRST,"KUBUZ"),new Letter("GIMEL",PosEnum.MIDDLE,"PATAH")],1);
    var c1 = new Word("GIMEL_F",[new Letter("GIMEL",PosEnum.FIRST,"PATAH")],1);
    var c2 = new Word("GIMEL2_M",[new Letter("GIMEL",PosEnum.MIDDLE,"PATAH")],1);

    var alef = new WordConstraint(1, [new LetterConstraint("ALEF")]);
    var beit = new WordConstraint(1, [new LetterConstraint("BEIT")]);
    var gimel = new WordConstraint(1, [new LetterConstraint("GIMEL")]);
    var middleGimel = new WordConstraint(1, [new LetterConstraint("GIMEL",PosEnum.MIDDLE)]);
    var kubutz = new WordConstraint(1, [new LetterConstraint(null,null,"KUBUZ")]);
    var patah = new WordConstraint(1, [new LetterConstraint(null,null,"PATAH")]);

    var generator = new VocabularyGenerator();

    console.log("filtered words",generator.filter([a,b,c,c1,c2],[alef]));
    console.log("filtered words",generator.filter([a,b,c,c1,c2],[beit]));
    console.log("filtered words",generator.filter([a,b,c,c1,c2],[gimel]));
    console.log("filtered words",generator.filter([a,b,c,c1],[middleGimel]));
    console.log("filtered words",generator.filter([a,b,c,c1,c2],[middleGimel],1));
    console.log("filtered words",generator.filter([a,b,c,c1,c2],[kubutz]));
    console.log("filtered words",generator.filter([a,b,c,c1,c2],[kubutz,patah],2));


  }

  static testGrouping() {
    console.log("Test grouping: ");
    var a = new Word("ALEF",[new Letter("ALEF",PosEnum.FIRST,"PATAH")],1);
    var ab = new Word("ALEF_BEIT",[new Letter("ALEF",PosEnum.FIRST,"PATAH"),new Letter("BEIT",PosEnum.MIDDLE,"PATAH")],1);

    var b = new Word("BEIT",[new Letter("BEIT",PosEnum.FIRST,"PATAH")],1);
    var bd = new Word("BEIT_DALET",[new Letter("BEIT",PosEnum.FIRST,"PATAH"),new Letter("DALET",PosEnum.MIDDLE,"PATAH")],1);

    var c = new Word("GIMEL",[new Letter("GIMEL",PosEnum.FIRST,"PATAH")],1);
    var cd = new Word("GIMEL_DALET",[new Letter("GIMEL",PosEnum.FIRST,"PATAH"),new Letter("DALET",PosEnum.FIRST,"PATAH")],1);

    // letters constraints:
    var wildcard_patah_lc = new LetterConstraint("?",PosEnum.FIRST,"PATAH");
    // Words constraints:
    var alefCT = new WordConstraint(1, [new LetterConstraint("ALEF")]);
    var beitCT = new WordConstraint(1, [new LetterConstraint("BEIT")]);
    var gimelCT = new WordConstraint(1, [new LetterConstraint("GIMEL")]);
    var middleGimel = new WordConstraint(1, [new LetterConstraint("GIMEL",PosEnum.MIDDLE)]);
    var kubutz = new WordConstraint(1, [new LetterConstraint(null,null,"KUBUZ")]);
    var patah = new WordConstraint(1, [new LetterConstraint(null,null,"PATAH")]);
    var f_patah_ct = new WordConstraint(1, [wildcard_patah_lc]);
    var f_a_patah_ct = new WordConstraint(1, [alefCT]);
    var f_b_patah_ct = new WordConstraint(1, [beitCT]);
    var f_c_patah_ct = new WordConstraint(1, [gimelCT]);

    var oneAlefG:GroupConstraint = new GroupConstraint(1,alefCT);
    var twoAlefG:GroupConstraint = new GroupConstraint(2,alefCT);
    var f_a_patah_2g:GroupConstraint = new GroupConstraint(2,f_a_patah_ct);
    var f__b_patah_2g:GroupConstraint = new GroupConstraint(2,f_b_patah_ct);
    var f_c_patah_2g:GroupConstraint = new GroupConstraint(2,f_c_patah_ct);
    var f_c_patah_3g:GroupConstraint = new GroupConstraint(3,f_c_patah_ct);
    var nested_f_patah_2g:GroupConstraint = new GroupConstraint(null,null,
      [{copies : 1,group : f_a_patah_2g},{copies : 1,group : f__b_patah_2g},{copies : 1,group : f_c_patah_2g}]);

    var nested_f_patah_3g:GroupConstraint = new GroupConstraint(null,null,
      [{copies : 1,group : f_a_patah_2g},{copies : 1,group : f__b_patah_2g},{copies : 1,group : f_c_patah_3g}]);
    var generator = new VocabularyGenerator();
    try {
      console.log("one alef",generator.groupWords([a,b,c],oneAlefG));
      console.log("two alef",generator.groupWords([a,ab,b,c],twoAlefG));
      var resultTree = generator.groupWords([a,ab,b,bd,c,cd],nested_f_patah_2g);
      console.log("first letter patah (2)",VocabularyGenerator.printTree(resultTree));

      var resultTree = generator.groupWords([a,ab,b,bd,c,cd],nested_f_patah_3g);
      console.log("first letter patah (2)",VocabularyGenerator.printTree(resultTree));
    } catch (e) {
      console.log("Error"+ e.message);
    }



  }

}


/*export var PedadogicLogicInjectables = [
  bind(Letter).toClass(Letter)
];*/

