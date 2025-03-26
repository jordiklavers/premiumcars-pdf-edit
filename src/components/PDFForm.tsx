"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  StyleSheet,
  pdf,
  View,
  Image,
} from "@react-pdf/renderer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PDFLogo from "./ui/pdf-logo";
import "@/lib/fonts";
import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "./ui/file-upload";
import { createHash } from "crypto";

/* STYLESHEET */

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "PPNeueMontreal",
  },
  logo: {
    width: 200,
    height: 24,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  frontPageContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 0,
    color: "#000",
    fontFamily: "PPFragmentGlare",
  },
  price: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    fontFamily: "PPFragmentGlare",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "PPNeueMontreal",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    width: 150,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "PPNeueMontreal",
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PPNeueMontreal",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontFamily: "PPNeueMontreal",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
    justifyContent: "space-between",
  },
  image: {
    width: "48%",
    height: 150,
    objectFit: "cover",
    marginBottom: 10,
  },
});

/* PROPS */

interface PDFFormProps {
  initialData?: {
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
      images: string[];
    };
  };
  mode: "create" | "edit";
}

/* ------------------------------ COMPONENT ------------------------------ */

export function PDFForm({ initialData, mode }: PDFFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.content.price || "");
  const [color, setColor] = useState(initialData?.content.color || "");
  const [fuelType, setFuelType] = useState(initialData?.content.fuelType || "");
  const [transmission, setTransmission] = useState(
    initialData?.content.transmission || ""
  );
  const [images, setImages] = useState<string[]>(
    initialData?.content.images || []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* UPLOAD IMAGE */

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          const base64Data = base64String.split(",")[1] || base64String;
          newImages.push(base64Data);
          if (i === files.length - 1) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Kon afbeeldingen niet uploaden");
    }
  };

  /* REMOVE IMAGE */

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* SAVE */

  const handleSave = async () => {
    try {
      setSaving(true);
      const url =
        mode === "create" ? "/api/pdfs" : `/api/pdfs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content: {
            title,
            description,
            createdAt:
              initialData?.content.createdAt || new Date().toISOString(),
            price,
            color,
            fuelType,
            transmission,
            images,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save PDF");
      }

      const data = await response.json();
      if (mode === "create") {
        router.push(`/dashboard/${data.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      setError("Kon PDF niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  /* EXPORT */

  const handleExport = async () => {
    try {
      const doc = (
        <Document>
          {/* Front page */}
          <Page size="A4" style={styles.page}>
            <View style={styles.logoContainer}>
              <PDFLogo style={styles.logo} />
            </View>
            <View style={styles.frontPageContent}>
              <Text style={styles.title}>Zoekopdracht voor een</Text>
              <Text style={[styles.title, { marginTop: 10 }]}>{title}</Text>
            </View>
            <Text style={styles.footer}>
              www.premiumcars.nl • {new Date().toLocaleDateString("nl-NL")} •
              info@premiumcars.nl
            </Text>
          </Page>

          {/* Main content page */}
          <Page size="A4" style={styles.page}>
            <PDFLogo style={styles.logo} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>€ {price}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Kleur:</Text>
              <Text style={styles.value}>{color}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Brandstof:</Text>
              <Text style={styles.value}>{fuelType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Transmissie:</Text>
              <Text style={styles.value}>{transmission}</Text>
            </View>
            {images.length > 0 && (
              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={`data:image/jpeg;base64,${image}`}
                    style={styles.image}
                    cache={false}
                  />
                ))}
              </View>
            )}
            <Text style={styles.footer}>
              www.premiumcars.nl • {new Date().toLocaleDateString("nl-NL")} •
              info@premiumcars.nl
            </Text>
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setError("Kon PDF niet exporteren");
    }
  };

  /* Layout */

  return (
    <div className="container mx-auto py-8 font-geist-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex flex-col gap-4 mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {mode === "create" ? "Nieuwe PDF" : title || "Laden..."}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold font-geist-sans">
                {mode === "create" ? "PDF maken" : "PDF bewerken"}
              </h1>
              <Button
                onClick={() => router.push("/dashboard")}
                className="font-geist-sans"
              >
                Terug naar Dashboard
              </Button>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Titel
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="font-geist-sans"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Prijs
              </label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="font-geist-sans"
              />
            </div>
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Kleur
              </label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                className="font-geist-sans"
              />
            </div>
            <div>
              <label
                htmlFor="fuelType"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Brandstof
              </label>
              <Input
                id="fuelType"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                required
                className="font-geist-sans"
              />
            </div>
            <div>
              <label
                htmlFor="transmission"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Transmissie
              </label>
              <Input
                id="transmission"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                required
                className="font-geist-sans"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 font-geist-sans"
              >
                Beschrijving
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Voer een beschrijving in (optioneel)"
                className="min-h-[150px] resize-y font-geist-sans"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 font-geist-sans">
                Afbeeldingen
              </label>
              <FileUpload onFileSelect={handleImageUpload} />
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-500 font-geist-sans">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="font-geist-sans"
              >
                {saving
                  ? "Opslaan..."
                  : mode === "create"
                  ? "PDF maken"
                  : "Wijzigingen opslaan"}
              </Button>
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  className="font-geist-sans"
                >
                  PDF exporteren
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="h-[600px] border rounded-lg overflow-hidden">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Document>
              {/* Front page */}
              <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                  <PDFLogo style={styles.logo} />
                </View>
                <View style={styles.frontPageContent}>
                  <Text style={styles.title}>Zoekopdracht voor een</Text>
                  <Text style={[styles.title, { marginTop: 10 }]}>{title}</Text>
                </View>
                <Text style={styles.footer}>
                  www.premiumcars.nl • {new Date().toLocaleDateString("nl-NL")}{" "}
                  • info@premiumcars.nl
                </Text>
              </Page>

              {/* Main content page */}
              <Page size="A4" style={styles.page}>
                <PDFLogo style={styles.logo} />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>€ {price}</Text>
                <Text style={styles.description}>
                  {description || "Geen beschrijving beschikbaar"}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Kleur:</Text>
                  <Text style={styles.value}>{color}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Brandstof:</Text>
                  <Text style={styles.value}>{fuelType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Transmissie:</Text>
                  <Text style={styles.value}>{transmission}</Text>
                </View>
                {images.length > 0 && (
                  <View style={styles.imagesContainer}>
                    {images.map((image, index) => (
                      <Image
                        key={index}
                        src={`data:image/jpeg;base64,${image}`}
                        style={styles.image}
                        cache={false}
                      />
                    ))}
                  </View>
                )}
                <Text style={styles.footer}>
                  www.premiumcars.nl • {new Date().toLocaleDateString("nl-NL")}{" "}
                  • info@premiumcars.nl
                </Text>
              </Page>
            </Document>
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
