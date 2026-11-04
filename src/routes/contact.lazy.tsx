import { createLazyFileRoute } from "@tanstack/react-router";
import { usePostContactMutation } from "../api/pizzaApi";
import type { SubmitEvent } from "react";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  function getString(formData: FormData, key: string): string {
    const value = formData.get(key);

    return typeof value === "string" ? value : "";
  }

  const [postContact, mutation] = usePostContactMutation();
  function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mutation.isLoading) return;
    const formData = new FormData(e.currentTarget);
    void postContact({
      name: getString(formData, "name"),
      email: getString(formData, "email"),
      message: getString(formData, "message"),
    });
  }

  return (
    <div className="px-4">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3 className="m-[50px] text-center font-pacifico text-[30px] font-normal text-secondary">
          Terkirim!
        </h3>
      ) : (
        <form
          action=""
          onSubmit={submit}
          className="flex flex-col items-center"
        >
          <label htmlFor="contact-name" className="sr-only">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Name"
            className="form-input w-[500px] max-w-full rounded-[5px] border-2 border-border p-2 my-[15px] focus:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:bg-[#999]"
          />
          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Email"
            className="form-input w-[500px] max-w-full rounded-[5px] border-2 border-border p-2 my-[15px] focus:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:bg-[#999]"
          />
          <label htmlFor="contact-message" className="sr-only">
            Message
          </label>
          <textarea
            className="form-input w-[500px] max-w-full rounded-[5px] border-2 border-border p-2 my-[15px] focus:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:bg-[#999] min-h-[200px]"
            name="message"
            placeholder="Message"
            id="contact-message"
          ></textarea>
          {mutation.isError && (
            <p role="alert">Pesan gagal dikirim. Silakan coba lagi.</p>
          )}
          <button className="btn" disabled={mutation.isLoading}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
