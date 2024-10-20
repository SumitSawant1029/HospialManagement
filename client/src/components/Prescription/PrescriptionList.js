import React, { useEffect, useState, useContext } from 'react';

import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import PrescriptionTable from '../MUITable/PrescriptionTable';
import { UserContext } from '../../Context/UserContext';
import moment from 'moment';

function PrescriptionList() {
    const { currentUser } = useContext(UserContext);
    const params = new URLSearchParams(window.location.search);

    const [prescriptions, setPrescription] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [doctorList, setDoctorList] = useState([]);
    const [patientSelected, setPatientSelected] = useState("");
    const [doctorSelected, setDoctorSelected] = useState("");

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);

    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true);
    };

    const handleDialogueClose = () => {
        setErrorList([]); // Clear the error list when the dialogue box is closed
        setErrorDialogueBoxOpen(false);
    };

    const getPatients = async () => {
        try {
            const response = await axios.get("http://localhost:3001/patients");
            setPatientList(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
            setErrorList(["Failed to fetch patients"]); // Set an error message
            handleDialogueOpen();
        }
    };

    const getDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:3001/doctors");
            setDoctorList(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setErrorList(["Failed to fetch doctors"]); // Set an error message
            handleDialogueOpen();
        }
    };

    const getPrescription = async () => {
        const patientId = params.get('patientId');
        const doctorId = params.get('doctorId');

        if (doctorId) setDoctorSelected(doctorId);
        if (patientId) setPatientSelected(patientId);

        const reqObj = { patientId, doctorId };

        try {
            const response = await axios.post(`http://localhost:3001/prescriptions`, reqObj, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.message === "success") {
                const sortedPrescriptions = response.data.prescriptions.sort((a, b) => {
                    const timeA = new Date(`${moment(a.appointmentId.appointmentDate).format('MM/DD/YYYY')} ${a.appointmentId.appointmentTime}`);
                    const timeB = new Date(`${moment(b.appointmentId.appointmentDate).format('MM/DD/YYYY')} ${b.appointmentId.appointmentTime}`);
                    return timeB - timeA;
                });
                setPrescription(sortedPrescriptions);
            } else {
                setErrorList(["Failed to fetch prescriptions"]); // Set an error message
                handleDialogueOpen();
            }
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            setErrorList(["Error fetching prescriptions"]); // Set an error message
            handleDialogueOpen();
        }
    };

    useEffect(() => {
        getPrescription();
        getPatients();
        getDoctors();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        getPrescription(); // Call this function to get prescriptions after filtering
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="page-wrapper">
                <div className="content">
                    <h4 className="page-title">Prescription</h4>
                    <form onSubmit={handleSubmit} name="prescriptionFilter" className={currentUser.userType === "Patient" ? "hide" : ""}>
                        <div className="row filter-row">
                            <div className="col-sm-4 col-md-4 mt-2">
                                <select
                                    name="patientId"
                                    id="patientId"
                                    className="form-select"
                                    value={patientSelected}
                                    onChange={(e) => setPatientSelected(e.target.value)}
                                >
                                    <option value=''>Choose Patient</option>
                                    {patientList.map(patient => (
                                        <option key={patient._id} value={patient._id}>
                                            {patient.userId.firstName} {patient.userId.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {currentUser.userType === 'Admin' && (
                                <div className="col-sm-4 col-md-4 mt-2">
                                    <select
                                        name="doctorId"
                                        id="doctorId"
                                        className="form-select"
                                        value={doctorSelected}
                                        onChange={(e) => setDoctorSelected(e.target.value)}
                                    >
                                        <option value=''>Choose Doctor</option>
                                        {doctorList.map(doctor => (
                                            <option key={doctor._id} value={doctor._id}>
                                                {doctor.userId.firstName} {doctor.userId.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block">Search</button>
                            </div>
                        </div>
                    </form>
                    <PrescriptionTable prescriptionList={prescriptions} />
                </div>
            </div>
            <ErrorDialogueBox 
                open={errorDialogueBoxOpen} 
                handleToClose={handleDialogueClose} 
                ErrorList={errorList}  // Ensure errorList is passed
                ErrorTitle="An Error Occurred" 
            />
        </Box>
    );
}

export default PrescriptionList;
