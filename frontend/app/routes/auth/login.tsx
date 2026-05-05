import { useEffect } from "react";
import { Form, useActionData, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { saveAuth } from "~/lib/auth";
import { LoginSchema, type LoginData, type AuthResponse } from "~/types/auth";
import { authService } from "./auth-service";
import { getUserErrorMessage } from "~/lib/api";
import type { Route } from "./+types/login";
import z from "zod";

interface ActionData {
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  authResponse?: AuthResponse;
}

export async function action({
  request,
}: {
  request: Request;
}): Promise<ActionData> {
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
    return { success: true, authResponse };
  } catch (err) {
    const message = getUserErrorMessage(err);
    return { message };
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const {
    control,
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

  useEffect(() => {
    if (actionData?.success && actionData?.authResponse) {
      saveAuth(actionData.authResponse);
      navigate("/");
    }
  }, [actionData?.success, actionData?.authResponse, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            {actionData?.message && !actionData?.success && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{actionData.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
              <Label htmlFor="password">Password</Label>
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
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-primary underline">
                Register
              </a>
            </p>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
