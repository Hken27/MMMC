import { redirect } from "next/navigation";

/**
 * Route lama /kontak digantikan section #kontak di single-page.
 */
export default function KontakPage() {
  redirect("/#kontak");
  return null;
}