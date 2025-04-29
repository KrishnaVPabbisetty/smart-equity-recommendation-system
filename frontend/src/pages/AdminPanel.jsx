import { useState } from 'react';

export default function AdminPanel() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Apple_Q2_Results.pdf', date: '2025-04-20' },
    { id: 2, name: 'Tesla_Earnings_2025.pdf', date: '2025-04-22' },
    { id: 3, name: 'Meta_Annual_Report.pdf', date: '2025-04-25' },
  ]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([...documents, newDoc]);
    }
  };

  const handleRemove = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

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
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-b">
                <td className="p-2">{doc.name}</td>
                <td className="p-2">{doc.date}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemove(doc.id)}
                    className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
