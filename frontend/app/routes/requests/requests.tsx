import PageLayout from "~/layouts/PageLayout";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/requests";
import { requireManager } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireManager(request);

  return null;
}

export default function Requests() {
  return (
    <PageLayout
      title="Zgłoszenia"
      actions={
        <Button asChild>
          <Link to="/requests/new">+ Dodaj zgłoszenie</Link>
        </Button>
      }
    ></PageLayout>
  );
}
