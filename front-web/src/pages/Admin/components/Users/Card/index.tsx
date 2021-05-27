import React from 'react';
import { User } from 'core/types/Users';
import { Link } from 'react-router-dom';
import './styles.scss';

type Props = {
    user: User;
    onRemove: (userId: number) => void;
}

const Card = ({ user, onRemove }: Props) => {
    return (
        <div className="card-base  user-card-admin">
            <div className="row">
                <div className="col-8  py-3">
                    <div className="user-card-name-admin">
                        {user.firstName + ' ' + user.lastName}
                    </div>
                    <div className="user-card-email-admin">
                        {user.email}
                    </div>
                </div>
                <div className="col-4 pt-3 pr-5">
                    <Link
                      to={`/admin/users/${user.id}`}
                      type="button"
                      className="btn btn-outline-secondary border-radius-10"
                    >
                        EDITAR
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger border-radius-10 ml-3"
                      onClick={() => onRemove(user.id)}
                    >
                        EXCLUIR
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;