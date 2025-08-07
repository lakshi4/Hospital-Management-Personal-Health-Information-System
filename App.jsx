import React , { useState }  from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'
import HospitalDashboard from './pages/HospitalDashboard'
import PatientRegister from './pages/PatientRegister'
import ViewPatientProfile from './pages/ViewPatientProfile'
import EditPatientProfile from './pages/EditPatientProfile'
import DeletePatientProfile from './pages/DeletePatientProfile'
import H_PatientDetails from './pages/H_PatientDetails'
import Ho_AdmissionDetails from './pages/Ho_AdmissionDetails'
import MedicalHistory from './pages/MedicalHistory'
import TreatmentPlan from './pages/TreatmentPlan'
import ViewTreatment from './pages/ViewTreatment'
import UpdateTreatment  from './pages/UpdateTreatment'
import Innovate from './pages/Innovate';
import HospitalRegister from './pages/HospitalRegister'
import TreatmentReportPage from './pages/TreatmentReportPage'
import AdminDashboard from './pages/AdminDashboard'
import ViewHospital from './pages/ViewHospital'
import EditHospital from './pages/EditHospital'
import TreatmentReport from './pages/TreatmentReport'


const App = () => {
  const [formData, setFormData] = useState({
    patient: {
        name: "",
        nic: "",
        dob: "",
        blood: "",
        tele: "",
        email: ""
    },
    ho_admissionDetails: {
        admissionDate: "",
        admittingPhysician: "",
        primaryDiagnosis: ""
    },
    medicalHistory: {
        allergies: [],
        illnesses: [],
        medications: [],
        surgeries: [],
        su_imaging: [],
        immunizations: []
    },
    treatmentPlan: {
        medications: [],
        labTests: [],
        te_imaging: [],
        therapies: []
    }
});

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminLogin/>} />       
        <Route path='/user' element={<UserLogin/>} />
        <Route path='/patient/register' element={<PatientRegister/>}/>
        <Route path='/patient/view/:id' element={<ViewPatientProfile/>}/>
        <Route path='/patient/Edit/:id' element={<EditPatientProfile/>}/>
        <Route path='/patient/Delete/:id' element={<DeletePatientProfile/>}/>
        <Route path='/hospitaldashboard/:hospitalName' element={<HospitalDashboard />} />
        
        {/* Add new routes with hospitalName parameter */}
        <Route path='/:hospitalName/h-patientdetails' element={<H_PatientDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/:hospitalName/h-patientdetails/ho-admission/:nic' element={<Ho_AdmissionDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/:hospitalName/h-patientdetails/medical-history/:nic' element={<MedicalHistory formData={formData} setFormData={setFormData} />} />
        <Route path='/:hospitalName/h-patientdetails/treatment-plan/:nic' element={<TreatmentPlan formData={formData} setFormData={setFormData} />} />
        <Route path='/:hospitalName/h-patientdetails/view/:nic' element={<ViewTreatment />} />
        <Route path='/:hospitalName/h-patientdetails/update/:nic/:treatmentId' element={<UpdateTreatment />} />
        
        {/* Keep original routes for backward compatibility */}
        <Route path='/h-patientdetails' element={<H_PatientDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/ho-admission/:nic' element={<Ho_AdmissionDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/medical-history/:nic' element={<MedicalHistory formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/treatment-plan/:nic' element={<TreatmentPlan formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/view/:nic' element={<ViewTreatment />} />
        <Route path='/h-patientdetails/update/:nic/:treatmentId' element={<UpdateTreatment />} />
        <Route path='/treatmentReport/${treatment._id}' element={<TreatmentReport />} />
         
        {/* Remaining routes */}
        <Route path='/traetmentreort' element={<TreatmentReportPage />} />
        <Route path='/innov' element={<Innovate/>} />
        <Route path='/hospital-register' element={<HospitalRegister/>} />
        <Route path='/hospital-view/:hospitalId' element={<ViewHospital/>} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        <Route path='/hospital-edit/:hospitalId' element={<EditHospital/>} /> 
    </Routes>
  )
}

export default App