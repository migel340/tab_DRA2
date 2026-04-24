import PageLayoutWrapper from "~/components/layout/PageLayoutWrapper";
import { Button } from "~/components/ui/button"; 
import { Link } from "react-router"; 

export default function Requests() {
  return (
    <PageLayoutWrapper
      title="Lista zgłoszeń"
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Zgłoszenia" },
      ]}
      actions={<Button asChild><Link to="/requests/new">+ Dodaj zgłoszenie</Link></Button>}
    >
      {/* Tutaj będzie właściwa zawartość strony z listą zgłoszeń */}
      <div>
        <p>To jest zawartość strony z listą zgłoszeń.</p>
        <p>Powyżej powinieneś widzieć tytuł, breadcrumbs i przycisk akcji.</p>
      </div>
    </PageLayoutWrapper>
  );
}
