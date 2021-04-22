import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { makePrivateRequest } from 'core/utils/request';
import { useHistory } from 'react-router';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
}

const Form = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormState>();
    const history = useHistory();

    const onSubmit = (data: FormState) => {
        makePrivateRequest({ url: '/products', method: 'POST', data })
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
            <BaseForm title="cadastrar um produto">
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
                                {...register('imageUrl', { required: "Campo obrigatório" })}
    //                            name="imaeUrl"
                                type="text"
                                className="form-control input-base" 
    //                            onChange={handdleOnChange}
                                placeholder="Imagem do produto"
                            />
                            {errors.imageUrl && (
                                <div className="invalid-feedback d-block">
                                  {errors.imageUrl.message}
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