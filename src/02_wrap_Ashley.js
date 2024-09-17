/**
 * This example collects a prompt from the user, sends it to GPT
 * and relays the response.
 */

import { ask, say } from "./shared/cli.ts";
import { promptGPT } from "./shared/openai.ts";

const personality = await ask(
  "What do you want to ask?",
);

const prompt =
  `You are answering as a condescending person. Answer this question: ${personality}`;
//sends user input to GPT
const result = await promptGPT(prompt, {
  temperature: .8,
});

say("");
say(result);
