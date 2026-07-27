import { redirect } from "next/navigation";

// Root page: redirect to the public home inside the (public) route group
export default function RootPage() {
  redirect("/");
}
