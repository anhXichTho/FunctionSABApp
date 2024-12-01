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
                { id: generateUUID(), name: "", subSteps: [] },
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

    const addSubStep = (stepId) => {
        const step = template.steps.find((s) => s.id === stepId);
        const updatedStep = {
            ...step,
            subSteps: [
                ...step.subSteps,
                { id: generateUUID(), name: "", inputs: [] },
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
