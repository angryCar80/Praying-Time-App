#!/usr/bin/env node
import chalk from "chalk";
import { playSound, ShowNotifecation } from "./notifications";
import { parseArgs } from "util";

const args: string[] = process.argv.slice(2);


type PrayerTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

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


function prayerTimeToDate(time: string): Date {
  const [hours, minutes]: any = time.split(":").map(Number);
  const now = new Date();

  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);
  if (prayerDate <= now) {
    prayerDate.setDate(prayerDate.getDate() + 1);

  }
  return prayerDate;
}



function getNextPrayer(timings: PrayerTimings) {
  const prayers: (keyof PrayerTimings)[] = [
    "Fajr",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ];

  let nextPrayerName: keyof PrayerTimings | null = null;
  let nextPrayerTime: Date | null = null;

  for (const prayer of prayers) {
    const date = prayerTimeToDate(timings[prayer]); // ✅ no error now

    if (!nextPrayerTime || date < nextPrayerTime) {
      nextPrayerTime = date;
      nextPrayerName = prayer;
    }
  }

  return { nextPrayerName, nextPrayerTime };
}

async function watchPrayerTimes(url: string) {
  const res = await fetch(url);
  const data: any = await res.json();

  const timings = data.data.timings;

  const { nextPrayerName, nextPrayerTime } = getNextPrayer(timings);

  if (!nextPrayerTime) return;

  const delay = nextPrayerTime.getTime() - Date.now();

  console.log(
    chalk.green(
      `Next prayer: ${nextPrayerName} at ${nextPrayerTime.toLocaleTimeString()}`
    )
  );

  setTimeout(() => {
    console.log(chalk.yellow(`🕌 Time for ${nextPrayerName}`));
    ShowNotifecation();

    // Schedule the next one
    watchPrayerTimes(url);
  }, delay);
}

function main() {
  if (args.length < 0) {
    chalk.red.bold("WRONG ARGUMNETS");
  }
  getNames();
  if (args[0] == "--help") {
    console.log("available arguments:");
    console.log("   --country <country> <city>");
    console.log("   --help");

  }
  else if (args[0] == "--default") {
    readApi(args, DEFAULT_API_URL);
  } else if (args[0] == "--country") {
    getNames();
    API_URL = `https://api.aladhan.com/v1/timingsByCity?city=${newCity}&country=${newCountry}`;
    readApi(args, API_URL);
  }
  else if (args[0] == "--watch") {
    getNames();

    const WATCH_API_URL =
      `https://api.aladhan.com/v1/timingsByCity?city=${newCity}&country=${newCountry}`;

    console.log(
      chalk.cyan(
        `🕌 Watching prayer times for ${newCity}, ${newCountry}...`
      )
    );

    watchPrayerTimes(WATCH_API_URL);
  }
  else if (args[0] == "--test") {
    ShowNotifecation();
  }
  else {
    console.log(chalk.white.bgRed.bold("WRONG ARGUMNETS"));
    console.log("Not available argument try '--help' to list available arguments.");
  }
}
main();
