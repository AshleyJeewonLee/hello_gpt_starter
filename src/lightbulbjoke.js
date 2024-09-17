import { promptGPT } from "./shared/openai.ts";
import { ask, say } from "./shared/cli.ts";

// prompt user for name and hometown
const word = await ask("Say any word.");

// output a blank line
say("");

// prepare the prompt and send to GPT
const prompt = `Create a lightbulb joke about ${word}.`;

const joke = await promptGPT(prompt, { temperature: 0.7 });

say(joke);
