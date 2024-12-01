import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

function TemplateManager() {
    const [templates, setTemplates] = useLocalStorage("templates", []);

    const deleteTemplate = (id) => {
        setTemplates(templates.filter((template) => template.id !== id));
    };

    return (
        <div>
            <h2>Quản lý Mẫu Thẻ</h2>
            <Link to="/templates/edit/new">Tạo Mẫu Thẻ Mới</Link>
            <ul>
                {templates.map((template) => (
                    <li key={template.id}>
                        {template.name}
                        <Link to={`/templates/edit/${template.id}`}>Chỉnh sửa</Link>
                        <button onClick={() => deleteTemplate(template.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TemplateManager;
