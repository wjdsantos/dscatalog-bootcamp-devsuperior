import React from 'react';
import { Category } from 'core/types/Product';
import { Link } from 'react-router-dom';
import './styles.scss';

type Props = {
    category: Category;
    onRemove: ( categoryId: number) => void;
}

const Card = ({ category, onRemove }: Props ) => {

    return (
        <div className="card-base  category-card-admin">
            <div className="row">
                <div className="col-8">
                    <h3 className="category-card-name-admin">
                        {category.name}
                    </h3>
                </div>
                <div className="col-4 pt-3 pr-5">
                    <Link
                        to={`/admin/categories/${category.id}`}
                        type="button"
                        className="btn btn-outline-secondary border-radius-10"
                    >
                        EDITAR
                    </Link>
                    
                    <button
                        type="button"
                        className="btn btn-outline-danger border-radius-10 ml-3"
                        onClick={() => onRemove(category.id)}
                    >
                        EXCLUIR
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card;