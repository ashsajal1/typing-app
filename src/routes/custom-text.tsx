import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { BookOpen, Upload } from "lucide-react";
import { SEO } from '../components/SEO'

type TextType = "paragraph" | "composition" | "formal-letter" | "informal-letter" | "others";

interface FormData {
  label: string;
  text: string;
  type: TextType;
}

export const Route = createFileRoute("/custom-text")({
  component: () => (
    <>
      <SEO 
        title="Custom Text"
        description="Create your own custom typing practice text. Import or write your own content to practice typing with personalized material."
        keywords={['custom typing text', 'personalized practice', 'import text', 'custom content']}
      />
      <RouteComponent />
    </>
  ),
});

const formSchema = z.object({
  label: z.string().min(5, "Label must be at least 5 characters long"),
  text: z.string().min(20, "Text must be at least 20 characters long"),
  type: z.enum(["paragraph", "composition", "formal-letter", "informal-letter", "others"]),
});

function RouteComponent() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "paragraph"
    }
  });
  
  const textValue = watch("text", "");
  const [isAdded, setIsAdded] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('Your text has been saved!');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Validate headers
        const requiredHeaders = ['Title', 'Type', 'Content'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        // Get indices of required columns
        const titleIndex = headers.indexOf('Title');
        const typeIndex = headers.indexOf('Type');
        const contentIndex = headers.indexOf('Content');

        // Process each line (skip header)
        const importedData = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim());
          return {
            label: values[titleIndex]?.replace(/^"|"$/g, '') || '',
            type: values[typeIndex]?.toLowerCase() as TextType || 'paragraph',
            text: values[contentIndex]?.replace(/^"|"$/g, '') || ''
          };
        });

        // Validate and save each entry
        const existingData = JSON.parse(localStorage.getItem("customTextData") || "[]");
        let successCount = 0;
        let duplicateCount = 0;

        importedData.forEach(data => {
          // Validate data
          if (!data.label || !data.text) return;
          if (data.label.length < 5 || data.text.length < 20) return;

          // Check for duplicates
          const isDuplicate = existingData.some(
            (item: { label: string; text: string }) =>
              item.label === data.label && item.text === data.text
          );

          if (!isDuplicate) {
            const newData = {
              id: existingData.length + 1 + Math.floor(Math.random() * 1000) + new Date().getTime(),
              ...data,
              time: new Date().toLocaleString(),
            };
            existingData.push(newData);
            successCount++;
          } else {
            duplicateCount++;
          }
        });

        // Save to localStorage
        localStorage.setItem("customTextData", JSON.stringify(existingData));

        // Show success message
        setImportError(null);
        setIsAdded(true);
        const message = `Successfully imported ${successCount} texts${duplicateCount > 0 ? ` (${duplicateCount} duplicates skipped)` : ''}`;
        setSuccessMessage(message);
        setTimeout(() => {
          setIsAdded(false);
          setSuccessMessage('Your text has been saved!');
        }, 2000);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import CSV');
        setTimeout(() => {
          setImportError(null);
        }, 3000);
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read file');
      setTimeout(() => {
        setImportError(null);
      }, 3000);
    };

    reader.readAsText(file);
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("customTextData");

    // Parse the existing data or initialize an empty array if none exists
    const dataArray = existingData ? JSON.parse(existingData) : [];

    const newData = {
      id: dataArray?.length + 1 + Math.floor(Math.random() * 1000) + new Date().getTime(), 
      ...data,
      time: new Date().toLocaleString(),
    };

    // Check for duplicate data based on both label and text
    const isDuplicate = dataArray.some(
      (item: { label: string; text: string }) =>
        item.label === data.label && item.text === data.text
    );

    if (isDuplicate) {
      console.log("Duplicate entry found. Not saving.");
      setImportError("Error! Duplicate text found.");
      setTimeout(() => {
        setImportError(null);
      }, 2000);
      return; // Stop if it's a duplicate
    }

    // Push the new data to the array if no duplicate is found
    dataArray.push(newData);

    // Save the updated array back to localStorage
    localStorage.setItem("customTextData", JSON.stringify(dataArray));

    navigate({
      to: `/practice`,
      search: {
        savedTextId: Number(newData.id),
        topic: data.type,
        eclipsedTime: 60
      }
    });

    reset();
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Create Custom Text</h1>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleCSVImport}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <Link to="/guide">
            <button className="btn btn-outline btn-success gap-2">
              <BookOpen className="w-4 h-4" />
              View Guide
            </button>
          </Link>
        </div>
      </div>

      {isAdded && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {importError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{importError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="label">Enter text label</h1>
            <input
              type="text"
              className="input input-bordered mb-2 w-full"
              placeholder="Enter label, eg. Paragraph about Climate Change etc.."
              {...register("label")}
            />
            {errors.label && <p className="text-red-500">{errors.label.message}</p>}
          </div>

          <div>
            <h1 className="label">Select text type</h1>
            <select 
              className="select select-bordered w-full"
              {...register("type")}
            >
              <option value="paragraph">Paragraph</option>
              <option value="composition">Composition</option>
              <option value="formal-letter">Formal Letter</option>
              <option value="informal-letter">Informal Letter</option>
              <option value="others">Others</option>
            </select>
            {errors.type && <p className="text-red-500">{errors.type.message}</p>}
          </div>

          <div>
            <h3 className="label label-text">Enter your custom text</h3>
            <textarea
              placeholder="Enter your custom text eg, Climate change is caused by..."
              className="textarea textarea-bordered w-full font-mono text-base"
              rows={12}
              cols={50}
              value={textValue}
              onChange={(e) => {
                if (!isPasting) {
                  setValue("text", e.target.value);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                setIsPasting(true);
                const pastedText = e.clipboardData.getData('text/plain');
                
                const textarea = e.target as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const beforeText = textValue.substring(0, start);
                const afterText = textValue.substring(end);
                
                const newText = beforeText + pastedText + afterText;
                setValue("text", newText);
                
                // Set cursor position after pasted text
                setTimeout(() => {
                  const newPosition = start + pastedText.length;
                  textarea.selectionStart = textarea.selectionEnd = newPosition;
                  setIsPasting(false);
                }, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue = textValue.substring(0, start) + '\n' + textValue.substring(end);
                  setValue("text", newValue);
                  
                  // Move cursor to after the new line
                  setTimeout(() => {
                    const newPosition = start + 1;
                    textarea.selectionStart = textarea.selectionEnd = newPosition;
                  }, 0);
                }
              }}
              style={{ whiteSpace: 'pre-wrap' }} // Preserve whitespace and newlines
            />
            {errors.text && <p className="text-red-500">{errors.text.message}</p>}
          </div>

          <button className="btn btn-success w-full mt-2" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
