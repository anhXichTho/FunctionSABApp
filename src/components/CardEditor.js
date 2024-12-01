import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateUUID } from "../utils/uuid";

function CardEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useLocalStorage("cards", []);
    const [templates] = useLocalStorage("templates", []);
    const existingCard = cards.find((card) => card.id === id);
    const [card, setCard] = useState(
        existingCard || {
            id: generateUUID(),
            templateId: "",
            name: "",
            steps: [],
        }
    );

    const selectTemplate = (templateId) => {
        const template = templates.find((t) => t.id === templateId);
        if (!template) return;

        setCard({
            ...card,
            templateId: templateId,
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
        });
    };

    const updateInputValue = (stepId, subStepId, inputId, value) => {
        setCard({
            ...card,
            steps: card.steps.map((step) =>
                step.id === stepId
                    ? {
                        ...step,
                        subSteps: step.subSteps.map((subStep) =>
                            subStep.id === subStepId
                                ? {
                                    ...subStep,
                                    inputs: subStep.inputs.map((input) =>
                                        input.id === inputId
                                            ? { ...input, value }
                                            : input
                                    ),
                                }
                                : subStep
                        ),
                    }
                    : step
            ),
        });
    };

    const saveCard = () => {
        if (existingCard) {
            setCards(cards.map((c) => (c.id === id ? card : c)));
        } else {
            setCards([...cards, card]);
        }
        navigate("/cards");
    };

    return (
        <div>
            <h2>{id === "new" ? "Tạo Thẻ" : "Chỉnh sửa Thẻ"}</h2>
            <input
                type="text"
                placeholder="Tên thẻ"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
            />
            <select
                value={card.templateId}
                onChange={(e) => selectTemplate(e.target.value)}
            >
                <option value="">Chọn Mẫu</option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                        {template.name}
                    </option>
                ))}
            </select>
            <ul>
                {card.steps.map((step) => (
                    <li key={step.id}>
                        <h4>{step.name}</h4>
                        <ul>
                            {step.subSteps.map((subStep) => (
                                <li key={subStep.id}>
                                    <h5>{subStep.name}</h5>
                                    {subStep.inputs.map((input) => (
                                        <div key={input.id}>
                                            <label>{input.label}</label>
                                            <input
                                                type={input.type}
                                                value={input.value}
                                                onChange={(e) =>
                                                    updateInputValue(
                                                        step.id,
                                                        subStep.id,
                                                        input.id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <button onClick={saveCard}>Lưu</button>
        </div>
    );
}

export default CardEditor;
