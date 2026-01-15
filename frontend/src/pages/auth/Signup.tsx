import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema";
import { signup } from "../../services/auth/authService";
export default function Signup() {
    const navigate = useNavigate();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
  try {
    const { confirm, ...payload } = values;

    const data = await signup(
      payload.name,
      payload.email,
      payload.password
    );

    localStorage.setItem("token", data.token);
    navigate("/");
  } catch (err: any) {
    console.error(err.response?.data?.message || "Signup failed");
  }
};
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="confirm"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                    <FormMessage/>
                </FormItem>
              )}
            ></FormField>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
