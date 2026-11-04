import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import postContact from "../api/postContact";
import type { SubmitEvent } from "react";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  function getString(formData: FormData, key: string): string {
    const value = formData.get(key);

    return typeof value === "string" ? value : "";
  }

  const mutation = useMutation({
    mutationFn: function (e: SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postContact(
        getString(formData, "name"),
        getString(formData, "email"),
        getString(formData, "message"),
      );
    },
  });

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
          onSubmit={mutation.mutate}
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
          <button className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}
