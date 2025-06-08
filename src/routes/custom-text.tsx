import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { BookOpen } from "lucide-react";
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
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const navigate = useNavigate();

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
      setIsDuplicate(true);
      setTimeout(() => {
        setIsDuplicate(false);
      }, 2000);
      return; // Stop if it's a duplicate
    }

    // Push the new data to the array if no duplicate is found
    dataArray.push(newData);

    // Save the updated array back to localStorage
    localStorage.setItem("customTextData", JSON.stringify(dataArray));

    navigate({
      to: `/practice?savedTextId=${newData.id}`,
    })

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
        <Link to="/guide">
          <button className="btn btn-outline btn-success gap-2">
            <BookOpen className="w-4 h-4" />
            View Guide
          </button>
        </Link>
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
          <span>Your text has been saved!</span>
        </div>
      )}

      {isDuplicate && (
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
          <span>Error! Duplicate text found.</span>
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
