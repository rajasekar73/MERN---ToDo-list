import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handlesubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to create ToDo item");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                }
            }).catch(() => {
                setError("Unable to create ToDo item");
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedtodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedtodos);
                    setMessage("Item updated successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setEditId(-1);
                } else {
                    setError("Unable to update ToDo item");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                }
            }).catch(() => {
                setError("Unable to update ToDo item");
            });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            }).then(() => {
                const updatedtodos = todos.filter((item) => item._id !== id);
                setTodos(updatedtodos);
            });
        }
    };

    return (
        <div className="container my-4">
            <div className="bg-success text-light p-3 rounded">
                <h1 className="text-center">ToDo List Project - MERN Stack</h1>
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    <h3>Add Item</h3>
                    {message && <p className="text-success fw-bold">{message}</p>}
                    <div className="form-group d-flex gap-2 mb-3">
                        <input 
                            className="form-control" 
                            type="text" 
                            onChange={(e) => setTitle(e.target.value)} 
                            value={title} 
                            placeholder="Title"
                        />
                        <input 
                            className="form-control" 
                            type="text" 
                            onChange={(e) => setDescription(e.target.value)} 
                            value={description} 
                            placeholder="Description"
                        />
                        <button className="btn btn-dark" onClick={handlesubmit}>Submit</button>
                    </div>
                    {error && <p className="text-danger fw-bold">{error}</p>}
                </div>
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    <h3>Tasks</h3>
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li 
                                key={item._id} 
                                className="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 rounded"
                            >
                                <div className="d-flex flex-column">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                onChange={(e) => setEditTitle(e.target.value)} 
                                                value={editTitle} 
                                                placeholder="Title"
                                            />
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                onChange={(e) => setEditDescription(e.target.value)} 
                                                value={editDescription} 
                                                placeholder="Description"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <button 
                                            className="btn btn-warning" 
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-success" 
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
