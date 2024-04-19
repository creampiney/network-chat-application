// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ImageType } from "react-images-uploading";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export async function uploadImages(files: Array<ImageType>, path: string): Promise<Array<string>> {
    const result = await Promise.all(
      files.map(async (file) => {
        if (file.file) { // real file
          const fileRef = ref(storage, `${path}/${(new Date()).getTime()}-${file.file.name}`)
          const fileURL = await uploadBytes(fileRef, file.file).then( async () => {
            const fileURL = await getDownloadURL(fileRef)
            return fileURL
          })
          return fileURL
        }
        else {  // just URL string
          return file.dataURL || ""
        }
      })
    )

    return result
}
