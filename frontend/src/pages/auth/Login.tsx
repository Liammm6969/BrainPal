import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="example@gmail.com" required/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" required />
            </div>
          <Button type="submit">Login</Button>
      </CardContent>
    </Card>
  );
}
