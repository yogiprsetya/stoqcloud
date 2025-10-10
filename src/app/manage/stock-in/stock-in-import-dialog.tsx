'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { httpClient } from '~/config/http-client';
import { errorHandler } from '~/utils/error-handler';
import { Input } from '~/components/ui/input';

interface StockInImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockInImportDialog({ isOpen, onClose }: StockInImportDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>();

  const handleSelectTemplate = () => {
    const templateUrl = '/templates/stock-in-import-template.csv';
    window.open(templateUrl, '_blank');
  };

  const handleUpload = async () => {
    setErrorMsg(null);
    setResultMsg(null);

    if (!file) {
      setErrorMsg('Pilih file CSV terlebih dahulu.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    setIsUploading(true);

    httpClient
      .post('bulk/stock-in', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => {
        const message = res.data?.message || 'Import selesai.';
        setResultMsg(message);
      })
      .catch(errorHandler)
      .finally(() => setIsUploading(false));
  };

  const handleClose = () => {
    setErrorMsg(null);
    setResultMsg(null);
    setFile(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Stock In (CSV)</DialogTitle>
          <DialogDescription>
            Unggah file CSV sesuai template. Baris invalid akan diabaikan dan dilaporkan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input onChange={(e) => setFile(e.target.files?.[0])} type="file" accept=".csv" />

            <Button type="button" variant="outline" onClick={handleSelectTemplate}>
              Unduh Template
            </Button>
          </div>

          {errorMsg ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          ) : null}

          {resultMsg ? (
            <Alert>
              <AlertDescription>{resultMsg}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
            Batal
          </Button>

          <Button type="button" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? 'Mengunggah...' : 'Unggah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
