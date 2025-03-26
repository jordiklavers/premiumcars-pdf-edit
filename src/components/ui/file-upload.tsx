import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export default function FileUpload({
  onFileSelect,
  accept = "image/*",
  multiple = true,
}: FileUploadProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-gray-200 rounded-sm p-6">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                Sleep bestanden hier of klik om te uploaden
              </span>
            </div>
            <Input
              id="file-upload"
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => onFileSelect(e.target.files)}
              className="hidden"
            />
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
