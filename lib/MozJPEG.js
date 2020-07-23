const BaseStream = require("./BaseStream");

const mozjpeg = require("mozjpeg");

class MozJPEG extends BaseStream {
  constructor(args=[]) {
    super(mozjpeg, args);
  }
}

module.exports = MozJPEG;
