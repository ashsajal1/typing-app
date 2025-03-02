import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/saved-text")({
  component: RouteComponent,
});

function RouteComponent() {
  const [existingData, setExistingData] = useState<
    { id: string; label: string; text: string }[]
  >([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("customTextData");
    if (existingData) {
      const data: {
        id: string;
        label: string;
        text: string;
        time: typeof Date;
      }[] = JSON.parse(existingData);
      setExistingData(data);
    }
  }, []);

  const deleteData = () => {
    if (itemToDelete) {
      console.log("Deleting data with id:", itemToDelete);
      const dataAfterDeletion = existingData.filter(
        (data) => data.id !== itemToDelete
      );
      console.log(dataAfterDeletion);

      localStorage.setItem("customTextData", JSON.stringify(dataAfterDeletion));
      setExistingData(dataAfterDeletion);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">Custom Text</h1>
        <Link to="/custom-text">
          <button className="btn btn-sm btn-success">Create</button>
        </Link>
      </div>
      <div className="grid gird-cols-1 md:grid-cols-2 gap-4 w-full">
        {existingData.map((data) => (
          <div
            className="flex flex-col justify-between items-center w-full shadow p-3 gap-2 border border-base-200 rounded"
            key={data.id}
          >
            <div>
              <div className="flex items-center justify-between py-4">
                <p className="card-title">{data.label.slice(0, 50)}...</p>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="my_modal_6"
                    className="btn btn-error btn-sm"
                    onClick={() => setItemToDelete(data.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </label>

                  {/* Show dialog here */}
                  <input
                    type="checkbox"
                    id="my_modal_6"
                    className="modal-toggle"
                  />
                  <div className="modal" role="dialog">
                    <div className="modal-box">
                      <h3 className="text-lg font-bold">Confirm Delete!</h3>
                      <p className="py-4">
                        Are you sure you want to delete this text?
                      </p>
                      <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn">
                          Cancel
                        </label>
                        <label
                          onClick={deleteData}
                          htmlFor="my_modal_6"
                          className="btn btn-error"
                        >
                          Yes, delete
                        </label>
                      </div>
                    </div>

                    <label className="modal-backdrop" htmlFor="my_modal_6">
                      Close
                    </label>
                  </div>
                  <button className="btn btn-sm">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-light text-sm">{data.text.slice(0, 150)}...</p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <Link
                to="/practice"
                className="w-full btn"
                search={{ savedTextId: data.id }}
              >
                Practice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
