import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SVGProps } from "react";
import SearchModelForm from "@/components/form/searchModelForm";

export default function Component() {
  return (
    <body>
      <Card className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 min-w-12 min-h-12 flex items-center justify-center rounded-full bg-gray-100">
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div>Add a new model</div>
              <div className="muted">
                Enter the ID of the model you want to add or click the button
                below to create a new model.
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            <SearchModelForm />
            <Link className="w-full" href="/create">
              <Button className="w-full" size="lg">
                Create New Model
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </body>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
