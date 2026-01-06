import { Player } from "cli-sound";
import * as path from "path";

const player = new Player();
const soundFilePath = path.join(__dirname, "assets/sound.mp3");

type notif = {
  content: string;
  outline: any;
};

export async function playSound() {
  try {
    await player.play(soundFilePath);
  } catch (err) {
    console.log("Failed to play sound:", err);
  }
}

function DrawNotif() {
  console.log("------------------------------------");
  console.log("           TIME TO PRAY             ");
  console.log("------------------------------------");
}

export function ShowNotifecation() {
  playSound();
  setTimeout(DrawNotif, 500);
}
