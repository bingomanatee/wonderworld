
let _nextId = 0;
export default class LetterDiv {
  constructor(ani, letter, size, color, letterSize){
    this.ani = ani;
    this.letter = letter;
    this.letterSize = letterSize;
    this._x = 0;
    this._y = 0;
    this.id = ++_nextId;
    let divId = `wllLetter-${this.id}`;
     this.ani.canvasElement
       .find('#ani-letters')
       .append(`<div class="wll-letter" id="${divId}" >
<div class="wll-letter__character" style="color: ${color}; font-size: ${letterSize}px; line-height: ${ letterSize}px">${letter.toUpperCase()}</div>
</div>`);
    this._element = this.ani.canvasElement.find(`#${divId}`);
    this.size = size;
    this.color = color;

  }

  _color
  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
  }

  _size

  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
  }

  hide() {
    this.element.hide();
  }

  show() {
  //  this.element.show();
  }

  get element() {
    return this._element;
  }

  set element(value) {
    this._element = value;
  }

  _id

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get ani() {
    return this._ani;
  }

  set ani(value) {
    this._ani = value;
  }

  get letter() {
    return this._letter;
  }

  set letter(value) {
    this._letter = value;
  }

  _x
  _y

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
   this.element.css('left', `${value - 100}px`);
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this.element.css('top', `${value - 100}px`);
  }
}