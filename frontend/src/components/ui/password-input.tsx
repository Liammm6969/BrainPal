import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

interface PasswordInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          className="pr-10"
          onKeyDown={handleKeyEvent}
          onKeyUp={handleKeyEvent}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {capsLock && (
        <p className="flex items-center gap-1 text-sm text-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          Caps Lock is ON
        </p>
      )}
    </div>
  );
}
