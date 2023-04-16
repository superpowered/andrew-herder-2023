import TextBubble from './textBubble';

// -----------------------------------------------------------------------------

class TextSystem {
  constructor() {
    this.textBubbles = [];
    this.textAnchor = document.getElementById('text-bubble-anchor');
    this.textElement = document
      .getElementById('text-bubble-template')
      .cloneNode();
    this.textElement.id = '';
    document.getElementById('text-bubble-template').remove();
  }

  makeText(textData) {
    this.textBubbles = this.textBubbles.filter((textBubble) => {
      if (textBubble.textData.removeOnNew) {
        textBubble.destroy();
      }
      return !textBubble.destroyed;
    });

    // TODO: can I break this away from setTimeout? Maybe use like deltaTime or similar
    setTimeout(() => {
      this.textBubbles.push(
        new TextBubble(this, textData, this.textAnchor, this.textElement),
      );
    }, 100);
  }
}

// -----------------------------------------------------------------------------

export default TextSystem;
