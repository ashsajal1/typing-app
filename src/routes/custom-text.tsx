import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const Route = createFileRoute("/custom-text")({
  component: RouteComponent,
});

const formSchema = z.object({
  label: z.string().min(5, "Label must be at least 5 characters long"),
  text: z.string().min(20, "Text must be at least 20 characters long"),
});

function RouteComponent() {
  // Form state management
  const [formValues, setFormValues] = useState({ label: "", text: "" });
  const [isAdded, setIsAdded] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // useForm hook for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Handle form submission
  const onSubmit = (data: { label: string; text: string }) => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("customTextData");

    // Parse the existing data or initialize an empty array if none exists
    const dataArray = existingData ? JSON.parse(existingData) : [];

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
    dataArray.push(data);

    // Save the updated array back to localStorage
    localStorage.setItem("customTextData", JSON.stringify(dataArray));

    // Manually clear the form fields by updating the state
    setFormValues({ label: "", text: "" });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="w-full p-2">
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
      <h1 className="label">Enter text label</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="input input-bordered mb-2 w-full"
          placeholder="Enter label, eg. Paragraph about Climate Change etc.."
          {...register("label")}
          value={formValues.label}
          onChange={(e) =>
            setFormValues({ ...formValues, label: e.target.value })
          }
        />
        {errors.label && <p className="text-red-500">{errors.label.message}</p>}

        <h3 className="label label-text">Enter your custom text</h3>
        <textarea
          placeholder="Enter your custom text eg, Climate change is caused by..."
          className="textarea textarea-bordered w-full"
          rows={12}
          cols={50}
          {...register("text")}
          value={formValues.text}
          onChange={(e) =>
            setFormValues({ ...formValues, text: e.target.value })
          }
        ></textarea>
        {errors.text && <p className="text-red-500">{errors.text.message}</p>}

        <button className="btn btn-success w-full mt-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
