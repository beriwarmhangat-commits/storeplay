import { uploadFile, deleteFile, listFiles } from '@huggingface/hub'

const HF_TOKEN = process.env.HF_TOKEN;
const HF_REPO = process.env.HF_REPO_STORAGE; // Username/Repo

/**
 * Fungsi untuk mengunggah file ke Hugging Face Datasets menggunakan library resmi @huggingface/hub.
 * Perbaikan: Menggunakan objek File/Blob secara langsung untuk mematuhi persyaratan library.
 */
export async function uploadToHuggingFace(file: File, path: string) {
  if (!HF_TOKEN || !HF_REPO) {
    throw new Error('Hugging Face Token or Repo is not configured in .env');
  }

  try {
    // Library @huggingface/hub versi terbaru mengharapkan Blob/File atau ArrayBuffer langsung.
    // Kita berikan objek 'file' (yang merupakan Blob) secara langsung.
    await uploadFile({
      repo: { type: 'dataset', name: HF_REPO },
      accessToken: HF_TOKEN,
      file: {
        path: path,
        content: file, // Perbaikan: Gunakan objek file (Blob) secara langsung
      },
    });

    // URL resolve untuk CDN statis Hugging Face
    const downloadUrl = `https://huggingface.co/datasets/${HF_REPO}/resolve/main/${path}`;
    
    return downloadUrl;
  } catch (error: any) {
    console.error('Hugging Face Upload Error Details:', error);
    throw new Error(`Gagal mengunggah ke Hugging Face: ${error.message || 'Unknown Error'}`);
  }
}

/**
 * Fungsi untuk menghapus file spesifik atau folder aplikasi dari Hugging Face.
 */
export async function deleteFromHuggingFace(path: string) {
  if (!HF_TOKEN || !HF_REPO) return;

  try {
    await deleteFile({
      repo: { type: 'dataset', name: HF_REPO },
      accessToken: HF_TOKEN,
      path: path
    });
  } catch (error) {
    console.warn(`HF Cleanup Warning: Gagal menghapus ${path}`, error);
  }
}

/**
 * Fungsi untuk menghapus seluruh folder aplikasi (semua versi APK) dari Hugging Face.
 */
export async function deleteFolderFromHuggingFace(folderPath: string) {
  if (!HF_TOKEN || !HF_REPO) return;

  try {
    // List semua file di folder tersebut
    for await (const file of listFiles({
      repo: { type: 'dataset', name: HF_REPO },
      path: folderPath,
    })) {
      await deleteFile({
        repo: { type: 'dataset', name: HF_REPO },
        accessToken: HF_TOKEN,
        path: file.path
      });
    }
  } catch (error) {
    console.warn(`HF Folder Cleanup Warning: Gagal membersihkan ${folderPath}`, error);
  }
}

