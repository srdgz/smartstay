import { useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
    toast.success("Message submitted successfully");
  };

  return (
    <div className="container mx-auto px-4 my-8 max-w-lg">
      <form
        className="bg-white shadow-lg rounded-lg p-6 dark:bg-[#212529]"
        onSubmit={handleSubmit}
      >
        <label className="block mb-4 dark:text-white">
          Your name:
          <input
            className="form-input mt-1 block w-full border-2 rounded-lg p-2 dark:text-black"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4 dark:text-white">
          Your e-mail:
          <input
            className="form-input mt-1 block w-full border-2 rounded-lg p-2 dark:text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4 dark:text-white">
          Your message:
          <textarea
            className="form-input mt-1 block w-full border-2 rounded-lg p-2 dark:text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn-primary w-full mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
