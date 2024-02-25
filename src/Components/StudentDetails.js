import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style/StudentCrud.css';
import { Grid } from '@material-ui/core';

function StudentCrud() {
    const fetch = "http://localhost:8080";
    const [id, setId] = useState(0);
    const [studentList, setStudentList] = useState([]);
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [bulkDeletionIds, setBulkDeletionIds] = useState([]);

    useEffect(() => {
        (async () => await load())();
    }, []);

    const load = async () => {
        const result = await axios.get(`${fetch}/api/Student/GetStudent`);
        setStudentList(result.data);
    }

    const saveOrUpdateData = async () => {
        if (id === 0) {
            await axios.post(`${fetch}/api/Student/AddStudent`, {
                studentName: name,
                course: course
            });
        }
        else {
            await axios.patch(`${fetch}/api/Student/UpdateStudent`, {
                id: id,
                studentName: name,
                course: course
            });
        }
        alert(`Student ${id === 0 ? "Added" : "updated"} Successfully`);
        setId(0);
        setCourse("");
        setName("");
        load();
    }

    const resetData = async () => {
        setId(0);
        setCourse("")
        setName("");
    }

    const deleteRecord = async (id) => {
        const response = await axios.delete(`${fetch}/api/Student/DeleteStudent/` + id);
        if (response) {
            alert("Student deleted successfully");
        }
        else {
            alert("Something went wrong!");
        }
        setId("");
        setName("");
        setCourse("");
        load();
    }

    const deleteSelectedStudents = async () => {
        const response = await axios.delete(`${fetch}/api/Student/BulkDeletion`, { data: bulkDeletionIds });
        if (response) {
            alert("Selected students deleted successfully");
        }
        else {
            alert("Something went wrong!");
        }
        setBulkDeletionIds([]);
        load();
    }

    const handleCheckbox = (e, id) => {
        if (e.target.checked) {
            setBulkDeletionIds(current => [...current, id]);
        } else {
            const prev= bulkDeletionIds.filter(x=>x !== id);
            setBulkDeletionIds(prev);
        }
    }

    return (
        <div className="App">
            <div className="container">
                <h1 className='title'>Student Details</h1>
                <div className='form-group'>
                    <label className='field-label'>Student Name</label><br />
                    <input
                        id="text"
                        type="text"
                        className="studentName-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)} /></div>
                <div className='form-group'>
                    <label className='field-label'>Course</label><br />
                    <input
                        id="course"
                        type="text"
                        className="course-field"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)} /></div>
                <Grid container xs={12} className='btn-group'>
                    <Grid item xs={9}>
                        <button className='btn-reset' onClick={resetData}>Reset</button>
                        <button className='btn-save' onClick={saveOrUpdateData}>{id === 0 ? "Save" : "Update"}
                        </button></Grid>
                    <Grid item xs={2}>
                        {bulkDeletionIds?.length > 0 &&
                            <button className='btn-deleteAll' onClick={deleteSelectedStudents}>Delete</button>}
                    </Grid>
                </Grid>
            </div>
            <div className="tableContainer">
                <table className="tableData">
                    <thead className="tableHead">
                        <tr>
                            <th scope="row">Id</th>
                            <th>Student Name</th>
                            <th>Course</th>
                            <th>Options</th>
                            <th></th>
                        </tr>
                    </thead>
                    {
                        studentList.map((student) => {
                            return (
                                <tbody className="tableBody">
                                    <tr className="tableBody tableRow" key={student.id}>
                                        <td><input type="checkbox" value={student.id} className='checkbox'
                                            onClick={(e) => handleCheckbox(e, student.id)}
                                        /></td>
                                        <td>{student.id}</td>
                                        <td>{student.studentName}</td>
                                        <td>{student.course}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => {
                                                setId(student.id);
                                                setName(student.studentName);
                                                setCourse(student.course);
                                            }}
                                                disabled={bulkDeletionIds?.length !== 0}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className='btn-delete'
                                                onClick={() => deleteRecord(student.id)}
                                                disabled={bulkDeletionIds?.length !== 0}
                                            >
                                                Delete</button></td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    );
}

export default StudentCrud;
