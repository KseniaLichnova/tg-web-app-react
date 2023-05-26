import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css'
import bighit from "../ProductItem/bighit.png";

const ProductItem = ({product, className, onAdd}) => {
    const onAddHandler = () => {
        onAdd(product);
    }

    return (
        <div className={'product ' + className}>
            <div className={'img'}>
            <img src= {"https://avatars.dzeninfra.ru/get-zen_doc/1661842/pub_63aca467a2d92211f5fa822d_63aca9910286c861c5a68205/scale_1200"}  class={"img"} />
        </div>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.price}</b></span>
            </div>
            <Button className={'add-btn'} onClick={onAddHandler}>
                Добавить в корзину
            </Button>
        </div>
    );
};

export default ProductItem;