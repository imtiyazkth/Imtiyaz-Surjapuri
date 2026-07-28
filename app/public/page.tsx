// This route is superseded by the root app/page.tsx homepage.
// Redirect to root to avoid conflicts.
import { redirect } from "next/navigation";
export default function PublicHomePage() {
  redirect("/");
}
