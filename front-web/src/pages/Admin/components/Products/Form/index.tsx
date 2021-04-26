import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useHistory, useParams } from 'react-router';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
    name: string;
    price: string;
    description: string;
    imgUrl: string;
}

type ParamsType = {
    productId: string;
}

const Form = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormState>();
    const history = useHistory();
    const { productId } = useParams<ParamsType>();
    const isEditing = productId !== 'create';
    const formTitle = isEditing ? 'Editar produto' : 'cadastrar um produto';

    useEffect(() => {
        if (isEditing) { //Reconhecendo que estou editando
            makeRequest({ url: `/products/${productId}` })
            .then(response => {
                setValue('name', response.data.name);
                setValue('price', response.data.price);
                setValue('description', response.data.description);
                setValue('imgUrl', response.data.imgUrl);
            })
        }
    }, [productId, isEditing, setValue]);

    const onSubmit = (data: FormState) => {
        makePrivateRequest({ 
            url: isEditing ? `/products/${productId}` : '/products', 
            method: isEditing ? 'PUT' : 'POST',
            data 
        })
            .then(() => {
                toast.info('Produto salvo com sucesso!');
                history.push('/admin/products');
            })
            .catch(() => {
                toast.error('Erro ao salvar produto!');
            })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseForm 
                title={formTitle}
            >
                <div className="row">
                    <div className="col-6">
                        <div className="margin-bottom-30">
                            <input 
    //                            value={formData.name}
                                {...register('name', {
                                    required: "Campo obrigatório",
                                    minLength: {
                                        value: 5,
                                        message: "O campo deve ter ao menos 5 caracteres"
                                        },
                                    maxLength: {
                                        value: 60,
                                        message: "O campo deve ter no maximo 60 caracteres"
                                        }    
                                    })
                                }
    //                            name="name"
                                type="text"
                                className="form-control input-base" 
    //                            onChange={handdleOnChange}
                                placeholder="Nome do produto"
                            />
                            {errors.name && (
                                <div className="invalid-feedback d-block">
                                  {errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="margin-bottom-30">
                            <input 
    //                            value={formData.price}
                                {...register('price', { required: "Campo obrigatório" })}
    //                            name="price"
                                type="text"
                                className="form-control input-base" 
    //                            onChange={handdleOnChange}
                                placeholder="Preço"
                            />
                            {errors.price && (
                                <div className="invalid-feedback d-block">
                                  {errors.price.message}
                                </div>
                            )}
                        </div>
                        <div className="margin-bottom-30">
                            <input 
    //                            value={formData.name}
                                {...register('imgUrl', { required: "Campo obrigatório" })}
    //                            name="imaeUrl"
                                type="text"
                                className="form-control input-base" 
    //                            onChange={handdleOnChange}
                                placeholder="Imagem do produto"
                            />
                            {errors.imgUrl && (
                                <div className="invalid-feedback d-block">
                                  {errors.imgUrl.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col6">
                        <textarea 
//                            name="description input-base" 
//                            value={formData.description}
                            {...register('description', { required: "Campo obrigatório" })}
//                            onChange={handdleOnChange}
                            className="form-control input-base"
                            placeholder="Descrição"
                            cols={40} 
                            rows={10} 
                        />
                        {errors.description && (
                            <div className="invalid-feedback d-block">
                                {errors.description.message}
                            </div>
                        )}
                    </div>
                </div>
            </BaseForm>
        </form>
    )
}

export default Form;