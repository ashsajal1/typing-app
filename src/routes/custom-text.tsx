import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/custom-text")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full p-2">
      <h1 className="label">Enter text label</h1>

      <input
        type="text"
        className="input input-bordered mb-2 w-full"
        placeholder="Enter label, eg. Paragraph about Climate Change etc.."
      />

      <h3 className="label label-text">Enter your custom text</h3>
      <textarea
        placeholder="Enter your custom text eg, Climate change is caused by..."
        className="textarea textarea-bordered w-full"
        rows={12}
        cols={50}
        name=""
        id=""
      ></textarea>

      <button className="btn btn-success w-full">Submit</button>
    </div>
  );
}
