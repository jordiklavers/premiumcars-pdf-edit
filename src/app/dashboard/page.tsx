"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

interface PDF {
  id: string;
  title: string;
  description: string | null;
  content: {
    title: string;
    description: string;
    createdAt: string;
    price: string;
    color: string;
    fuelType: string;
    transmission: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch("/api/pdfs");
        if (!response.ok) {
          throw new Error("Failed to fetch PDFs");
        }
        const data = await response.json();
        setPdfs(data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        toast.error("Kon PDF's niet laden");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchPDFs();
    }
  }, [status]);

  const handleDeleteClick = (id: string) => {
    setPdfToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pdfToDelete) return;

    try {
      const response = await fetch(`/api/pdfs/${pdfToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete PDF");
      }

      setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf.id !== pdfToDelete));
      toast.success("PDF succesvol verwijderd");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Kon PDF niet verwijderen"
      );
    } finally {
      setDeleteDialogOpen(false);
      setPdfToDelete(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Laden...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mijn PDF's</h1>
        <Button onClick={() => router.push("/dashboard/new")}>
          Nieuwe PDF maken
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.map((pdf) => (
          <Card key={pdf.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/dashboard/${pdf.id}`)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(pdf.id)}
                className="h-8 w-8 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{pdf.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {pdf.description || "Geen beschrijving beschikbaar"}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Gemaakt op:{" "}
                {new Date(pdf.content.createdAt).toLocaleDateString("nl-NL")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPdfToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="PDF verwijderen"
        description="Weet je zeker dat je deze PDF wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
      />
    </div>
  );
}
