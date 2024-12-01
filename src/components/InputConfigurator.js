import React from "react";

function InputConfigurator({ inputs, setInputs }) {
    const addInput = () => {
        setInputs([
            ...inputs,
            {
                id: Date.now().toString(),
                label: "",
                type: "text",
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

    return (
        <div>
            <h4>Cấu hình Input</h4>
            <button onClick={addInput}>Thêm Input</button>
            <ul>
                {inputs.map((input) => (
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
                        <button onClick={() => deleteInput(input.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InputConfigurator;
