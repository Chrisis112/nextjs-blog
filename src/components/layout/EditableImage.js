import Image from "next/image";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

export default function EditableImage({ link, setLink }) {
  const { t } = useTranslation();

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set('file', files[0]);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            setLink(link);
          });
        }
        throw new Error('Something went wrong');
      });

      await toast.promise(uploadPromise, {
        loading: t('editableImage.uploading'),
        success: t('editableImage.uploadSuccess'),
        error: t('editableImage.uploadError'),
      });
    }
  }

  return (
    <>
{link && (
  <Image
    className="rounded-lg mb-1"
    src={link}
    width={350}
    height={250}
    alt={t('editableImage.avatarAlt')}
    style={{
      objectFit: 'cover',   // Заполнение и обрезка
      objectPosition: 'center',
      width: '350px',
      height: '250px'
    }}
  />
)}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
          {t('editableImage.noImage')}
          <h1>{t('editableImage.qualityInfo')}</h1>
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
          {t('editableImage.changeImage')}
        </span>
      </label>
    </>
  );
}
