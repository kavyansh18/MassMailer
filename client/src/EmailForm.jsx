import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import logo from "../src/assets/logo.png";

export default function EmailForm() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showRecipientsPopup, setShowRecipientsPopup] = useState(false);
  const [showRecipientsPopupFile, setShowRecipientsPopupFile] = useState(false);
  const [showAttachmentsPopup, setShowAttachmentsPopup] = useState(false);
  const [loginButtonText, setLoginButtonText] = useState("Login");
  const [sendButtonText, setSendButtonText] = useState("Send Email");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitcred = (event) => {
    event.preventDefault();
    // console.log("User ID:", userId);
    // console.log("Password:", password);
    setLoginButtonText("Logged In");
  };

  const handleAddRecipient = () => {
    if (newRecipient) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
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

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const emails = XLSX.utils
          .sheet_to_json(worksheet, { header: 1 })
          .flat()
          .filter((email) => email.includes("@"));
        setRecipients([...recipients, ...emails]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSendButtonText("Sending...");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("password", password);
    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", subject);
    formData.append("body", body);
    attachments.forEach((attachment) => {
      formData.append("attachments", attachment);
    });

    axios
      .post("http://localhost:5001/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSendButtonText("Sent");
        alert("Sent successfully!");
      })
      .catch(() => {
        setSendButtonText("Send Email");
        console.log("failure");
      });
  };

  return (
    <div>
      <div>
        <form
          onSubmit={handleSubmitcred}
          className="w-[390px] lg:w-[1200px] mx-auto rounded shadow-md flex flex-col justify-center items-center lg:gap-3 sm:flex-row"
        >
          <div>
            <label className="block text-m font-bold" htmlFor="userId">
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-[270px]  px-3 py-1 text-sm bg-gray-500 rounded"
              placeholder="Enter your Gmail Id"
            />
          </div>
          <div>
            <label className="block text-m font-bold" htmlFor="password">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[270px] px-3 py-1 text-sm bg-gray-500 rounded"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 py-1 text-[13px] bg-gray-300 rounded"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-5 rounded text-[14px]"
            >
              {loginButtonText}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center align-items lg:gap-12 gap-1 flex-col sm:flex-row">
        <div className="w-[390px] mt-3 flex flex-col justify-center align-items lg:mb-[140px] sm:my-12">
          <div className="flex justify-center align-items lg:ml-14">
            <img className="w-[160px]" src={logo} alt="" />
          </div>
          <h1 className="text-white mb-1 lg:text-right lg:direction-rtl text-[30px] text-center">
            Welcome to MassMailer
          </h1>
          <h1 className="text-white mb-1 lg:text-right lg:direction-rtl text-blue-400 text-center">
            Reach Your Audience with One Click
          </h1>
          <p className="text-white lg:text-right lg:direction-rtl text-[12px] text-center">
            The ultimate solution for all your email marketing needs. Our
            massmailer allows you to send personalized emails to thousands of
            recipients in just a few clicks, making it the perfect tool for
            businesses, marketers, and information spreaders.
          </p>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="lg:w-[550px] w-[390px] h-[550px] mx-auto p-4 pt-6 pb-8 mb-4 rounded shadow-md"
          >
            <div className="flex justify-center gap-4 ">
              <div>
                <label className="block mb-2 text-m font-bold text-white">
                  Recipients:
                </label>
                <p
                  className="text-sm text-red-600 cursor-pointer"
                  onClick={() => setShowRecipientsPopup(true)}
                >
                  {recipients.length} emails added
                </p>
                {showRecipientsPopup && (
                  <div className="absolute bg-black px-3 rounded shadow-md w-[430px] h-[200px] overflow-y-auto">
                    <div className="flex flex-row justify-between sticky top-0 bg-black pt-2">
                      <h2 className="text-[16px] font-bold mb-2 text-white">
                        Added Recipients
                      </h2>
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
                        <li
                          key={index}
                          className="text-[16px] text-white flex justify-between mb-2"
                        >
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
              </div>
              <div className="flex flex-col justify-start">
                <label
                  className="block mb-2 text-m font-bold text-white"
                  htmlFor="excel"
                >
                  Upload Excel File:
                </label>
                <p
                  className="text-sm text-red-600 cursor-pointer"
                  onClick={() => setShowRecipientsPopupFile(true)}
                >
                  {recipients.length} emails added
                </p>
                {showRecipientsPopupFile && (
                  <div className="absolute bg-black px-3 rounded shadow-md w-[430px] h-[200px] overflow-y-auto">
                    <div className="flex flex-row justify-between sticky top-0 bg-black pt-2">
                      <h2 className="text-[16px] font-bold mb-2 text-white">
                        Added Recipients
                      </h2>
                      <button
                        type="button"
                        onClick={() => setShowRecipientsPopupFile(false)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-[14px] mb-2"
                      >
                        Close
                      </button>
                    </div>
                    <ul>
                      {recipients.map((recipient, index) => (
                        <li
                          key={index}
                          className="text-[16px] text-white flex justify-between mb-2"
                        >
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
                  type="file"
                  id="excel"
                  accept=".xlsx, .xls"
                  onChange={handleExcelChange}
                  className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded h-[37px]"
                />
                <br className="my-4" />
              </div>
            </div>
            <label
              className="block mb-2 text-m font-bold text-white"
              htmlFor="subject"
            >
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded"
            />
            <br className="my-4" />
            <label
              className="block my-2 text-m font-bold text-white"
              htmlFor="body"
            >
              Body:
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 text-sm text-white bg-gray-500 rounded h-24 resize-y overflow-y-auto"
            />
            <br className="my-4" />
            <label
              className="block mb-2 text-m font-bold text-white"
              htmlFor="attachments"
            >
              Attachments:
            </label>
            <p
              className="text-sm text-red-600 cursor-pointer"
              onClick={() => setShowAttachmentsPopup(true)}
            >
              {attachments.length} files selected
            </p>
            {showAttachmentsPopup && (
              <div className="absolute bg-black px-3 rounded shadow-md w-[430px] h-[95px] overflow-y-auto">
                <div className="flex flex-row justify-between sticky top-0 bg-black pt-2">
                  <h2 className="text-[16px] font-bold mb-2 text-white">
                    Added Attachments
                  </h2>
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
                    <li
                      key={index}
                      className="text-[14px] text-white flex justify-between mb-2"
                    >
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
              className="mt-4 text-[16px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded lg:ml-[200px] ml-[120px]"
            >
              {sendButtonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
