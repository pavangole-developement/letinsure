// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalAppointment {

    struct Appointment {
        address patient;
        string data;
        bool closed;
    }

    mapping(address => Appointment) public ongoingAppointments;
    mapping(address => Appointment) public closedAppointments;

    event AppointmentCreated(address patient);
    event AppointmentClosed(address patient);
    event DataAdded(address patient, string data);

    modifier onlyPatient() {
        require(ongoingAppointments[msg.sender].patient == msg.sender, "Patient only");
        _;
    }

    modifier onlyDoctor() {
        require(ongoingAppointments[msg.sender].patient != msg.sender, "Doctor only");
        _;
    }

    modifier patientHasAppointment() {
        require(ongoingAppointments[msg.sender].patient != address(0), "Patient has no appointment");
        _;
    }

    modifier appointmentNotClosed() {
        require(!ongoingAppointments[msg.sender].closed, "Appointment is closed");
        _;
    }

    function createAppointment() external {
        require(ongoingAppointments[msg.sender].patient == address(0), "Appointment already exists");
        ongoingAppointments[msg.sender] = Appointment(msg.sender, "", false);
        emit AppointmentCreated(msg.sender);
    }

    function closeAppointment() external onlyPatient appointmentNotClosed {
        closedAppointments[msg.sender] = ongoingAppointments[msg.sender];
        delete ongoingAppointments[msg.sender];
        emit AppointmentClosed(msg.sender);
    }

    function addData(string memory _data) external onlyDoctor patientHasAppointment appointmentNotClosed {
        ongoingAppointments[msg.sender].data = _data;
        emit DataAdded(ongoingAppointments[msg.sender].patient, _data);
    }

    function getOngoingAppointmentData() external view onlyDoctor returns (string memory) {
        require(ongoingAppointments[msg.sender].patient != address(0), "No ongoing appointment");
        return ongoingAppointments[msg.sender].data;
    }

    function getClosedAppointmentData() external view onlyDoctor returns (string memory) {
        require(closedAppointments[msg.sender].patient != address(0), "No closed appointment");
        return closedAppointments[msg.sender].data;
    }

    function getPatientOngoingAppointmentData() external view onlyPatient returns (string memory) {
        require(ongoingAppointments[msg.sender].patient != address(0), "No ongoing appointment");
        return ongoingAppointments[msg.sender].data;
    }

    function getPatientClosedAppointmentData() external view onlyPatient returns (string memory) {
        require(closedAppointments[msg.sender].patient != address(0), "No closed appointment");
        return closedAppointments[msg.sender].data;
    }
}
