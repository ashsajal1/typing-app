import { biologySentece } from "./biology";
import { chemistrySentences } from "./chemistry";
import { englishWrittingSentences } from "./english-writting";
import { physicsSentences } from "./physics";

export const sentences = [
  ...biologySentece,
  ...physicsSentences,
  ...chemistrySentences,
  ...englishWrittingSentences,
];
