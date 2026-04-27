import { Card, CardContent, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface SectionProps {
  headerName: string;
  children?: React.ReactNode;
}

export default function Section({ headerName, children }: SectionProps) {
  return (
    <Card className="rounded-xl shadow-none ring-stone-300 py-8 px-4">
      <CardTitle className="pl-8">{headerName} </CardTitle>
      <Separator />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
