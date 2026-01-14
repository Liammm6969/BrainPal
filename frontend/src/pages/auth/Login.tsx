import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { login } from "../../services/auth/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true),
    setError("");

    try {
      const data = await login(values.email, values.password);

      localStorage.setItem("token", data.token);
      console.log("Login successful: ", data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="mb-2 text-sm text-red-500"></p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )} 
            />
            
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Logging in..." : "Login"}
            </Button>
            
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <p>
          Doesn't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
