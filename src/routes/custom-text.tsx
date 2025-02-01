import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/custom-text")({
  component: RouteComponent,
});

const formSchema = z.object({
  label: z.string().min(5, "Label must be at least 5 characters long"),
  text: z.string().min(20, "Text must be at least 20 characters long"),
});

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

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
      return; // Stop if it's a duplicate
    }

    // Push the new data to the array if no duplicate is found
    dataArray.push(data);

    // Save the updated array back to localStorage
    localStorage.setItem("customTextData", JSON.stringify(dataArray));
  };

  return (
    <div className="w-full p-2">
      <h1 className="label">Enter text label</h1>
      <input
        type="text"
        className="input input-bordered mb-2 w-full"
        placeholder="Enter label, eg. Paragraph about Climate Change etc.."
        {...register("label")}
      />
      {errors.label && <p className="text-red-500">{errors.label.message}</p>}

      <h3 className="label label-text">Enter your custom text</h3>
      <textarea
        placeholder="Enter your custom text eg, Climate change is caused by..."
        className="textarea textarea-bordered w-full"
        rows={12}
        cols={50}
        {...register("text")}
      ></textarea>
      {errors.text && <p className="text-red-500">{errors.text.message}</p>}

      <button
        className="btn btn-success w-full mt-2"
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </button>
    </div>
  );
}
