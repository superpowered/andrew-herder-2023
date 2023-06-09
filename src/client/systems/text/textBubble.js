class TextBubble {
  constructor(textSystem, textData, textAnchor, textElement) {
    this.x = 0;
    this.y = 0;
    this.textAnchor = textAnchor;
    this.textElement = textElement.cloneNode();
    this.isActive = false;
    this.textSystem = textSystem;
    this.destroyed = false;
    this.textData = textData;
    this.init(textData);
  }

  init(textData) {
    const list = textData.text.reduce((prev, textObj, i) => {
      if (i < textData.text.length - 1 && !textObj.noEndSpace) {
        textObj.string += ' ';
      }

      const thisList = textObj.string.split('').map((char, pos) => {
        const span = document.createElement('span');
        span.textContent = char;
        textObj.classes?.forEach((className) => {
          span.classList.add(className);
        });
        this.textElement.appendChild(span);

        return {
          span,
          isSpace: char === ' ',
          speed: textObj.speed,
          classes: textObj.classes ?? [],
          delay:
            textObj.delayAfter && pos >= textObj.string.length - 1
              ? textObj.delayAfter
              : 0,
        };
      });
      return [...prev, ...thisList];
    }, []);
    textData.classes?.forEach((className) => {
      this.textElement.classList.add(className);
    });
    this.textAnchor.appendChild(this.textElement);
    this.revealOneCharacter(list);

    setTimeout(() => this.destroy(), textData.ttl);
  }

  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (list.length) {
      const speed = next.isSpace ? 0 : next.speed;
      setTimeout(() => this.revealOneCharacter(list), speed + next.delay);
    }
  }

  destroy() {
    this.textElement.classList.add('removed');
    setTimeout(() => {
      this.destroyed = true;
      this.textElement.remove();
    }, 100);
  }
}

// -----------------------------------------------------------------------------

export default TextBubble;
