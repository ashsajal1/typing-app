export interface TypingLesson {
  id: string;
  unit: string;
  title: string;
  keys: string;
  instruction: string;
  exercises: string[];
}

export const LESSONS: TypingLesson[] = [
  { id: 'f-j', unit: 'Home row', title: 'Find your home keys', keys: 'F J Space', instruction: 'Feel the bumps on F and J. Rest your index fingers there and use a thumb for Space. Keep your eyes on the screen.', exercises: ['fff jjj fff jjj', 'fj fj jf jf f j f j', 'ff jj fj jf fj fj'] },
  { id: 'd-k', unit: 'Home row', title: 'Add your middle fingers', keys: 'D K', instruction: 'Place your middle fingers on D and K. Let your index fingers stay close to F and J.', exercises: ['ddd kkk ddd kkk', 'df jk fd kj dk kd', 'dj fk kd jf dk fj'] },
  { id: 's-l', unit: 'Home row', title: 'Bring in the ring fingers', keys: 'S L', instruction: 'Use your left ring finger for S and your right ring finger for L. Return to the home row after each key.', exercises: ['sss lll sss lll', 'sd kl ds lk sl ls', 'sld kls fls jls'] },
  { id: 'a-semicolon', unit: 'Home row', title: 'Complete the home row', keys: 'A ;', instruction: 'Your little fingers rest on A and semicolon. Type gently; accuracy matters more than speed.', exercises: ['aaa ;;; aaa ;;;', 'asdf jkl; asdf jkl;', 'a lad asks; a flask falls;'] },
  { id: 'g-h', unit: 'Home row', title: 'Reach toward the center', keys: 'G H', instruction: 'Reach inward with your index fingers for G and H, then return to F and J.', exercises: ['fgf jhj fgf jhj', 'gh hg gag hag glad', 'a glad lad has a flask'] },
  { id: 'e-i', unit: 'Reach and return', title: 'Meet the upper row', keys: 'E I', instruction: 'Move your middle fingers up from D to E and from K to I. Return home between reaches.', exercises: ['ded kik ded kik', 'die lie lid side file', 'she likes a safe life'] },
  { id: 'r-u', unit: 'Reach and return', title: 'Extend your index fingers', keys: 'R U', instruction: 'Use your left index finger for R and your right index finger for U. Keep your wrists relaxed.', exercises: ['frf juj frf juj', 'rug red fur rule sure', 'a red rug lies here'] },
  { id: 'top-row', unit: 'Reach and return', title: 'Explore the upper row', keys: 'Q W T Y O P', instruction: 'Follow the finger guide for each new key. Work slowly across the row, returning to your home position.', exercises: ['aqa sws ftf jyj lol ;p;', 'quiet power type write', 'we type with a steady flow'] },
  { id: 'bottom-row', unit: 'Reach and return', title: 'Explore the lower row', keys: 'Z X C V B N M', instruction: 'Curl your fingers down to the lower row. Your right index finger handles both N and M.', exercises: ['az sx dc fv fb jn jm', 'mix maze calm van zoom', 'many calm moves make progress'] },
  { id: 'capitals', unit: 'Everyday typing', title: 'Use Shift with confidence', keys: 'Shift', instruction: 'Hold Shift with the opposite hand while typing a capital. Release Shift before the next lowercase letter.', exercises: ['Aa Ff Jj Nn Mm', 'Sam Jane Kim Alex', 'My name is Sam. I can type.'] },
  { id: 'numbers', unit: 'Everyday typing', title: 'Numbers and punctuation', keys: '0–9 , . ! ?', instruction: 'Reach up to the number row and return home. Follow the Shift cue for symbols such as ! and ?.', exercises: ['11 22 33 44 55 66 77 88 99 00', '1, 2, 3. Ready? Go!', 'We have 12 books and 30 pens.'] },
  { id: 'sentences', unit: 'Everyday typing', title: 'Put it all together', keys: 'Full keyboard', instruction: 'Build a comfortable rhythm. Keep your eyes on the text and correct mistakes with Backspace before continuing.', exercises: ['The quick brown fox jumps over the lazy dog.', 'Take your time. Small steps build good habits.', 'Can you type this with calm, steady hands? Yes, you can!'] },
];

export const LESSON_UNITS = [...new Set(LESSONS.map(lesson => lesson.unit))];
