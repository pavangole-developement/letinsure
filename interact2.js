const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const currentDir = path.dirname(__filename);
const buildPath = path.resolve(currentDir, 'build');
const abiPath = path.join(buildPath, 'recordsAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const contractAddress = fs.readFileSync('./build/recordsDataAddress.bin', 'utf-8');

// Initialize Web3
const web3 = new Web3('http://localhost:7545'); 

// Load the contract
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Define doctor and patient addresses
const doctorAddress = '0xCC68289f79B68dF36bA9C62FB977c1b6e500B9B4';
const patientAddress = '0x5Cd3B05D68aAfAFF39F5e504Bbea4A8EE00EDb21';

// Function to estimate gas and set gas limit
async function estimateGasAndSetLimit(contractMethod, options) {
    const gasEstimateBigInt = await contractMethod.estimateGas(options);
    const gasEstimate = Number(gasEstimateBigInt); // Convert BigInt to number
    const gasLimit = Math.ceil(gasEstimate * 1.1); // Increase by 10% for safety
    return gasLimit;
}

// Patient creates a new appointment with the doctor
async function createAppointment(patientAddress) {
    try {
        const gasLimit = await estimateGasAndSetLimit(contract.methods.createAppointment(), { from: patientAddress });
        const result = await contract.methods.createAppointment().send({ from: patientAddress, gas: gasLimit });
        console.log('Appointment created:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Patient closes their ongoing appointment
async function closeAppointment(patientAddress) {
    try {
        const gasLimit = await estimateGasAndSetLimit(contract.methods.closeAppointment(), { from: patientAddress });
        const result = await contract.methods.closeAppointment().send({ from: patientAddress, gas: gasLimit });
        console.log('Appointment closed:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Doctor adds data for a patient appointment
async function addDataForPatient(data,patientAddress) {
    try {
        const gasLimit = await estimateGasAndSetLimit(contract.methods.addData(data), { from: patientAddress });
        const result = await contract.methods.addData(data).send({ from: patientAddress, gas: gasLimit });
        console.log('Data added for patient:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get ongoing appointment data for a patient
async function getPatientOngoingAppointmentData(patientAddress) {
    try {
        const result = await contract.methods.getPatientOngoingAppointmentData().call({ from: patientAddress });
        console.log('Patient Ongoing Appointment Data:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get closed appointment data for a patient
async function getPatientClosedAppointmentData(patientAddress) {
    try {
        const result = await contract.methods.getPatientClosedAppointmentData().call({ from: patientAddress });
        console.log('Patient Closed Appointment Data:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get ongoing appointment data for a doctor
async function getDoctorOngoingAppointmentData() {
    try {
        const result = await contract.methods.getOngoingAppointmentData().call({ from: doctorAddress });
        console.log('Doctor Ongoing Appointment Data:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get closed appointment data for a doctor
async function getDoctorClosedAppointmentData() {
    try {
        const result = await contract.methods.getClosedAppointmentData().call({ from: doctorAddress });
        console.log('Doctor Closed Appointment Data:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Uncomment and use these functions to test the contract
// createAppointment(doctorAddress);
// closeAppointment();
addDataForPatient("Sample data",doctorAddress);
// getPatientOngoingAppointmentData(patientAddress);
// getPatientClosedAppointmentData();
// getDoctorOngoingAppointmentData();
// getDoctorClosedAppointmentData();
