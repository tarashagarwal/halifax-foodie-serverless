import React from "react";

function Login2({ formData, setFormData }) {
    return (
        <div className="">
            <h5>What is your all time favorite restaurant?</h5>
            <div className="answer1">
                <input
                    type="text"
                    placeholder="Answer1..."
                    value={formData.answer1}
                    onChange={(event) => {
                        setFormData({ ...formData, answer1: event.target.value });
                    }}
                />
            </div>
            <div className="answer2">
                <h5>What is your favorite cuisine?</h5>
                <input
                    type="text"
                    placeholder="Answer2..."
                    value={formData.answer2}
                    onChange={(event) => {
                        setFormData({ ...formData, answer2: event.target.value });
                    }}
                />
            </div>
            <div className="answer3">
                <h5>What is your favorite desert?</h5>
                <input
                    type="text"
                    placeholder="Answer3..."
                    value={formData.answer3}
                    onChange={(event) => {
                        setFormData({ ...formData, answer3: event.target.value });
                    }}
                />
            </div>
        </div>
    );
}

export default Login2;
