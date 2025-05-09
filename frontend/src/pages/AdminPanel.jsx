import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${baseURL}/admin/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents", err);
    }
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${baseURL}/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Document uploaded successfully!");
        fetchDocuments(); // 🔥 Refresh documents after upload
      } else {
        const data = await res.json();
        alert("Upload failed: " + (data.detail || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Document Upload</h1>

      <div className="mb-6">
        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Upload Document
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Document Name</th>
              <th className="p-2 text-left">Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr key={doc.id} className="border-b">
                  <td className="p-2">{doc.filename}</td>
                  <td className="p-2">{new Date(doc.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 text-center">
                  No documents uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
