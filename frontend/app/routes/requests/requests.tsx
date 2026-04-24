import PageLayout from "~/layouts/PageLayout";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export const handle = {
  breadcrumb: () => "Lista",
};

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
