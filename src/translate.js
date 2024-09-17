import { promptGPT } from "./shared/openai.ts";
import { ask, say } from "./shared/cli.ts";

// prompt user for name and hometown
const sentence = await ask("Give me a sentence.");
const language = await ask(
    "To what language do you want to translate your sentence?",
);

// output a blank line
say("");

// prepare the prompt and send to GPT
const prompt = `Translate ${sentence} into ${language}.`;

const translate = await promptGPT(prompt, { temperature: 0.7 });

say(translate);
