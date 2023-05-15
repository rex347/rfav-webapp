import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Салат «Крабовый с рисом»', price: 50, description: '150г'},
    {id: '2', title: 'Салат «Оливье с ветчиной»', price: 60, description: '150г'},
    {id: '3', title: 'Сельдь с картофелем', price: 70, description: '150г'},
    {id: '4', title: 'Бульон говяжий с гренками', price: 50, description: '250г'},
    {id: '5', title: 'Борщ с говядиной', price: 70, description: '250г'},
    {id: '6', title: 'Тефтели мясные в сливочно-томатном соусе', price: 120, description: '150г'},
    {id: '7', title: 'Филе куриное под сыром и майонезом', price: 140, description: '150г'},
    {id: '8', title: 'Гречка отварная', price: 25, description: '200г'},
    {id: '9', title: 'Макароны отварные', price: 25, description: '200г'},
    {id: '10', title: 'Компот из ягод', price: 20, description: '200мл'},
    {id: '11', title: 'Сок мультифруктовый', price: 35, description: '200мл'},
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
        fetch('http://localhost:8000/web-data', {
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