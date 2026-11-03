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
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3>Terkirim!</h3>
      ) : (
        <form action="" onSubmit={mutation.mutate}>
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea name="message" placeholder="Message" id=""></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}
