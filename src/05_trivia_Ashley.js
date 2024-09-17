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
  say("Hello, Player!");
  const topic = await ask("What do you want to be quized on?");

  // generate questions
  // note: this would be a good place to use "structure responses" which we'll
  // talk about later in the course
  const questionsString = await promptGPT(
    `Generate 4 questions for a triva game. Do not provide answers.
     Provide the  questions as a javascript array of strings like this:
     ["question 1", "question 2", "question 3", "question 4"]
     Include only the array, start with [ and end with ].
     The topic is ${topic}.
    `,
    { max_tokens: 1024, temperature: 0.3 },
  );

  // gpt returns a string, we need to parse it to get a usable array
  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);
    return;
  }

  // output blank line
  say("");

  let correct = 0;

  // loop through each question
  for (const q of questions) {
    // ask the user for an answer
    const a = await ask(q);

    // ask gpt to evaluate the answer
    const response = await promptGPT(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer only with 0 or 1.
    Answer 0 for a correct answer, and 1 for a wrong answer.
    `,
      { max_tokens: 64, temperature: 0.0 },
    );

    if (response == "0") {
      say("You are Correct!");
      correct = correct + 1;
    }
    // report the response
  }
  say(
    `You got ${correct} questions correct out of ${questions.length} questions`,
  );
  say("");
}

main();
