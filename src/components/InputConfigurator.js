import React from "react";

function InputConfigurator({ inputs, setInputs }) {
    const addInput = () => {
        setInputs([
            ...inputs,
            {
                id: Date.now().toString(),
                label: "",
                type: "text",
                size: "medium", // Default size
                position: inputs.length + 1,
            },
        ]);
    };

    const updateInput = (id, field, value) => {
        setInputs(
            inputs.map((input) =>
                input.id === id ? { ...input, [field]: value } : input
            )
        );
    };

    const deleteInput = (id) => {
        setInputs(inputs.filter((input) => input.id !== id));
    };

    const moveInput = (id, direction) => {
        const index = inputs.findIndex((input) => input.id === id);
        if (direction === "up" && index > 0) {
            const updatedInputs = [...inputs];
            [updatedInputs[index - 1], updatedInputs[index]] = [
                updatedInputs[index],
                updatedInputs[index - 1],
            ];
            setInputs(updatedInputs);
        } else if (direction === "down" && index < inputs.length - 1) {
            const updatedInputs = [...inputs];
            [updatedInputs[index + 1], updatedInputs[index]] = [
                updatedInputs[index],
                updatedInputs[index + 1],
            ];
            setInputs(updatedInputs);
        }
    };

    return (
        <div>
            <h4>Cấu hình Input</h4>
            <button onClick={addInput}>Thêm Input</button>
            <ul>
                {inputs.map((input, index) => (
                    <li key={input.id}>
                        <input
                            type="text"
                            placeholder="Tên thuộc tính"
                            value={input.label}
                            onChange={(e) => updateInput(input.id, "label", e.target.value)}
                        />
                        <select
                            value={input.type}
                            onChange={(e) => updateInput(input.id, "type", e.target.value)}
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="file">File</option>
                            <option value="date">Date</option>
                        </select>
                        <select
                            value={input.size}
                            onChange={(e) => updateInput(input.id, "size", e.target.value)}
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                        <button onClick={() => moveInput(input.id, "up")}>↑</button>
                        <button onClick={() => moveInput(input.id, "down")}>↓</button>
                        <button onClick={() => deleteInput(input.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InputConfigurator;
