import { redirect } from "next/navigation";

/**
 * Route lama /service digantikan section #service di single-page.
 */
export default function ServicePage() {
  redirect("/#service");
  return null;
}