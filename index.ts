import chalk from "chalk";

const args: string[] = process.argv.slice(2);
const flags: string[] = ["--help", "--country"];

function readApi() {
}

function main() {
  if (args.length < 0) {
    chalk.white.bgRed.bold("WRONG ARGUMNETS");
  } if (args[0] == "--help") {

    let i: number = 0;
    console.log("available arguments:");
    for (i < flags.length; i++;) {
      console.log(flags[i]);
    }
  }
  else {
    console.log(chalk.white.bgRed.bold("WRONG ARGUMNETS"));
    console.log("Not available argument try '--help' to list available arguments.");
  }
}
main();

// && args[1] == ""
