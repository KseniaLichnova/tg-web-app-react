import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Биг Хит', price: 165, description: 'Легендарный бургер с двумя рублеными бифштексами из 100% говядины, маринованными огурчиками, свежим салатом «Айсберг», ломтиком плавленого сыра Чеддер и специальным соусом «Биг Хит» на новой булочке с двумя видами кунжута'},
    {id: '2', title: 'Гранд Де Люкс', price: 12000, description: 'Сочный бифштекс из натуральной говядины, приготовленный на гриле, карамелизованная булочка с кунжутом, два ломтика сыра Чеддер, свежий салат, кусочек помидора и лук, маринованные огурчики, кетчуп, горчица и специальный соус'},
    {id: '3', title: 'Биг Спешиал', price: 5000, description: 'Это неповторимый сандвич с большим рубленым бифштексом из 100% отборной говядины на большой булочке с кунжутом. Особенный вкус сандвичу придают три кусочка сыра Эмменталь, два ломтика помидора, свежий салат, лук и соус с дымком.'},
    {id: '4', title: 'Двойной Чизбургер', price: 122, description: 'Два рубленых бифштекса из натуральной цельной говядины с двумя кусочками сыра Чеддер на карамелизованной булочке, заправленной горчицей, кетчупом, луком и двумя кусочками маринованного огурчика'},
    {id: '5', title: 'Чикен Премьер', price: 5000, description: 'Сочная куриная котлета в хрустящей панировке, сыр Чеддер, ароматный бекон, ломтик помидора, свежий салат, специальный соус и булочка с кунжутом'},
    {id: '6', title: 'Наггетсы (6 шт.)', price: 600, description: 'Наггетсы – это сочное 100% белое куриное мясо в хрустящей панировке со специями. Только натуральная курочка без искусственных красителей и ароматизаторов и без консервантов'},
    {id: '7', title: 'Фреш Маффин', price: 5500, description: 'Нежная горячая булочка (английский маффин) с аппетитной котлетой из свинины, ломтиком сыра Чеддер, свежим салатом, ломтиком помидора, заправленная специальным соусом'},
    {id: '8', title: 'Двойной Маффин с яйцом и свиной котлетой', price: 12000, description: 'Нежная горячая булочка (английский маффин) с яйцом, двумя аппетитными котлетами из свинины и двумя ломтиками сыра Чеддер'},
    {id: '9', title: 'Двойной Фреш Маффин', price: 12000, description: 'Нежная горячая булочка (английский маффин) с двумя аппетитными котлетами из свинины, ломтиком сыра Чеддер, свежим салатом, ломтиком помидора, заправленная специальным соусом'},
    {id: '10', title: 'Чикен Фреш Маффин', price: 12000, description: 'Нежная горячая булочка (английский маффин) с обжаренной куриной котлетой, панированной в сухарях, свежим салатом, ломтиком помидора, заправленная специальным соусом'},
    {id: '11', title: 'Тост с ветчиной', price: 12000, description: 'Карамелизованная булочка с ломтиком ветчины и двумя ломтиками плавленного сыра Чеддер'},
    {id: '12', title: 'Пирожок Вишневый', price: 12000, description: 'Обжаренный во фритюре пирожок со сладкой начинкой из вишни'},
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