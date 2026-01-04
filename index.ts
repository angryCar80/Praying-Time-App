import chalk from "chalk";

// let country_op: string;
// let city_op: string;

let API_URL: string = "https://api.aladhan.com/v1/timingsByCity?city=Algiers&country=Algeria";


const args: string[] = process.argv.slice(2);
const flags: string[] = ["help", "country"];

async function readApi(args: string[]) {
  try {

    const query = args[0] ?? "default";

    const res = await fetch(`${API_URL}?q=${query}`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    console.log("Result: ");
    console.log(data);

  } catch (err) {
    console.log("ERROR: ", err);
  }
}

function main() {
  if (args.length < 0) {
    chalk.white.bgRed.bold("WRONG ARGUMNETS");
  } if (args[0] == "--help") {
    console.log("available arguments:");
    console.log("   --country <country> <city>");
    console.log("   --help");

  }
  else if (args[0] == "--country") {
    readApi(args);
  }
  else {
    console.log(chalk.white.bgRed.bold("WRONG ARGUMNETS"));
    console.log("Not available argument try '--help' to list available arguments.");
  }
}
main();

// && args[1] == ""
