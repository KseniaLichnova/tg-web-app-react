import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";



const products = [
    {id: '1', title: 'Биг Хит', price: 165, description: 'Легендарный бургер с двумя рублеными бифштексами из 100% говядиныо сыра Чеддер и специальным соусом «Биг Хит» на булочке.'},
    {id: '2', title: 'Биг Спешиал', price: 275, description: 'Это неповторимый сандвич с большим рубленым бифштексом из 100% отборной говядины на большой булочке с кунжутом.'},
    {id: '3', title: 'Гранд Де Люкс', price: 199, description: 'Сочный бифштекс из натуральной говядины, приготовленный на гриле, карамелизованная булочка с кунжутом, два ломтика сыра Чеддер.'},
    {id: '6', title: 'Двойной Фреш Маффин', price: 169, description: 'Нежная горячая булочка (английский маффин) с двумя аппетитными котлетами из свинины, ломтиком сыра Чеддер.'},
    {id: '4', title: 'Двойной Чизбургер', price: 145, description: 'Два рубленых бифштекса из натуральной цельной говядины с двумя кусочками сыра Чеддер на карамелизованной булочке, заправленной горчицей, кетчупом, луком.'},
    {id: '5', title: 'Наггетсы (6 шт.)', price: 69, description: 'Наггетсы – это сочное 100% белое куриное мясо в хрустящей панировке со специями. Только натуральная курочка без искусственных красителей и ароматизаторов.'},
    {id: '7', title: 'Фреш Маффин', price: 139, description: 'Нежная горячая булочка (английский маффин) с аппетитной котлетой из свинины, ломтиком сыра Чеддер, свежим салатом, ломтиком помидора, заправленная специальным соусом.'},
    {id: '8', title: 'Чикен Фреш Маффин', price: 129, description: 'Нежная горячая булочка (английский маффин) с обжаренной куриной котлетой, панированной в сухарях, свежим салатом, ломтиком помидора.'},
    {id: '9', title: 'Двойной Маффин с яйцом и свиной котлетой', price: 175, description: 'Нежная горячая булочка (английский маффин) с яйцом, двумя аппетитными котлетами из свинины.'},
    {id: '10', title: 'Чикен Премьер', price: 159, description: 'Сочная куриная котлета в хрустящей панировке, сыр Чеддер, ароматный бекон, ломтик помидора, свежий салат, специальный соус и булочка с кунжутом.'},
    {id: '11', title: 'Тост с ветчиной', price: 69, description: 'Карамелизованная булочка с ломтиком ветчины и двумя ломтиками Чеддер.'},
    {id: '12', title: 'Пирожок Вишневый', price: 65, description: 'Обжаренный во фритюре пирожок со сладкой начинкой из вишни'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}
const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,

        }
        fetch('http://localhost:8000/wed-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

    }, [addedItems])

     useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;