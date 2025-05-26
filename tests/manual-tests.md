# Manual Testing Steps

## 1. Verify Default Topic

**Objective:** Ensure the default topic selected on the main page is "computer_sciences".

**Steps:**
1.  Navigate to the application's main page (homepage).
2.  Observe the topic selection dropdown.
3.  **Expected Result:** The dropdown should show "computer_sciences" as the pre-selected topic.

## 2. Verify Default Syntax Highlighting for Topic-Based Practice

**Objective:** Ensure Python syntax highlighting is applied by default when starting a practice session with a topic.

**Steps:**
1.  Navigate to the application's main page.
2.  Ensure "computer_sciences" (or any other topic) is selected in the topic dropdown.
3.  Click the "Commencer l'entraînement" (Start Training) button.
4.  On the practice page, observe the text presented for typing.
5.  **Expected Result:** If the text contains Python keywords (e.g., `def`, `class`, `import`), they should be highlighted according to Python syntax rules (e.g., keywords in blue, comments in gray, strings in green). If the text is just plain text without Python code, no specific highlighting will be obvious, but the system should be attempting to apply Python rules.

## 3. Verify Unique Label Generation for Custom Texts

**Objective:** Ensure that saving a custom text with an already existing label results in a modified label with a suffix (e.g., "label_1").

**Steps:**
1.  Navigate to the "Créer un Texte Personnalisé" (Create Custom Text) page.
2.  Create and save a custom text:
    *   **Libellé de l'entraînement (Label):** `my_test_label`
    *   **Texte/Contenu (Text):** `This is the first test text.`
    *   **Langue (Language):** `Texte brut (Plaintext)`
    *   Click "Sauvegarder et Aller à l'entraînement" (Save and Go to Training).
3.  You should be redirected to the practice page. Navigate back to "Créer un Texte Personnalisé".
4.  Create and save a second custom text with the **same label** as the first:
    *   **Libellé de l'entraînement (Label):** `my_test_label`
    *   **Texte/Contenu (Text):** `This is the second test text, should have a new label.`
    *   **Langue (Language):** `Texte brut (Plaintext)`
    *   Click "Sauvegarder et Aller à l'entraînement".
5.  Navigate to the "Texte Sauvegardé" (Saved Text) page (or check `localStorage` if the page lists saved texts with their labels).
6.  **Expected Result:** You should see two entries. The first one with the label "my_test_label", and the second one with a modified label like "my_test_label_1".
7.  (Optional) Try saving a third text with the original label "my_test_label".
8.  **Expected Result (Optional):** The third text should have a label like "my_test_label_2".
