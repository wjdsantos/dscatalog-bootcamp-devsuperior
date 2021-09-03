import React, { useState } from 'react';
import { ReactComponent as UploadPlaceholder } from 'core/assets/images/upload-placeholder.svg';
import './styles.scss';
import { makePrivateRequest } from 'core/utils/request';
import { toast } from 'react-toastify';

type Props = {
    onUploadSuccess: (imgUrl: string) => void;
    productImagUrl: string;
}

const ImageUpload = ({ onUploadSuccess, productImagUrl }: Props) => {
    const [upLoadProgress, setUpLoadProgress] = useState(0);
    const [uploadedImgUrl, setUploadedImgUrl] = useState('');
    const imgUrl = uploadedImgUrl || productImagUrl;

    const onUploadProgress = (progressEvent: ProgressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)

        setUpLoadProgress(progress);
    }

    const uploadImage = (selectedImage: File) => {
        const payload = new FormData();
        payload.append('file', selectedImage)

        makePrivateRequest({ 
            url: '/products/image', 
            method: 'POST',
            data: payload,
            onUploadProgress
         })
            .then(response => {
                setUploadedImgUrl(response.data.uri);
                onUploadSuccess(response.data.uri);
            })
            .catch(() => {
                toast.error('Erro ao enviar arquivo!');
            })
            .finally(() => setUpLoadProgress(0))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];

        if (selectedImage) {
            uploadImage(selectedImage);
        }
    }
    return (
        <div className="row">
            <div className="col-6">
                <div className="upload-button-container">
                    <input 
                        type="file" 
                        id="upload"
                        accept="image/png, image/jpg"
                        onChange={handleChange}
                        hidden
                    />
                    <label htmlFor="upload">ADICIONAR IMAGEM</label>
                </div>
                <small className="upload-text-helper text-primary">
                    As imagens devem ser JPG ou PNG e não deve ultrapassar <strong>5 mb.</strong> 
                </small>
            </div>
            <div className="upload-placeholder">
                {upLoadProgress > 0&& (
                    <>
                      <UploadPlaceholder />
                      <div className="upload-progress-contanier">
                        <div 
                            className="upload-progress" 
                            style={{ width: `${upLoadProgress}%` }}
                        >

                        </div>
                      </div>
                    </>
                )}
                {(imgUrl && upLoadProgress === 0) && (
                    <img 
                       src={imgUrl} 
                       alt={imgUrl} 
                       className="uploaded-image"
                    />
                )}
            </div>
        </div>
    )
}

export default ImageUpload;
