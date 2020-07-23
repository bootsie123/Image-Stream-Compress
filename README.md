# Image Stream Compress

[![npm version](https://badge.fury.io/js/image-stream-compress.svg)](https://badge.fury.io/js/image-stream-compress)

An image compression library for image streams (modified from [node-pngquant](https://github.com/papandreou/node-pngquant)). Uses [pngquant](https://github.com/kornelski/pngquant) and [mozjpeg](https://github.com/mozilla/mozjpeg) for compression

## Installation

Simply install the [npm](https://www.npmjs.com/) module and you are good to go!

```
npm install image-stream-compress
```

## Usage

```
const fs = require("fs");

const { BaseStream, PNGQuant, MozJPEG } = require("image-stream-compress");

const input = fs.createReadStream("image.png");
const output = fs.createReadStream("output.png");

const compress = new PNGQuant([ 256, "--speed", 5, "--quality", "65-80" ]);

input.pipe(compress)
  .pipe(output)
  .on("finish", () => console.log("Image compressed!"));
```

## API

### BaseStream (extends Stream)

&emsp;constructor(binaryPath: String, args: String[])

### PNGQuant (extends BaseStream)

&emsp;constructor(args: String[])
&emsp;*A full list of args can be found [here](https://github.com/kornelski/pngquant)*

### MozJPEG (extends BaseStream)

&emsp;constructor(args: String[])
&emsp;*A full list of args can be found [here](https://github.com/mozilla/mozjpeg/blob/master/usage.txt)*

## Contributing
Pull requests are welcome. Any changes are appreciated!

## License
[ISC](https://choosealicense.com/licenses/isc/)

## Acknowledgments

* [node-pngquant](https://github.com/papandreou/node-pngquant) - Special thanks to all of the contributors who worked on that project! This project is a slight modfication of their project to make it used for more general purposes
