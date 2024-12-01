import './TemplateManager.css';
import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateUUID } from "../utils/uuid";

function TemplateManager() {
    const [templates, setTemplates] = useLocalStorage("templates", []); // Danh sách mẫu thẻ
    const [selectedTemplateId, setSelectedTemplateId] = useState(null); // Mẫu thẻ đang chọn
    const [steps, setSteps] = useState([]); // Các bước của mẫu thẻ

    // Tạo mẫu thẻ mới
    const createTemplate = () => {
        const newTemplate = {
            id: generateUUID(),
            name: "Mẫu thẻ mới",
            steps: [],
        };
        setTemplates([...templates, newTemplate]);
        setSelectedTemplateId(newTemplate.id);
        setSteps([]);
    };

    // Chọn mẫu thẻ
    const selectTemplate = (templateId) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplateId(templateId);
            setSteps(template.steps);
        }
    };

    // Xóa mẫu thẻ
    const deleteTemplate = (templateId) => {
        const updatedTemplates = templates.filter((template) => template.id !== templateId);
        setTemplates(updatedTemplates);
        if (selectedTemplateId === templateId) {
            setSelectedTemplateId(null);
            setSteps([]);
        }
    };

    // Thêm bước
    const addStep = () => {
        const newStep = {
            id: generateUUID(),
            name: `Bước ${steps.length + 1}`,
            subSteps: [],
        };
        setSteps([...steps, newStep]);
    };

    // Sắp xếp bước
    const moveStep = (stepId, direction) => {
        const index = steps.findIndex((step) => step.id === stepId);
        const updatedSteps = [...steps];
        if (direction === "up" && index > 0) {
            [updatedSteps[index - 1], updatedSteps[index]] = [
                updatedSteps[index],
                updatedSteps[index - 1],
            ];
        } else if (direction === "down" && index < updatedSteps.length - 1) {
            [updatedSteps[index + 1], updatedSteps[index]] = [
                updatedSteps[index],
                updatedSteps[index + 1],
            ];
        }
        setSteps(updatedSteps);
    };

    // Xóa bước
    const deleteStep = (stepId) => {
        setSteps(steps.filter((step) => step.id !== stepId));
    };

    // Thêm bước con
    const addSubStep = (stepId) => {
        const updatedSteps = steps.map((step) =>
            step.id === stepId
                ? {
                    ...step,
                    subSteps: [
                        ...step.subSteps,
                        {
                            id: generateUUID(),
                            name: `Bước con ${step.subSteps.length + 1}`,
                            inputs: [],
                        },
                    ],
                }
                : step
        );
        setSteps(updatedSteps);
    };

    // Sắp xếp bước con
    const moveSubStep = (stepId, subStepId, direction) => {
        const step = steps.find((s) => s.id === stepId);
        const subStepIndex = step.subSteps.findIndex((subStep) => subStep.id === subStepId);
        const updatedSubSteps = [...step.subSteps];

        if (direction === "up" && subStepIndex > 0) {
            [updatedSubSteps[subStepIndex - 1], updatedSubSteps[subStepIndex]] = [
                updatedSubSteps[subStepIndex],
                updatedSubSteps[subStepIndex - 1],
            ];
        } else if (direction === "down" && subStepIndex < updatedSubSteps.length - 1) {
            [updatedSubSteps[subStepIndex + 1], updatedSubSteps[subStepIndex]] = [
                updatedSubSteps[subStepIndex],
                updatedSubSteps[subStepIndex + 1],
            ];
        }

        const updatedSteps = steps.map((s) =>
            s.id === stepId ? { ...s, subSteps: updatedSubSteps } : s
        );
        setSteps(updatedSteps);
    };

    // Xóa bước con
    const deleteSubStep = (stepId, subStepId) => {
        const updatedSteps = steps.map((step) =>
            step.id === stepId
                ? { ...step, subSteps: step.subSteps.filter((subStep) => subStep.id !== subStepId) }
                : step
        );
        setSteps(updatedSteps);
    };

    // Thêm input
    const addInput = (stepId, subStepId) => {
        const updatedSteps = steps.map((step) =>
            step.id === stepId
                ? {
                    ...step,
                    subSteps: step.subSteps.map((subStep) =>
                        subStep.id === subStepId
                            ? {
                                ...subStep,
                                inputs: [
                                    ...subStep.inputs,
                                    { id: generateUUID(), label: "Input mới", type: "text" },
                                ],
                            }
                            : subStep
                    ),
                }
                : step
        );
        setSteps(updatedSteps);
    };

    // Sắp xếp input
    const moveInput = (stepId, subStepId, inputId, direction) => {
        const updatedSteps = steps.map((step) => {
            if (step.id === stepId) {
                return {
                    ...step,
                    subSteps: step.subSteps.map((subStep) => {
                        if (subStep.id === subStepId) {
                            const inputIndex = subStep.inputs.findIndex((input) => input.id === inputId);
                            const updatedInputs = [...subStep.inputs];
                            if (direction === "up" && inputIndex > 0) {
                                [updatedInputs[inputIndex - 1], updatedInputs[inputIndex]] = [
                                    updatedInputs[inputIndex],
                                    updatedInputs[inputIndex - 1],
                                ];
                            } else if (direction === "down" && inputIndex < updatedInputs.length - 1) {
                                [updatedInputs[inputIndex + 1], updatedInputs[inputIndex]] = [
                                    updatedInputs[inputIndex],
                                    updatedInputs[inputIndex + 1],
                                ];
                            }
                            return { ...subStep, inputs: updatedInputs };
                        }
                        return subStep;
                    }),
                };
            }
            return step;
        });
        setSteps(updatedSteps);
    };

    return (
        <div className="card-manager-container">
            {/* Danh sách mẫu thẻ */}
            <div className="card-list">
                <h3>Danh sách Mẫu Thẻ</h3>
                <button onClick={createTemplate} className="create-template-btn">
                    Tạo Mẫu Thẻ Mới
                </button>
                <ul>
                    {templates.map((template) => (
                        <li key={template.id}>
                            <span onClick={() => selectTemplate(template.id)}>{template.name}</span>
                            <button onClick={() => deleteTemplate(template.id)}>Xóa</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chi tiết mẫu thẻ */}
            <div className="template-detail">
                {selectedTemplateId && (
                    <>
                        <h3>Chi tiết Mẫu Thẻ</h3>
                        <button onClick={addStep} className="add-step-btn">
                            Thêm Bước
                        </button>
                        {steps.map((step) => (
                            <div key={step.id}>
                                <h4>{step.name}</h4>
                                <button onClick={() => moveStep(step.id, "up")}>↑</button>
                                <button onClick={() => moveStep(step.id, "down")}>↓</button>
                                <button onClick={() => deleteStep(step.id)}>Xóa Bước</button>
                                <button onClick={() => addSubStep(step.id)}>Thêm Bước Con</button>
                                {step.subSteps.map((subStep) => (
                                    <div key={subStep.id}>
                                        <h5>{subStep.name}</h5>
                                        <button onClick={() => moveSubStep(step.id, subStep.id, "up")}>
                                            ↑
                                        </button>
                                        <button onClick={() => moveSubStep(step.id, subStep.id, "down")}>
                                            ↓
                                        </button>
                                        <button onClick={() => deleteSubStep(step.id, subStep.id)}>
                                            Xóa Bước Con
                                        </button>
                                        <button onClick={() => addInput(step.id, subStep.id)}>
                                            Thêm Input
                                        </button>
                                        {subStep.inputs.map((input) => (
                                            <div key={input.id}>
                                                <span>{input.label}</span>
                                                <button
                                                    onClick={() =>
                                                        moveInput(step.id, subStep.id, input.id, "up")
                                                    }
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        moveInput(step.id, subStep.id, input.id, "down")
                                                    }
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default TemplateManager;
