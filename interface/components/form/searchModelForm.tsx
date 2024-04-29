"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  type ChangeEvent,
  useCallback,
  useState,
  type SVGProps,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

export default function SearchModelForm() {
  const router = useRouter();
  const [inputValue, setValue] = useState<string>("");

  const handleInputValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(inputValue);
    },
    [router, inputValue],
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-start space-x-4">
      <Input
        className="flex-1"
        placeholder="Search by Model ID"
        type="text"
        enterKeyHint="send"
        pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
        value={inputValue}
        onChange={handleInputValueChange}
      />
      <Button variant="outline" type="submit">
        <SearchIcon className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
