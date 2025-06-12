import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2, BookOpen, Download, Upload, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { SEO } from '../components/SEO'

type TextType = "all" | "paragraph" | "composition" | "formal-letter" | "informal-letter" | "others";

export const Route = createFileRoute("/saved-text")({
  component: () => (
    <>
      <SEO 
        title="Saved Text"
        description="Access your saved typing practice texts. Review and practice with your previously created or imported content."
        keywords={['saved typing text', 'practice history', 'saved content', 'typing practice library']}
      />
      <RouteComponent />
    </>
  ),
});

function RouteComponent() {
  const [existingData, setExistingData] = useState<
    { id: string; label: string; text: string; type: TextType }[]
  >([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editType, setEditType] = useState<TextType>("paragraph");
  const [editLabel, setEditLabel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<TextType>("all");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem("customTextData");
    if (existingData) {
      const data: {
        id: string;
        label: string;
        text: string;
        time: typeof Date;
        type: TextType;
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
        data.id === itemToEdit ? { ...data, text: editText, type: editType, label: editLabel } : data
      );
      console.log(dataAfterEdit);

      localStorage.setItem("customTextData", JSON.stringify(dataAfterEdit));
      setExistingData(dataAfterEdit);
      setItemToEdit(null);
      setEditText("");
      setEditLabel("");
      setEditType("paragraph");
    }
  };

  // Export data as JSON file
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(existingData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `typing-practice-texts-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import data from JSON file
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);

        if (!Array.isArray(jsonData)) {
          alert('Invalid JSON format. Expected an array of objects.');
          return;
        }

        const newData = jsonData
          .filter((item: Record<string, unknown>): item is {id:string; label:string; text:string; type?: TextType} =>
            typeof item.id === 'string' && typeof item.label === 'string' && typeof item.text === 'string')
          .map(item => ({
            id: item.id,
            label: item.label,
            type: (item.type as TextType) || 'paragraph',
            text: item.text,
          }));

        // Merge with existing data, avoiding duplicates
        const mergedData = [...existingData];
        newData.forEach(newItem => {
          if (!mergedData.some(existing => existing.id === newItem.id)) {
            mergedData.push(newItem);
          }
        });

        localStorage.setItem("customTextData", JSON.stringify(mergedData));
        setExistingData(mergedData);
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    localStorage.removeItem("customTextData");
    setExistingData([]);
    setShowResetConfirm(false);
  };

  const filteredData = existingData.filter(
    (data) => selectedType === "all" || data.type === selectedType
  );

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Custom Text</h1>
          <Link to="/custom-text">
            <button className="btn btn-sm btn-success">Create</button>
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={exportToJSON}
              className="btn btn-sm btn-outline gap-2"
              disabled={existingData.length === 0}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <label className="btn btn-sm btn-outline gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import JSON</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={importFromJSON}
              />
            </label>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-sm btn-error gap-2"
              disabled={existingData.length === 0}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <select 
            className="select select-bordered w-full sm:w-48"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TextType)}
          >
            <option value="all">All Types</option>
            <option value="paragraph">Paragraph</option>
            <option value="composition">Composition</option>
            <option value="formal-letter">Formal Letter</option>
            <option value="informal-letter">Informal Letter</option>
            <option value="others">Others</option>
          </select>
          <Link to="/guide" className="w-full sm:w-auto">
            <button className="btn btn-outline btn-success gap-2 w-full">
              <BookOpen className="w-4 h-4" />
              View Guide
            </button>
          </Link>
        </div>
      </div>
      <div className="grid gird-cols-1 md:grid-cols-2 gap-4 w-full">
        {filteredData.map((data) => (
          <div
            className="flex flex-col justify-between items-center w-full shadow p-3 gap-2 border border-base-200 rounded"
            key={data.id}
          >
            <div className="w-full">
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <p className="card-title">{data.label.slice(0, 50)}...</p>
                  <span className={`badge ${
                    !data.type || data.type === 'paragraph' ? 'badge-primary' :
                    data.type === 'composition' ? 'badge-secondary' :
                    data.type === 'formal-letter' ? 'badge-accent' :
                    data.type === 'informal-letter' ? 'badge-info' :
                    'badge-ghost'
                  }`}>
                    {!data.type ? 'Others' :
                     data.type === 'formal-letter' ? 'Formal Letter' :
                     data.type === 'informal-letter' ? 'Informal Letter' :
                     data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                  </span>
                </div>

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
                      setEditType(data.type);
                      setEditLabel(data.label);
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
                search={{ 
                  savedTextId: parseInt(data.id),
                  eclipsedTime: 60,
                  topic: data.type || 'paragraph'
                }}
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
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="label">Title</h4>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Enter title for your text"
                />
              </div>
              <div>
                <h4 className="label">Text Type</h4>
                <select 
                  className="select select-bordered w-full"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as TextType)}
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="composition">Composition</option>
                  <option value="formal-letter">Formal Letter</option>
                  <option value="informal-letter">Informal Letter</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <h4 className="label">Text Content</h4>
                <textarea
                  className="textarea h-96 textarea-bordered w-full"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>
            </div>
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

      {/* Reset Confirmation Modal */}
      <input
        type="checkbox"
        id="reset_modal"
        className="modal-toggle"
        checked={showResetConfirm}
        onChange={(e) => setShowResetConfirm(e.target.checked)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Reset All Texts</h3>
          <p className="py-4">
            Are you sure you want to delete all saved texts? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button 
              className="btn"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="btn btn-error"
            >
              Yes, Reset All
            </button>
          </div>
        </div>
        <label className="modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          Close
        </label>
      </div>
    </div>
  );
}
