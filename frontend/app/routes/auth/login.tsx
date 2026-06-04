import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { LoginSchema, type LoginData } from "~/types/auth";
import { authService } from "./auth-service";
import { getUserErrorMessage } from "~/lib/api.server";
import type { Route } from "./+types/login";
import z from "zod";
import { createUserSession, getUserFromRequest } from "~/lib/auth.server";

interface ActionData {
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromRequest(request);

  if (user) {
    throw redirect("/");
  }

  return null;
}

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionData | Response> {
  if (request.method !== "POST") {
    return { message: "Method not allowed" };
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const parsed = LoginSchema.safeParse(data);

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const authResponse = await authService.login(parsed.data);
    return createUserSession(authResponse);
  } catch (err) {
    const message = getUserErrorMessage(err);
    return { message };
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (actionData?.fieldErrors) {
      Object.entries(actionData.fieldErrors).forEach(([field, errors]) => {
        setError(field as keyof LoginData, {
          message: errors?.[0] ?? "Validation error",
        });
      });
    }
  }, [actionData?.fieldErrors, setError]);

  const onSubmit = (values: LoginData) => {
    submit(values, { method: "post" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {actionData?.message && (
              <Alert variant="destructive">
                <AlertTitle>Błąd</AlertTitle>
                <AlertDescription>{actionData.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Nazwa użytkownika</Label>
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      id="username"
                      autoFocus
                      aria-invalid={!!error}
                    />
                    {error && (
                      <p className="text-xs text-destructive">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={!!error}
                    />
                    {error && (
                      <p className="text-xs text-destructive">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
