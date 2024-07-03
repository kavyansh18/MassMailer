import React, { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showRecipientsPopup, setShowRecipientsPopup] = useState(false);
  const [showAttachmentsPopup, setShowAttachmentsPopup] = useState(false);

  const handleAddRecipient = () => {
    if (newRecipient) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const handleDeleteRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleDeleteAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setAttachments([...attachments, ...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('recipients', JSON.stringify(recipients));
    formData.append('subject', subject);
    formData.append('body', body);
    attachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });

    axios.post('http://localhost:5001/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      console.log('success');
    })
    .catch((error) => {
      console.log('failure', error);
    });
  };

  return (
    <div className='flex justify-center align-items mt-6 gap-12'>
      <div>
        <h1>Welcome to MassMailer</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="w-[550px] h-[550px] mx-auto p-4 pt-6 pb-8 mb-4 rounded shadow-md">
          <label className="block mb-2 text-m font-bold text-white">Recipients:</label>
          <p
            className="text-sm text-red-600 cursor-pointer"
            onClick={() => setShowRecipientsPopup(true)}
          >
            {recipients.length} emails added
          </p>
          {showRecipientsPopup && (
            <div className="absolute bg-black px-3 rounded shadow-md w-[430px] h-[200px] overflow-y-auto">
              <div className='flex flex-row justify-between sticky top-0 bg-black pt-2'>
                <h2 className='text-[16px] font-bold mb-2 text-white'>Added Recipients</h2>
                <button
                  type="button"
                  onClick={() => setShowRecipientsPopup(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-[14px] mb-2"
                >
                  Close
                </button>
              </div>
              <ul>
                {recipients.map((recipient, index) => (
                  <li key={index} className='text-[16px] text-white flex justify-between mb-2'>
                    {recipient}
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipient(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded text-[13px]"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="email"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded"
          />
          <button
            type="button"
            onClick={handleAddRecipient}
            className="bg-gray-500 hover:bg-black text-white py-1 px-2 rounded text-[14px] my-2"
          >
            Add More
          </button>
          <br className="my-4" />
          <label className="block mb-2 text-m font-bold text-white" htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded"
          />
          <br className="my-4" />
          <label className="block my-2 text-m font-bold text-white " htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded h-24 resize-y overflow-y-auto"
          />
          <br className="my-4" />
          <label className="block mb-2 text-m font-bold text-white" htmlFor="attachments">Attachments:</label>
          <p
            className="text-sm text-red-600 cursor-pointer"
            onClick={() => setShowAttachmentsPopup(true)}
          >
            {attachments.length} files selected
          </p>
          {showAttachmentsPopup && (
            <div className="absolute bg-black px-3 rounded shadow-md w-[430px] h-[95px] overflow-y-auto">
              <div className='flex flex-row justify-between sticky top-0 bg-black pt-2'>
                <h2 className='text-[16px] font-bold mb-2 text-white'>Added Attachments</h2>
                <button
                  type="button"
                  onClick={() => setShowAttachmentsPopup(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-[14px] mb-2"
                >
                  Close
                </button>
              </div>
              <ul>
                {attachments.map((attachment, index) => (
                  <li key={index} className='text-[14px] text-white flex justify-between mb-2 '>
                    {attachment.name}
                    <button
                      type="button"
                      onClick={() => handleDeleteAttachment(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded text-[14px]"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded"
          />
          <br className="my-4" />
          <button
            type="submit"
            className="mt-4 text-[16px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-[200px]"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}
