"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const defaultFormData = {
  name: "",
  email: "",
  password: "",
};

const Auth = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const inputStyles =
    "border border-gray-300 sm:text-sm text-black placeholder:text-gray-600 rounded-lg block w-full p-2.5";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [router, session]);

  const loginHandler = async (provider?: string) => {
    try {
      await signIn(provider);
      router.push("/");
    } catch (error) {
      toast.error("Algo no fue bien.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await signUp(formData);
      if (user) {
        toast.success("Registrado correctamente. Por favor, inicia sesión.");
      }
    } catch (error) {
      toast.error("Algo no fue bien.");
    } finally {
      setFormData(defaultFormData);
    }
  };

  return (
    <section className="container mx-auto">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 md:w-[70%] mx-auto">
        <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Create an account
          </h1>
          <p>or</p>
          <span className="inline-flex items-center">
            <button
              type="button"
              onClick={() => loginHandler("github")}
              aria-label="Sign in with GitHub"
              className="mr-3"
            >
              <AiFillGithub
                aria-hidden="true"
                className="text-4xl text-black dark:text-white"
              />
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => loginHandler("google")}
              aria-label="Sign in with Google"
              className="ml-3"
            >
              <FcGoogle aria-hidden="true" className="text-4xl" />
            </button>
          </span>
        </div>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <label htmlFor="auth-name" className="sr-only">
            Name
          </label>
          <input
            id="auth-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
            className={inputStyles}
            value={formData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="auth-email" className="sr-only">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="email@email.com"
            required
            className={inputStyles}
            value={formData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="auth-password" className="sr-only">
            Password (at least 8 characters)
          </label>
          <input
            id="auth-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Your password"
            required
            minLength={8}
            className={inputStyles}
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="w-full bg-tertiary-dark text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
        </form>
        <button
          type="button"
          onClick={() => loginHandler()}
          className="text-blue-700 underline dark:text-blue-300"
        >
          Sign In
        </button>
      </div>
    </section>
  );
};

export default Auth;
