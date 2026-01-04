import chalk from "chalk";

const args: string[] = process.argv.slice(2);
// const flags: string[] = ["help", "country"];



// Default values
const defaultCountry = "Algeria";
const defaultCity = "Algiers";

let newCountry: string;
let newCity: string;
function getNames() {
  newCountry = args[1] ?? defaultCountry;
  newCity = args[2] ?? defaultCity;
}

getNames();

// Step 3: Build URLs AFTER reading input
let API_URL: string = `https://api.aladhan.com/v1/timingsByCity?city=undefined&country=undefined`;
let DEFAULT_API_URL: string = `https://api.aladhan.com/v1/timingsByCity?city=${defaultCity}&country=${defaultCountry}`;


async function readApi(args: string[], URL: string) {
  try {

    const query = args[0] ?? "default";

    const res = await fetch(`${URL}?q=${query}`);

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
  }
  getNames();
  if (args[0] == "--help") {
    console.log("available arguments:");
    console.log("   --country <country> <city>");
    console.log("   --help");

  }
  else if (args[0] == "--run") {
    readApi(args, DEFAULT_API_URL);
  } else if (args[0] == "--country") {
    getNames();
    API_URL =  `https://api.aladhan.com/v1/timingsByCity?city=${newCity}&country=${newCountry}`;
    readApi(args, API_URL);
  }
  else {
    console.log(chalk.white.bgRed.bold("WRONG ARGUMNETS"));
    console.log("Not available argument try '--help' to list available arguments.");
  }
}
main();

// && args[1] == ""
