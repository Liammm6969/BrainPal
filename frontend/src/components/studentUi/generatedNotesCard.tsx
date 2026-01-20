import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";

interface GeneratedNotesProps {
  notes: string;
  loading: boolean;
}

const GeneratedNotesCard: React.FC<GeneratedNotesProps> = ({ notes, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto rounded-lg border border-gray-200 bg-white p-8 shadow-md space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Generated Notes</h2>
        {notes && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Generating notes...</p>
          </div>
        ) : notes ? (
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-lg font-medium mt-4 mb-2 text-gray-800" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-6 list-disc text-gray-700 leading-7 mb-1" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-900" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-7 mb-4" {...props} />
                ),
              }}
            >
              {notes}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-400">
              Nothing generated yet. Select files and click "Generate Notes".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedNotesCard;