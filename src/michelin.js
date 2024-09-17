/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import { ask, say } from "./shared/cli.ts";
import { promptGPT } from "./shared/openai.ts";
import { LogLevel, setLogLevel } from "./shared/logger.ts";

// hide DEBUG and INFO logs
setLogLevel(LogLevel.LOG);

async function main() {
    // greet the player, ask for a topic
    say("Let me help you find a michelin restaurant!");
    const country = await ask("Which area are you looking to visit?");
    const cuisine = await ask(
        "What type of food would you like to dine? (ex. Asian, Vietnamese, French, Italian, etc.)",
    );
    const stars = await ask("How many michelin stars are you looking for?");

    // generate questions
    // note: this would be a good place to use "structure responses" which we'll
    // talk about later in the course
    const questionsString = await promptGPT(
        `You are searching for ${stars} star michelin restaurants in ${country}.
     You are going to narrow your answer based on ${cuisine} food category.
     If there are none, return empty array.
     Respond with an array of objects in a format with the following fields:
     {
        name: string,
        address: string,
        star: number
     }.
     If there are more than 5 restaurants, limit the list to 5.
    `,
        { max_tokens: 1024, temperature: 0.0 },
    );

    // gpt returns a string, we need to parse it to get a usable array
    let names = [];
    try {
        names = JSON.parse(questionsString);
    } catch (_e) {
        say(`Error parsing questions string: "${questionsString}"`);
        return;
    }
    if (names.length == 0) {
        say(`Sorry, there are no restaurants that fit your liking at ${country}.`);
    } else {
        say(`Here are some ${stars} star Michelin restaurants you may like:`);
        say(names);
    }
}

main();
