import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import eyeOpenIcon from "../src/assets/eye-open.svg";
import eyeClosedIcon from "../src/assets/eye-closed.svg";
import "./font.css";
import HashLoader from "react-spinners/HashLoader";
import { Button } from "./UI/MovingBorder.jsx";

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleSubmitcred = (event) => {
    event.preventDefault();
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

  const resetForm = () => {
    setRecipients([]);
    setNewRecipient("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setSendButtonText("Send Email");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSendButtonText("Sending...");
    setLoading(true);
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
      .post("https://massmailer-pdje.onrender.com", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(false);
        setSendButtonText("Sent");
        setTimeout(() => {
          alert("Sent successfully!");
          resetForm();
        }, 100);
      })
      .catch(() => {
        setLoading(false);
        setSendButtonText("Send Email");
        setTimeout(() => {
          alert("Failed to send email!");
          resetForm();
        }, 100);
        //console.log("failure");
      });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen lg:mt-5">
      {loading ? (
        <HashLoader
          color={"#0E46A3"}
          loading={loading}
          size={50}
          className="mb-[160px] lg:mb-[80px]"
        />
      ) : (
        <div>
          <div>
            <form
              onSubmit={handleSubmitcred}
              className="w-[390px] lg:w-[1200px] mx-auto rounded shadow-md flex flex-col justify-center items-center lg:gap-3 sm:flex-row lg:mt-5 gap-3 lg:mr-[63px] "
            >
              <div className="font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
                Sender Details:
              </div>
              <div>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-[290px] text-white px-3 py-1 text-sm bg-black border border-blue-400 rounded-lg shadow-sm bg-transparent"
                  placeholder="Enter your Gmail Id"
                />
              </div>
              <div>
                <div className="relative">
                  <div className="lg:mt-7">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-[290px] text-white px-3 py-[5px] text-sm bg-black border border-blue-400 rounded-lg shadow-sm bg-transparent"
                      placeholder="Enter your Gmail App Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute mt-1 right-1 px-4 py-1 text-[13px] bg-gray-300 rounded"
                    >
                      {showPassword ? (
                        <img
                          src={eyeClosedIcon}
                          alt="Hide"
                          className="h-4 w-4"
                        />
                      ) : (
                        <img src={eyeOpenIcon} alt="Show" className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div>
                    <a
                      href="https://www.youtube.com/watch?v=27NianZC7Wk"
                      target="_blank"
                      className=" lg:text-right lg:direction-rtl text-[12px] text-center mt-1 hover:text-blue-400 bg-gradient-to-r from-blue-200 to-cyan-200 text-transparent bg-clip-text mb-3 ml-1"
                    >
                      <span className="text-red-500 text-lg ">*</span>How to
                      generate Gmail App Password?
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  type="submit"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white backdrop-blur-3xl">
                    {loginButtonText}
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-center align-items lg:gap-12 gap-1 flex-col sm:flex-row">
            <div>
              <form
                onSubmit={handleSubmit}
                className="lg:w-[650px] w-[390px] h-[550px] mx-auto p-4 pt-3 pb-8 mb-4 rounded shadow-md"
              >
                <div className="lg:flex lg:justify-center gap-8 ">
                  <div>
                    <label className="block mb-2 text-m font-bold block mb-2 text-m font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
                      Recipients:
                    </label>
                    <p
                      className="text-sm bg-gradient-to-tl from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text cursor-pointer"
                      onClick={() => setShowRecipientsPopup(true)}
                    >
                      {recipients.length} emails added
                    </p>
                    {showRecipientsPopup && (
                      <div className="absolute bg-black px-3 rounded shadow-md lg:w-[380px] w-[360px] h-[200px] overflow-y-auto">
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
                      className="w-full px-3 py-2 text-sm text-white bg-black border border-gray-500 rounded-lg shadow-sm bg-transparent"
                    />
                    <button
                      className="inline-flex h-7 mt-1 mb-2 animate-shimmer items-center justify-center rounded-md border border-blue-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
                      type="button"
                      onClick={handleAddRecipient}
                    >
                      Add Reciptent
                    </button>
                  </div>
                  <div className="flex flex-col justify-start">
                    <label
                      className="block mb-2 text-m font-bold lg:ml-3 block mb-2 text-m font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text lg:mt-1 mt-3"
                      htmlFor="excel"
                    >
                      Upload Excel File:
                    </label>
                    <p
                      className="text-sm bg-gradient-to-tl from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text cursor-pointer lg:ml-3"
                      onClick={() => setShowRecipientsPopupFile(true)}
                    >
                      {recipients.length} emails added
                    </p>
                    {showRecipientsPopupFile && (
                      <div className="absolute bg-black px-3 rounded shadow-md lg:w-[380px] w-[360px] h-[200px] overflow-y-auto">
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
                      className="w-full shadow-sm bg-transparent px-3 py-2 text-sm text-white bg-black rounded-lg h-[37px]"
                    />
                    <br className="my-4" />
                  </div>
                </div>
                <label
                  className="block mb-2 text-m font-bold block mb-2 text-m font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text"
                  htmlFor="subject"
                >
                  Subject:
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white bg-black border border-gray-500 rounded-lg shadow-sm bg-transparent"
                />
                <br className="my-4" />
                <label
                  className="block my-2 text-m font-bold block mb-2 text-m font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text"
                  htmlFor="body"
                >
                  Body:
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white bg-black border border-gray-500 rounded-lg h-24 resize-y overflow-y-auto shadow-sm bg-transparent"
                />
                <br className="my-4" />
                <label
                  className="block mb-2 text-m font-bold block mb-2 text-m font-bold bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text"
                  htmlFor="attachments"
                >
                  Attachments:
                </label>
                <p
                  className="text-sm bg-gradient-to-tl from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text cursor-pointer"
                  onClick={() => setShowAttachmentsPopup(true)}
                >
                  {attachments.length} files selected
                </p>
                {showAttachmentsPopup && (
                  <div className="absolute bg-black px-3 rounded shadow-md lg:w-[520px] w-[360px] h-[95px] overflow-y-auto">
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
                  className="w-full px-3 py-2 text-sm text-white bg-black border border-gray-500 rounded-lg shadow-sm bg-transparent"
                />
                <br className="my-4" />
                <div className="flex justify-center items-center mt-3">
                  <Button
                    borderRadius="1.75rem"
                    className="bg-slate-900 text-white border-slate-800 text-[18px] "
                    type="submit"
                  >
                    {sendButtonText}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
