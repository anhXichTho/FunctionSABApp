import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateUUID } from "../utils/uuid";
import InputConfigurator from "./InputConfigurator";

function TemplateEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [templates, setTemplates] = useLocalStorage("templates", []);
    const existingTemplate = templates.find((template) => template.id === id);
    const [template, setTemplate] = useState(
        existingTemplate || { id: generateUUID(), name: "", steps: [] }
    );

    const saveTemplate = () => {
        if (existingTemplate) {
            setTemplates(templates.map((t) => (t.id === id ? template : t)));
        } else {
            setTemplates([...templates, template]);
        }
        navigate("/templates");
    };

    const addStep = () => {
        setTemplate({
            ...template,
            steps: [
                ...template.steps,
                { id: generateUUID(), name: "", subSteps: [], position: template.steps.length + 1 },
            ],
        });
    };

    const updateStep = (stepId, newStep) => {
        setTemplate({
            ...template,
            steps: template.steps.map((step) =>
                step.id === stepId ? newStep : step
            ),
        });
    };

    const deleteStep = (stepId) => {
        setTemplate({
            ...template,
            steps: template.steps.filter((step) => step.id !== stepId),
        });
    };

    const moveStep = (stepId, direction) => {
        const index = template.steps.findIndex((step) => step.id === stepId);
        const updatedSteps = [...template.steps];
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
        setTemplate({ ...template, steps: updatedSteps });
    };

    const addSubStep = (stepId) => {
        const step = template.steps.find((s) => s.id === stepId);
        const updatedStep = {
            ...step,
            subSteps: [
                ...step.subSteps,
                { id: generateUUID(), name: "", inputs: [], position: step.subSteps.length + 1 },
            ],
        };
        updateStep(stepId, updatedStep);
    };

    const updateSubStep = (stepId, subStepId, newSubStep) => {
        const step = template.steps.find((s) => s.id === stepId);
        const updatedStep = {
            ...step,
            subSteps: step.subSteps.map((subStep) =>
                subStep.id === subStepId ? newSubStep : subStep
            ),
        };
        updateStep(stepId, updatedStep);
    };

    const deleteSubStep = (stepId, subStepId) => {
        const step = template.steps.find((s) => s.id === stepId);
        const updatedStep = {
            ...step,
            subSteps: step.subSteps.filter((subStep) => subStep.id !== subStepId),
        };
        updateStep(stepId, updatedStep);
    };

    return (
        <div>
            <h2>{id === "new" ? "Tạo Mẫu Thẻ" : "Chỉnh sửa Mẫu Thẻ"}</h2>
            <input
                type="text"
                placeholder="Tên mẫu thẻ"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            />
            <button onClick={addStep}>Thêm Bước</button>
            <ul>
                {template.steps.map((step) => (
                    <li key={step.id}>
                        <input
                            type="text"
                            placeholder="Tên bước"
                            value={step.name}
                            onChange={(e) =>
                                updateStep(step.id, { ...step, name: e.target.value })
                            }
                        />
                        <button onClick={() => moveStep(step.id, "up")}>↑</button>
                        <button onClick={() => moveStep(step.id, "down")}>↓</button>
                        <button onClick={() => deleteStep(step.id)}>Xóa</button>
                        <button onClick={() => addSubStep(step.id)}>Thêm Bước Con</button>
                        <ul>
                            {step.subSteps.map((subStep) => (
                                <li key={subStep.id}>
                                    <input
                                        type="text"
                                        placeholder="Tên bước con"
                                        value={subStep.name}
                                        onChange={(e) =>
                                            updateSubStep(step.id, subStep.id, {
                                                ...subStep,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <button onClick={() => deleteSubStep(step.id, subStep.id)}>
                                        Xóa
                                    </button>
                                    <InputConfigurator
                                        inputs={subStep.inputs}
                                        setInputs={(newInputs) =>
                                            updateSubStep(step.id, subStep.id, {
                                                ...subStep,
                                                inputs: newInputs,
                                            })
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <button onClick={saveTemplate}>Lưu</button>
        </div>
    );
}

export default TemplateEditor;
