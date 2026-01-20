import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import StudentSidebar from "@/components/shared/StudentSidebar";
import { getUserFiles } from "@/services/file/fileService";
import type { FileData } from "@/services/file/fileService";
import { summarizeText } from "@/services/file/aiService";
import {
  FileText,
  Loader2,
  NotebookPen,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import GeneratedNotesCard from "@/components/studentUi/generatedNotesCard";

const Notes = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const selectedFiles = useMemo(
    () => files.filter((file) => selectedIds.includes(file._id)),
    [files, selectedIds]
  );

  const loadFiles = async () => {
    setLoadingFiles(true);
    setError(null);
    try {
      const userFiles = await getUserFiles();
      setFiles(userFiles);
    } catch (err: any) {
      console.error("Failed to load files:", err);
      setError(err?.response?.data?.message || "Failed to load files.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const toggleSelection = (fileId: string) => {
    setSelectedIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleGenerateNotes = async () => {
    if (selectedFiles.length === 0) {
      setError("Select at least one file to generate notes.");
      return;
    }

    setGenerating(true);
    setError(null);
    setNotes("");

    const prompt = [
      "Generate concise, well-structured study notes using these files:",
      ...selectedFiles.map(
        (file, index) => `${index + 1}. ${file.filename}`
      ),
      instructions
        ? `Additional context or focus areas: ${instructions}`
        : "Focus on key concepts, definitions, and actionable takeaways.",
    ].join("\n");

    try {
      const summary = await summarizeText(prompt);
      setNotes(summary);
    } catch (err: any) {
      console.error("Failed to generate notes:", err);
      setError(err?.response?.data?.message || "Failed to generate notes.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Notes</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            <Card>
              <CardHeader className="flex justify-between md:flex-row md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <NotebookPen className="h-5 w-5 text-primary" />
                    <CardTitle>Generate notes from your uploads</CardTitle>
                  </div>
                  <CardDescription>
                    Pick uploaded files, add optional instructions, and let the AI draft notes.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadFiles}
                  disabled={loadingFiles}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh files
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {loadingFiles
                        ? "Loading your files..."
                        : `${files.length} file${files.length === 1 ? "" : "s"} available`}
                    </p>
                    <p className="text-sm font-medium">
                      Selected: {selectedFiles.length}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {loadingFiles ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching files...
                      </div>
                    ) : files.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No files uploaded yet. Upload study materials first in Study Materials.
                      </p>
                    ) : (
                      <div className="divide-y rounded-lg border">
                        {files.map((file) => (
                          <label
                            key={file._id}
                            className="flex items-start gap-3 p-3 hover:bg-muted/60 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4"
                              checked={selectedIds.includes(file._id)}
                              onChange={() => toggleSelection(file._id)}
                            />
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium">{file.filename}</span>
                              </div>
                              <span className="text-xs text-muted-foreground break-all">
                                {file.url}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Additional instructions (optional)</h3>
                  </div>
                  <Textarea
                    placeholder="E.g., focus on chapter 3, highlight formulas, keep bullets short..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleGenerateNotes}
                      disabled={generating || loadingFiles}
                      className="gap-2"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Notes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <GeneratedNotesCard notes={notes} loading={generating} />
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Notes;
