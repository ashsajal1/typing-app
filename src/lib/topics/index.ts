import { biologySentece } from "./biology";
import { chemistrySentences } from "./chemistry";
import { engineeringSentence } from "./engineering";
import { physicsSentences } from "./physics";
import { computerSciencesSentences } from "./computer_sciences";
import { mathematicsSentence } from "./mathematics";
import { ecologySentence } from "./ecology";

export const sentences = [
  ...biologySentece,
  ...physicsSentences,
  ...chemistrySentences,
  ...engineeringSentence,
  ...computerSciencesSentences,
  ...mathematicsSentence,
  ...ecologySentence,
];
