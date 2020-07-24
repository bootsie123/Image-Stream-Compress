/*
NOTES:

  This class is a tiny modification of node-pngquant. ALL CREDIT goes to them
  and their contributors

  Github Repository: https://github.com/papandreou/node-pngquant

*/

const childProcess = require("child_process");
const Transform = require("stream").Transform;

class BaseStream extends Transform {
  constructor(binaryPath, args=[]) {
    super();

    this.args = args;
    this.binaryPath = binaryPath;

    this.writeable = true;
    this.readable = true;
  }

  _transform(chunk) {
    if (this.ended) return;

    if (!this.bufferedChunk && !this.binaryProcess) {
      this.bufferedChunks = [];

      this.binaryProcess = childProcess.spawn(this.binaryPath, this.args);

      this.binaryProcess.once("error", err => this._error(err))
      .once("exit", exitCode => {
        if (this.ended) return;

        if (exitCode > 0 && !this.ended) {
          this._error(`The process exited with a non-zero exit code: ${exitCode}`);

          this.ended = true;
        }
      });

      this.binaryProcess.stdin.once("error", err => this._error(err));
      this.binaryProcess.stdout.once("error", err => this._error(err));

      this.binaryProcess.stderr.on("data", data => {
        if (!this.ended) {
          this._error(data.toString("ascii"));

          this.ended = true;
        }
      });

      this.binaryProcess.stdout.on("data", chunk => {
        this.dataOnStdout = true;

        this.emit("data", chunk);
      })
      .once("end", () => {
        this.binaryProcess = null;

        if (!this.ended) {
          if (this.dataOnStdout) {
            this.emit("end");
          } else {
            this._error("The stdout stream ended without emitting any data");
          }

          this.ended = true;
        }
      });

      this.bufferedChunks.forEach(bufferedChunk => {
        if (this.binaryProcess) {
          if (bufferedChunk === null) {
            this.binaryProcess.stdin.end();
          } else {
            this.binaryProcess.stdin.write(bufferedChunk);
          }
        }
      });

      this.bufferedChunks = null;
    }

    if (this.bufferedChunks) {
      this.bufferedChunks.push(chunk);
    } else {
      this.binaryProcess.stdin.write(chunk);
    }
  }

  end(chunk) {
    if (this.ended) return;

    if (chunk) {
      this.write(chunk);
    } else if (!this.binaryProcess) {
      this.write(Buffer.from([]));
    }

    if (this.bufferedChunks) {
      this.bufferedChunks.push(null);
    } else {
      this.binaryProcess.stdin.end();
    }
  }

  pause() {
    if (this.binaryProcess) this.binaryProcess.stdout.pause();
  }

  resume() {
    if (this.binaryProcess) this.binaryProcess.stdout.resume();
  }

  _error(err) {
    if (!this.ended) {
      this.ended = true;
      this.cleanUp();
      this.emit("error", err);
    }
  }

  cleanUp() {
    if (this.binaryProcess) {
      this.binaryProcess.kill();
      this.binaryProcess = null;
    }

    this.bufferedChunks = null;
  }

  destroy() {
    if (!this.ended) {
      this.ended = true;

      this.cleanUp();
    }
  }
}

module.exports = BaseStream;
