import { redirect } from "next/navigation";

/**
 * Route lama /produk digantikan section #produk di single-page.
 * Redirect aman ke anchor — tidak ada page baru, tidak duplikat konten.
 */
export default function ProdukPage() {
  redirect("/#produk");
  return null;
}