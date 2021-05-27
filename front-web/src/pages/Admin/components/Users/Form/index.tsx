import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { makePrivateRequest } from 'core/utils/request';
import { useHistory, useParams } from 'react-router';
import BaseForm from '../../BaseForm';
//import { User } from 'core/types/Users';
import './styles.scss';

export type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password_conf: string;
}

type ParamsType = {
    userId: string;
}

const Form = () => {
    const { register, handleSubmit, errors, setValue } = useForm<FormState>();
    const history = useHistory();
    const { userId } = useParams<ParamsType>();
    //const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const isEditing = userId !== 'create';
    const formTitle = isEditing ? 'Editar usuário' : 'cadastrar um usuário';

    useEffect(() => {
        if (isEditing) {  //Reconhecendo que estou editando
            makePrivateRequest({ url: `/users/${userId}` })
            .then(response => {
                setValue('firstName', response.data.firstName);
                setValue('lastName', response.data.lastName);
                setValue('email', response.data.email);
                setValue('password', response.data.password);
                setValue('password_conf', response.data.password_conf);
            })
        }
    }, [userId, isEditing, setValue]);

    /* useEffect(() => {
        setIsLoadingUsers(true);
        makePrivateRequest({ url: '/users'})
            .then(response => setUsers(response.data.content))
            .finally(() => setIsLoadingUsers(false))
    }, []); */

    const onSubmit = (data: FormState) => {

        makePrivateRequest({ 
            url: isEditing ? `/users/${userId}` : '/users', 
            method: isEditing ? 'PUT' : 'POST',
            data
        })
            .then(() => {
                toast.info('Usuário salvo com sucesso!');
                history.push('/admin/users');
            })
            .catch(() => {
                toast.error('Erro ao salvar usuário!');
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseForm 
                title={formTitle}
            >
                <div className="row">
                    <div className="col-12 margin-bottom-30">
                        <div className="campo-lateral margin-bottom-30">
                            <div className="space-inter-fields">
                                <input 
                                    name="firstName"
                                    ref={register({
                                        required: "Campo obrigatório"   
                                        })
                                    }
                                    type="text"
                                    className="form-control input-base size-field-454" 
                                    placeholder="Nome"
                                />
                                {errors.firstName && (
                                    <div className="invalid-feedback d-block">
                                        {errors.firstName.message}
                                    </div>
                                )}
                            </div>
                            <div>
                                <input 
                                    name="lastName"
                                    ref={register({
                                        required: "Campo obrigatório"   
                                        })
                                    }
                                    type="text"
                                    className="form-control input-base size-field-454" 
                                    placeholder="Sobrenome"
                                />
                                {errors.lastName && (
                                    <div className="invalid-feedback d-block">
                                        {errors.lastName.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="margin-bottom-30">
                            <input 
                                name="email"
                                ref={register({
                                    required: "Campo obrigatório"   
                                    })
                                }
                                type="text"
                                className="form-control input-base size-field-email" 
                                placeholder="Email"
                            />
                            {errors.email && (
                                <div className="invalid-feedback d-block">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>
                        <div className="campo-lateral margin-bottom-30">
                            <div className="space-inter-fields">
                                <input 
                                    name="password"
                                    ref={register({
                                        required: "Campo obrigatório"   
                                        })
                                    }
                                    type="password"
                                    className="form-control input-base size-field-454" 
                                    placeholder="Digite aqui a senha"
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">
                                        {errors.password.message}
                                    </div>
                                )}
                                <small className="password-text-helper text-primary">
                                    A sua senha deve ter pelo menos 8 caracteres e conter pelo menos <br /> uma número 
                                </small>
                            </div>
                            <div>
                                <input 
                                    name="password_conf"
                                    ref={register({
                                        required: "Campo obrigatório"   
                                        })
                                    }
                                    type="password"
                                    className="form-control input-base size-field-454" 
                                    placeholder="Repita aqui a senha"
                                />
                                {errors.password_conf && (
                                    <div className="invalid-feedback d-block">
                                        {errors.password_conf.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </BaseForm>
        </form>
    )
}

export default Form;