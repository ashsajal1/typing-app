import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ChangeEvent, useEffect } from "react";

// Assuming deobfuscateText is in utils or a new obfuscation.ts
// For this example, let's assume it's correctly pathed
// import { deobfuscateText } from "../lib/obfuscation"; // Adjust path as needed

interface FormData {
  label: string;
  text: string; // This will hold the raw content (plain or base64) from the file
  language: "python" | "cpp" | "plaintext";
  isObfuscated: boolean;
  sourceFileName?: string; // To store the original filename for display
}

export const Route = createFileRoute("/custom-text")({
  component: RouteComponent,
});

const formSchema = z.object({
  label: z.string().min(3, "Le libellé doit comporter au moins 3 caractères"),
  text: z.string().min(10, "Le texte/contenu doit être disponible"),
  language: z.enum(["python", "cpp", "plaintext"]),
  isObfuscated: z.boolean().default(false),
  sourceFileName: z.string().optional(),
});

function RouteComponent() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues, // Added getValues
    control, // Added control for potential future complex inputs
    watch, // Added watch
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "plaintext",
      isObfuscated: false,
      text: "",
      label: "",
    },
  });

  const [isAdded, setIsAdded] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [fileSelectedMessage, setFileSelectedMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const sourceFileName = watch("sourceFileName"); // Watch for changes to show a message

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileSelectedMessage(`Fichier sélectionné : ${file.name}. Traitement en cours...`);
      setValue("sourceFileName", file.name); // Store original filename

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setValue("text", fileContent); // Store raw content (could be Base64 for .bin)
        setValue("label", file.name.substring(0, file.name.lastIndexOf('.')) || file.name); // Default label from filename

        if (file.name.endsWith(".py")) {
          setValue("language", "python");
          setValue("isObfuscated", false);
        } else if (file.name.endsWith(".cpp") || file.name.endsWith(".cxx") || file.name.endsWith(".h") || file.name.endsWith(".hpp")) {
          setValue("language", "cpp");
          setValue("isObfuscated", false);
        } else if (file.name.endsWith(".txt")) {
          setValue("language", "plaintext");
          setValue("isObfuscated", false);
        } else if (file.name.endsWith(".bin")) { // Assuming .bin is our obfuscated (Base64 text) format
          setValue("isObfuscated", true);
          // Try to infer language from filename like "script.py.bin"
          const parts = file.name.split('.');
          if (parts.length > 2) {
            const potentialExt = parts[parts.length - 2];
            if (potentialExt === "py") setValue("language", "python");
            else if (potentialExt === "cpp" || potentialExt === "cxx") setValue("language", "cpp");
            else setValue("language", "plaintext"); // Default for unknown embedded extensions
          } else {
             setValue("language", "plaintext"); // Default for .bin if no other extension found
          }
        } else {
          setValue("language", "plaintext");
          setValue("isObfuscated", false);
        }
        setFileSelectedMessage(`Fichier "${file.name}" chargé. Le libellé et la langue peuvent avoir été détectés automatiquement.`);
      };

      // For .bin, we assume it contains Base64 *text*. If it's true binary, use readAsArrayBuffer
      // and then convert ArrayBuffer to Base64 string. For simplicity now, readAsText.
      reader.readAsText(file);
    } else {
      setValue("sourceFileName", undefined);
      setFileSelectedMessage(null);
    }
  };

  const onSubmit = (data: FormData) => {
    const existingData = localStorage.getItem("customTextData");
    const dataArray = existingData ? JSON.parse(existingData) : [];

    // The 'text' field in `data` for obfuscated files is the Base64 string itself.
    // De-obfuscation will happen on the practice page.
    const newData = {
      id: dataArray?.length + 1 + Math.floor(Math.random() * 1000) + new Date().getTime(),
      label: data.label,
      text: data.text, // Raw text or Base64 string
      language: data.language,
      isObfuscated: data.isObfuscated,
      time: new Date().toLocaleString(),
    };

    const isDuplicateEntry = dataArray.some(
      (item: { label: string; text: string }) => // Simple duplication check on raw text
        item.label === newData.label && item.text === newData.text
    );

    if (isDuplicateEntry) {
      setIsDuplicate(true);
      setTimeout(() => setIsDuplicate(false), 2000);
      return;
    }

    dataArray.push(newData);
    localStorage.setItem("customTextData", JSON.stringify(dataArray));

    navigate({
      to: `/practice?savedTextId=${newData.id}`, // No need to pass all params, practice will load from localStorage
    });

    reset();
    setFileSelectedMessage(null);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="w-full p-2">
      {/* Corrected Alerts */}
      {isAdded && (
        <div role="alert" className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Votre texte a été sauvegardé !</span>
        </div>
      )}

      {isDuplicate && (
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Erreur ! Texte dupliqué trouvé.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ... (rest of the form remains the same as in the previous correct version) ... */}
        <div>
          <label htmlFor="fileInput" className="label label-text">
            Télécharger un fichier de code/texte (.py, .cpp, .txt, ou .bin pour obfusqué)
          </label>
          <input
            type="file"
            id="fileInput"
            className="file-input file-input-bordered file-input-success w-full"
            accept=".py,.cpp,.cxx,.h,.hpp,.txt,.bin"
            onChange={handleFileChange}
          />
          {fileSelectedMessage && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{fileSelectedMessage}</p>}
        </div>

        <div>
          <label htmlFor="label" className="label label-text">Libellé de l'entraînement</label>
          <input
            type="text"
            id="label"
            className="input input-bordered w-full"
            placeholder="Entrez un libellé (par ex., script Python, fonction C++)"
            {...register("label")}
          />
          {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>}
        </div>

        <div>
            <label htmlFor="textManual" className="label label-text">
                Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)
            </label>
            <textarea
                id="textManual"
                placeholder={sourceFileName ? `Le contenu de "${sourceFileName}" est chargé et apparaîtra sur l'écran d'entraînement. Vous pouvez également coller du texte manuellement ici pour remplacer la sélection de fichier.` : "Collez votre texte ou code ici si vous ne téléchargez pas de fichier..."}
                className="textarea textarea-bordered w-full font-mono"
                rows={sourceFileName ? 3 : 10}
                cols={50}
                {...register("text")}
                disabled={!!sourceFileName}
            />
            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
            {sourceFileName && <p className="text-sm text-info mt-1">Le contenu du fichier téléchargé sera utilisé sauf si vous désélectionnez le fichier et collez un nouveau contenu.</p>}
        </div>
        
        <div>
          <label htmlFor="language" className="label label-text">Langue (pour la coloration syntaxique)</label>
          <select {...register("language")} className="select select-bordered w-full">
            <option value="plaintext">Texte brut</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <input type="hidden" {...register("isObfuscated")} />

        <button className="btn btn-success w-full mt-6" type="submit">
          Sauvegarder et Aller à l'entraînement
        </button>
      </form>
    </div>
  );
}