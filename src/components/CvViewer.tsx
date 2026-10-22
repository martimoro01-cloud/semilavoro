import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Mostra un CV dentro il sito (nessuna finestra a comparsa) con pulsante di download. */
export function CvViewer({ path, open, onOpenChange, title = "Curriculum" }: { path: string | null; open: boolean; onOpenChange: (v: boolean) => void; title?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(true);
  const [errore, setErrore] = useState(false);

  useEffect(() => {
    if (!open || !path) return;
    let objectUrl: string | null = null;
    setUrl(null);
    setErrore(false);
    supabase.storage.from("cv").download(path).then(({ data, error }) => {
      if (error || !data) return setErrore(true);
      const pdf = data.type === "application/pdf" || path.toLowerCase().endsWith(".pdf");
      objectUrl = URL.createObjectURL(pdf ? new Blob([data], { type: "application/pdf" }) : data);
      setIsPdf(pdf);
      setUrl(objectUrl);
    });
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [open, path]);

  const nomeFile = path?.split("/").pop() ?? "cv";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {errore ? (
          <p className="text-sm text-destructive">Non è possibile aprire questo CV.</p>
        ) : !url ? (
          <p className="text-sm text-muted-foreground">Caricamento del CV…</p>
        ) : isPdf ? (
          <iframe src={url} title={title} className="h-[70vh] w-full rounded-md border border-border" />
        ) : (
          <p className="text-sm text-muted-foreground">L’anteprima è disponibile solo per i PDF. Scarica il file per aprirlo.</p>
        )}
        {url && (
          <div className="flex justify-end">
            <Button asChild className="rounded-full shadow-none">
              <a href={url} download={nomeFile}><Download />Scarica CV</a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
