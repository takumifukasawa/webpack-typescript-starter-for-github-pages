import wait from "~/wait/";

async function main() {
  console.log("3 ...");
  await wait(1000);
  console.log("2 ...");
  await wait(1000);
  console.log("1 ...");
  await wait(1000);
  console.log("0 !");
}

main();
