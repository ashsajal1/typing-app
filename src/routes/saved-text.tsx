import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/saved-text")({
  component: RouteComponent,
});

function RouteComponent() {
  const [existingData, setExistingData] = useState<
    { id: number; label: string; text: string }[]
  >([]);

  useEffect(() => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("customTextData");
    if (existingData) {
      setExistingData(JSON.parse(existingData));
    }
  }, [existingData]);

  return (
    <div className="p-2">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">Custom Text</h1>
        <Link to="/custom-text">
          <button className="btn btn-sm btn-success">Create</button>
        </Link>
      </div>
      <div className="grid gird-cols-1 md:grid-cols-2 gap-4 w-full">
        {existingData.map((data, index) => (
          <div
            className="flex flex-col justify-between items-center w-full shadow p-2 border border-base-200 rounded"
            key={index}
          >
            <div className="card-body">
              <div>
                <p className="card-title">{data.label.slice(0, 50)}...</p>
                <div className="flex o items-center gap-2">
                  <button className="btn btn-primary btn-sm">Edit</button>
                  <button className="btn btn-error btn-sm">Delete</button>
                </div>
              </div>
              <p className="font-light text-sm">{data.text.slice(0, 150)}...</p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <Link to="/practice" search={{ savedTextId: data.id }}>
                <button className="btn w-full">Practice</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
