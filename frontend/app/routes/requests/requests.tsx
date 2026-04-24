import PageLayout from "~/layouts/PageLayout";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export const handle = {
  breadcrumb: () => "Lista zgłoszeń",
};

export default function Requests() {
  return (
    <PageLayout
      title="Lista zgłoszeń"
      actions={
        <Button asChild>
          <Link to="/requests/new">+ Dodaj zgłoszenie</Link>
        </Button>
      }
    >
      <div>
        <p>To jest zawartość strony z listą zgłoszeń.</p>
        <p>Powyżej powinieneś widzieć tytuł, breadcrumbs i przycisk akcji.</p>
      </div>
    </PageLayout>
  );
}
