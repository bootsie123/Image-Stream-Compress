const BaseStream = require("./BaseStream");

const pngquant = require("pngquant-bin");

class PNGQuant extends BaseStream {
  constructor(args=[ 256 ]) {
    super(pngquant, args);
  }
}

module.exports = PNGQuant;
