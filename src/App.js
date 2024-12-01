import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TemplateManager from "./components/TemplateManager";
import TemplateEditor from "./components/TemplateEditor";
import CardManager from "./components/CardManager";
import CardEditor from "./components/CardEditor";

function App() {
    return (
        <Router>
            <div>
                <h1>Quản lý Thẻ và Mẫu Thẻ</h1>
                <nav>
                    <Link to="/templates">Quản lý Mẫu Thẻ</Link> |{" "}
                    <Link to="/cards">Quản lý Thẻ</Link>
                </nav>
                <Routes>
                    <Route path="/templates" element={<TemplateManager />} />
                    <Route path="/templates/edit/:id" element={<TemplateEditor />} />
                    <Route path="/cards" element={<CardManager />} />
                    <Route path="/cards/edit/:id" element={<CardEditor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
