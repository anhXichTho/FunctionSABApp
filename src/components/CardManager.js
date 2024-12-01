import './CardManager.css';
import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

function CardManager() {
    const [cards, setCards] = useLocalStorage("cards", []); // Danh sách thẻ
    const [selectedCardId, setSelectedCardId] = useState(null); // Thẻ đang chọn
    const [editingCardId, setEditingCardId] = useState(null); // Thẻ đang chỉnh sửa
    const [steps, setSteps] = useState([]); // Các bước của thẻ
    const [selectedStepId, setSelectedStepId] = useState(null); // Bước đang chọn

    // Khi chọn thẻ, tải các bước liên quan
    const selectCard = (cardId) => {
        const card = cards.find((c) => c.id === cardId);
        if (card) {
            setSelectedCardId(cardId);
            setSteps(card.steps);
            setSelectedStepId(card.steps.length > 0 ? card.steps[0].id : null);
        }
    };

    // Xóa thẻ
    const deleteCard = (cardId) => {
        const updatedCards = cards.filter((card) => card.id !== cardId);
        setCards(updatedCards);
        if (selectedCardId === cardId) {
            setSelectedCardId(null);
            setSteps([]);
        }
    };

    // Bắt đầu chỉnh sửa tên thẻ
    const startEditing = (cardId) => {
        setEditingCardId(cardId);
    };

    // Lưu tên thẻ
    const saveCardName = (cardId, newName) => {
        const updatedCards = cards.map((card) =>
            card.id === cardId ? { ...card, name: newName } : card
        );
        setCards(updatedCards);
        setEditingCardId(null);
    };

    return (
        <div className="card-manager-container">
            {/* Danh sách thẻ */}
            <div className="card-list">
                <h3>Danh sách Thẻ</h3>
                <ul>
                    {cards.map((card) => (
                        <li
                            key={card.id}
                            className={`card-item ${
                                card.id === selectedCardId ? "selected" : ""
                            }`}
                        >
                            {/* Hiển thị tên thẻ hoặc input sửa tên */}
                            {editingCardId === card.id ? (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                        type="text"
                                        defaultValue={card.name}
                                        onBlur={(e) => saveCardName(card.id, e.target.value)}
                                        autoFocus
                                        style={{
                                            padding: "5px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            marginRight: "10px",
                                            width: "70%",
                                        }}
                                    />
                                    <button
                                        onClick={() => setEditingCardId(null)}
                                        style={{
                                            backgroundColor: "grey",
                                            color: "white",
                                            border: "none",
                                            padding: "5px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => selectCard(card.id)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span>{card.name}</span>
                                    <div>
                                        {/* Nút sửa */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn việc chọn thẻ khi nhấn nút sửa
                                                startEditing(card.id);
                                            }}
                                            style={{
                                                backgroundColor: "orange",
                                                color: "white",
                                                border: "none",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            Sửa Tên
                                        </button>
                                        {/* Nút xóa */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn việc chọn thẻ khi nhấn nút xóa
                                                deleteCard(card.id);
                                            }}
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chi tiết thẻ */}
            <div className="card-detail">
                {selectedCardId && (
                    <>
                        {/* Các bước */}
                        <div className="step-container">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`step ${
                                        step.id === selectedStepId ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedStepId(step.id)}
                                >
                                    {step.name}
                                </div>
                            ))}
                        </div>

                        {/* Các bước con */}
                        <div>
                            {steps
                                .filter((step) => step.id === selectedStepId)
                                .map((step) =>
                                    step.subSteps.map((subStep) => (
                                        <div key={subStep.id} className="sub-step">
                                            <h4>{subStep.name}</h4>
                                            {subStep.inputs.map((input) => (
                                                <div key={input.id} className="input-group">
                                                    <label>{input.label}</label>
                                                    <input
                                                        type={input.type}
                                                        value={input.value || ""}
                                                        onChange={(e) => {
                                                            const updatedSteps = steps.map((s) =>
                                                                s.id === step.id
                                                                    ? {
                                                                        ...s,
                                                                        subSteps: s.subSteps.map((ss) =>
                                                                            ss.id === subStep.id
                                                                                ? {
                                                                                    ...ss,
                                                                                    inputs: ss.inputs.map((i) =>
                                                                                        i.id === input.id
                                                                                            ? { ...i, value: e.target.value }
                                                                                            : i
                                                                                    ),
                                                                                }
                                                                                : ss
                                                                        ),
                                                                    }
                                                                    : s
                                                            );
                                                            setSteps(updatedSteps);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CardManager;
