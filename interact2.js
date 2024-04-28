const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const currentDir = path.dirname(__filename);
const buildPath = path.resolve(currentDir, 'build');
const abiPath = path.join(buildPath, 'recordsAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const contractAddress = fs.readFileSync('./build/recordsDataAddress.bin', 'utf-8');

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Load the contract
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Define doctor and patient addresses
const doctorAddress = '0xCC68289f79B68dF36bA9C62FB977c1b6e500B9B4';
const patientAddress = '0x5Cd3B05D68aAfAFF39F5e504Bbea4A8EE00EDb21';

// Patient creates a new appointment with the doctor
async function createAppointment(patientAddress, doctorAddress, date) {
    try {
        const gasEstimateBigInt = await contract.methods.createAppointment(doctorAddress, date).estimateGas({ from: patientAddress });
        const gasEstimate = Number(gasEstimateBigInt); // Convert BigInt to number

        // Set gas limit to a value slightly higher than the estimated gas
        const gasLimit = Math.ceil(gasEstimate * 10); // Increase by 10%
        const gasPriceinWei = await web3.eth.getGasPrice();
        const gasPrice = Number(gasPriceinWei); // Convert from Wei to Ether
        const totalCostInEther = (gasLimit * gasPrice) / 1e18; // Convert gas to Ether
        console.log('Total cost in Ether:', totalCostInEther);
        const result = await contract.methods.createAppointment(doctorAddress, date).send({
            from: patientAddress,
            gas: gasLimit,
        });
        console.log('Appointment created:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Doctor adds data for a patient appointment
async function addDataForPatient(patientAddress, data) {
    try {
        const gasEstimateBigInt = await contract.methods.addDataForPatient(data).estimateGas({ from: patientAddress });
        const gasEstimate = Number(gasEstimateBigInt); // Convert BigInt to number

        // Set gas limit to a value slightly higher than the estimated gas
        const gasLimit = Math.ceil(gasEstimate * 1.1); // Increase by 10%
        const gasPriceinWei = await web3.eth.getGasPrice();
        const gasPrice = Number(gasPriceinWei); // Convert from Wei to Ether
        const totalCostInEther = (gasLimit * gasPrice) / 1e18; // Convert gas to Ether
        console.log('Total cost in Ether:', totalCostInEther);

        const result = await contract.methods.addDataForPatient(data).send({
            from: patientAddress,
            gas: gasLimit,
        });
        console.log('Data added for patient:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Patient closes their ongoing appointment
async function closeOngoingAppointment(patientAddress) {
    const result = await contract.methods.closeOngoingAppointment().send({ from: patientAddress });
    console.log('Ongoing appointment closed:', result);
}

// Get ongoing appointment for a patient
async function getOngoingAppointment(patientAddress) {
    const result = await contract.methods.getOngoingAppointment(patientAddress).call();
    console.log('Ongoing Appointment:', result);
    return result;
}

// Get closed appointments for a patient
async function getClosedAppointments(patientAddress) {
    const result = await contract.methods.getClosedAppointments(patientAddress).call();
    return result;
}

// Get ongoing appointments for a doctor
async function getOngoingAppointmentsForDoctor(doctorAddress) {
    const result = await contract.methods.getOngoingAppointmentsForDoctor(doctorAddress).call();
    console.log('Ongoing Appointments for Doctor:', result);
    return result;
}

// Get closed appointments for a doctor
async function getClosedAppointmentsForDoctor(doctorAddress) {
    const result = await contract.methods.getClosedAppointmentsForDoctor(doctorAddress).call();
    console.log('Closed Appointments for Doctor:', result);
    return result;
}

// Get data associated with ongoing appointment for a patient
async function getDataForOngoingAppointmentPatient() {
    const result = await contract.methods.getDataForOngoingAppointment().call({ from: patientAddress });
    console.log('Data for Ongoing Appointment (Patient):', result);
    return result;
}

// Get data associated with closed appointments for a patient
async function getDataForClosedAppointmentsPatient() {
    const result = await contract.methods.getDataForClosedAppointments().call({ from: patientAddress });
    console.log('Data for Closed Appointments (Patient):', result);
    return result;
}

// Get data associated with ongoing appointments for a doctor
async function getDataForOngoingAppointmentsDoctor() {
    const result = await contract.methods.getDataForOngoingAppointmentsDoctor().call({ from: doctorAddress });
    console.log('Data for Ongoing Appointments (Doctor):', result);
    return result;
}

// Get data associated with closed appointments for a doctor
async function getDataForClosedAppointmentsDoctor() {
    const result = await contract.methods.getDataForClosedAppointmentsDoctor().call({ from: doctorAddress });
    console.log('Data for Closed Appointments (Doctor):', result);
    return result;
}

// Define a sample program to test the contract
// async function testContract() {
//     try {
//         // Patient creates a new appointment with the doctor
//         const timeStamp = new Date().getTime().toString();
//         await createAppointment(patientAddress, doctorAddress, timeStamp);

//         // Doctor adds data for the patient appointment
//         await addDataForPatient(doctorAddress, 'Sample data');

//         // Patient closes their ongoing appointment
//         await closeOngoingAppointment(patientAddress);

//         // Get ongoing appointment for a patient
//         await getOngoingAppointment(patientAddress);

//         // Get closed appointments for a patient
//         await getClosedAppointments(patientAddress);

//         // Get ongoing appointments for a doctor
//         await getOngoingAppointmentsForDoctor(doctorAddress);

//         // Get closed appointments for a doctor
//         await getClosedAppointmentsForDoctor(doctorAddress);

//         // Get data associated with ongoing appointment for a patient
//         await getDataForOngoingAppointmentPatient();

//         // Get data associated with closed appointments for a patient
//         await getDataForClosedAppointmentsPatient();

//         // Get data associated with ongoing appointments for a doctor
//         await getDataForOngoingAppointmentsDoctor();

//         // Get data associated with closed appointments for a doctor
//         await getDataForClosedAppointmentsDoctor();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Run the sample program
// testContract();
// createAppointment(patientAddress, doctorAddress, 1);
getOngoingAppointment(patientAddress);
addDataForPatient(patientAddress, "Sample data");
getDataForOngoingAppointmentPatient(patientAddress);