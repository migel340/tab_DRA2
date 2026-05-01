import { Card, CardContent, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface SectionProps {
  headerName: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Section({
  headerName,
  children,
  className,
}: SectionProps) {
  return (
    <Card className="rounded-xl shadow-none ring-stone-300 py-8 px-4">
      <CardTitle className="pl-4">{headerName} </CardTitle>
      <Separator />
      <CardContent className={className}>{children}</CardContent>
    </Card>
  );
}
