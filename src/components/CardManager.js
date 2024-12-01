import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

function CardManager() {
    const [cards, setCards] = useLocalStorage("cards", []);

    const deleteCard = (id) => {
        setCards(cards.filter((card) => card.id !== id));
    };

    return (
        <div>
            <h2>Quản lý Thẻ</h2>
            <Link to="/cards/edit/new">Tạo Thẻ Mới</Link>
            <ul>
                {cards.map((card) => (
                    <li key={card.id}>
                        {card.name}
                        <Link to={`/cards/edit/${card.id}`}>Chỉnh sửa</Link>
                        <button onClick={() => deleteCard(card.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CardManager;
