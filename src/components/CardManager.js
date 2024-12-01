import './CardManager.css';
import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

function CardManager() {
    const [cards, setCards] = useLocalStorage("cards", []); // Danh sách thẻ
    const [templates] = useLocalStorage("templates", []); // Danh sách mẫu thẻ
    const [selectedCardId, setSelectedCardId] = useState(null); // Thẻ đang chọn
    const [steps, setSteps] = useState([]); // Các bước của thẻ
    const [selectedStepId, setSelectedStepId] = useState(null); // Bước đang chọn
    const [isCreating, setIsCreating] = useState(false); // Trạng thái đang tạo thẻ
    const navigate = useNavigate();

    // Khi chọn thẻ, tải các bước liên quan
    const selectCard = (cardId) => {
        const card = cards.find((c) => c.id === cardId);
        if (card) {
            setSelectedCardId(cardId);
            setSteps(card.steps);
            setSelectedStepId(card.steps.length > 0 ? card.steps[0].id : null);
        }
    };

    const selectStep = (stepId) => {
        setSelectedStepId(stepId);
    };

    const updateInputValue = (stepId, subStepId, inputId, value) => {
        const updatedSteps = steps.map((step) =>
            step.id === stepId
                ? {
                    ...step,
                    subSteps: step.subSteps.map((subStep) =>
                        subStep.id === subStepId
                            ? {
                                ...subStep,
                                inputs: subStep.inputs.map((input) =>
                                    input.id === inputId ? { ...input, value } : input
                                ),
                            }
                            : subStep
                    ),
                }
                : step
        );
        setSteps(updatedSteps);
    };

    const createNewCard = () => {
        setIsCreating(true);
    };

    const handleTemplateSelection = (templateId) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            const newCard = {
                id: Date.now().toString(),
                name: `Thẻ từ ${template.name}`,
                templateId: template.id,
                steps: template.steps.map((step) => ({
                    ...step,
                    subSteps: step.subSteps.map((subStep) => ({
                        ...subStep,
                        inputs: subStep.inputs.map((input) => ({
                            ...input,
                            value: "",
                        })),
                    })),
                })),
            };
            setCards([...cards, newCard]);
            setIsCreating(false);
        }
    };

    return (
        <div className="card-manager-container">
            {/* Danh sách thẻ */}
            <div className="card-list">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>Danh sách Thẻ</h3>
                    <button
                        onClick={createNewCard}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Tạo Thẻ Mới
                    </button>
                </div>

                {isCreating && (
                    <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
                        <h4>Chọn Mẫu Thẻ</h4>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {templates.map((template) => (
                                <li
                                    key={template.id}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        marginBottom: "5px",
                                        cursor: "pointer",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                    onClick={() => handleTemplateSelection(template.id)}
                                >
                                    {template.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!isCreating && (
                    <ul>
                        {cards.map((card) => (
                            <li
                                key={card.id}
                                className={`card-item ${
                                    card.id === selectedCardId ? "selected" : ""
                                }`}
                                onClick={() => selectCard(card.id)}
                            >
                                {card.name}
                            </li>
                        ))}
                    </ul>
                )}
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
                                    onClick={() => selectStep(step.id)}
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
                                                        onChange={(e) =>
                                                            updateInputValue(step.id, subStep.id, input.id, e.target.value)
                                                        }
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
