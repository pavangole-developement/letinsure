// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalAppointment {

    struct Appointment {
        address patient;
        address doctor;
        uint256 date;
        string details;
        bool closed;
    }

    mapping(address => Appointment) private ongoingAppointments;
    mapping(address => Appointment[]) private closedAppointments;
    mapping(address => Appointment[]) private doctorAppointments;
    mapping(address => Appointment[]) private closedDoctorAppointments;

    event AppointmentCreated(address indexed patient, address indexed doctor, uint256 date);
    event AppointmentClosed(address indexed patient, address indexed doctor, uint256 date);
    event DataAdded(address indexed patient, address indexed doctor, uint256 date, string details);

    // Patient creates a new appointment with the doctor
    function createAppointment(address _doctor, uint256 _date) public {
        require(ongoingAppointments[msg.sender].patient == address(0), "Patient already has an ongoing appointment");
        
        Appointment memory newAppointment = Appointment(msg.sender, _doctor, _date, "", false);
        ongoingAppointments[msg.sender] = newAppointment;
        doctorAppointments[_doctor].push(newAppointment);
        emit AppointmentCreated(msg.sender, _doctor, _date);
    }

    // Doctor adds data for a patient appointment
    function addDataForPatient(string memory _data) public {
        require(ongoingAppointments[msg.sender].patient == msg.sender, "No ongoing appointment found for the patient");
        Appointment storage ongoingAppointment = ongoingAppointments[msg.sender];
        // Add data for the appointment
        ongoingAppointment.details = string(abi.encodePacked(ongoingAppointment.details, " ", _data));
        emit DataAdded(msg.sender, ongoingAppointment.doctor, ongoingAppointment.date, _data);
    }

    // Patient closes their ongoing appointment
    function closeOngoingAppointment() public {
        require(ongoingAppointments[msg.sender].patient == msg.sender, "No ongoing appointment found for the patient");
        Appointment storage ongoingAppointment = ongoingAppointments[msg.sender];
        require(!ongoingAppointment.closed, "Appointment is already closed");
        // Mark the appointment as closed
        ongoingAppointment.closed = true;
        // Move the closed appointment to the closedAppointments mapping
        closedAppointments[msg.sender].push(ongoingAppointment);
        emit AppointmentClosed(msg.sender, ongoingAppointment.doctor, ongoingAppointment.date);
        // Remove the closed appointment from the ongoingAppointments mapping
        delete ongoingAppointments[msg.sender];
    }

    // Get ongoing appointment for a patient
    function getOngoingAppointment(address _patient) public view returns (Appointment memory) {
        return ongoingAppointments[_patient];
    }

    // Get closed appointments for a patient
    function getClosedAppointments(address _patient) public view returns (Appointment[] memory) {
        return closedAppointments[_patient];
    }

    // Get ongoing appointments for a doctor
    function getOngoingAppointmentsForDoctor(address _doctor) public view returns (Appointment[] memory) {
        return doctorAppointments[_doctor];
    }

    // Get closed appointments for a doctor
    function getClosedAppointmentsForDoctor(address _doctor) public view returns (Appointment[] memory) {
        return closedDoctorAppointments[_doctor];
    }
}
