import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/saved-text")({
  component: RouteComponent,
});

function RouteComponent() {
  const [existingData, setExistingData] = useState<
    { id: string; label: string; text: string }[]
  >([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

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

  const editData = () => {
    if (itemToEdit) {
      console.log("Editing data with id:", itemToEdit);
      const dataAfterEdit = existingData.map((data) =>
        data.id === itemToEdit ? { ...data, text: editText } : data
      );
      console.log(dataAfterEdit);

      localStorage.setItem("customTextData", JSON.stringify(dataAfterEdit));
      setExistingData(dataAfterEdit);
      setItemToEdit(null);
      setEditText("");
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Custom Text</h1>
          <Link to="/custom-text">
            <button className="btn btn-sm btn-success">Create</button>
          </Link>
        </div>
        <Link to="/guide">
          <button className="btn btn-outline btn-success gap-2">
            <BookOpen className="w-4 h-4" />
            View Guide
          </button>
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
                  <label
                    htmlFor="my_modal_7"
                    className="btn btn-sm"
                    onClick={() => {
                      setItemToEdit(data.id);
                      setEditText(data.text);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </label>
                </div>
              </div>
              <p className="font-light text-sm">{data.text.slice(0, 150)}...</p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <Link
                to="/practice"
                className="w-full btn"
                search={{ savedTextId: parseInt(data.id) }}
              >
                Practice
              </Link>
            </div>
          </div>
        ))}
      </div>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {itemToEdit && (
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Text</h3>
            <textarea
              className="textarea h-96 textarea-bordered w-full"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setItemToEdit(null)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={editData}>
                Save
              </button>
            </div>
          </div>
          <label className="modal-backdrop" onClick={() => setItemToEdit(null)}>
            Close
          </label>
        </div>
      )}
    </div>
  );
}
