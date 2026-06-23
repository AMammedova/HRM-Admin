import { z } from 'zod';

export const companyPdfSignatureSchema = z.object({
  companyId: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  content: z.string().optional(),
  filePath: z.string().min(1, 'File path is required'),
  isActive: z.boolean(),
});

export type CompanyPdfSignatureFormData = z.infer<typeof companyPdfSignatureSchema>;

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
