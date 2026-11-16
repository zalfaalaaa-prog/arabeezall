"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingLabel
}: {
  children: React.ReactNode;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
