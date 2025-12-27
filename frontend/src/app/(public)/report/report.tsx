'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
    Camera, MapPin, Upload, FileText, CheckCircle, AlertCircle,
    X, ChevronRight, ChevronLeft, FileImage, Video, Info, Leaf, Shield, Eye
} from 'lucide-react';

// Subject to change when full functionality is implemented
// For now, this is a multi-step form collecting incident reports
// Step 1: Incident Type -> the type of incident being reported
// Step 2: Evidence Upload -> photos or videos of the incident
// Step 3: Incident Details -> description, location, anonymity option
// Step 4: Review & Submit -> review all details and submit the report
export default function ReportPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [incidentType, setIncidentType] = useState(null);
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const incidentTypes = [
        { id: 'illegal-dumping', title: 'Illegal Dumping', description: 'Large-scale waste disposal in unauthorized areas', icon: '🚮' },
        { id: 'littering', title: 'Littering', description: 'Small trash or debris left in public spaces', icon: '🗑️' },
        { id: 'hazardous-waste', title: 'Hazardous Waste', description: 'Dangerous materials requiring special handling', icon: '☢️' },
        { id: 'other', title: 'Other', description: 'Other environmental violations', icon: '📝' }
    ];

    const steps = [
        { number: 1, title: 'Incident Type', icon: FileText },
        { number: 2, title: 'Evidence', icon: Camera },
        { number: 3, title: 'Details', icon: MapPin },
        { number: 4, title: 'Review', icon: CheckCircle }
    ];

    const handleFileUpload = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        console.log('Submitting report:', { incidentType, files, description, location, isAnonymous });
    };

    const canProceed = () => {
        if (currentStep === 1) return incidentType !== null;
        if (currentStep === 2) return files.length > 0;
        if (currentStep === 3) return description.trim() !== '' && location.trim() !== '';
        if (currentStep === 4) return agreedToTerms;
        return false;
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle py-8 px-4">
            <div className="max-w-4xl mx-auto mb-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-nature rounded-lg flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Report an Incident</h1>
                        <p className="text-sm text-text-secondary">Help keep our community clean</p>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = currentStep === step.number;
                                const isCompleted = currentStep > step.number;

                                return (
                                    <div key={step.number} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    isCompleted ? 'bg-state-success text-white' :
                                                    isActive ? 'bg-gradient-nature text-white' :
                                                    'bg-background-tertiary text-icon-secondary'
                                                }`}
                                            >
                                                {isCompleted ? <CheckCircle size={24} /> : <StepIcon size={24} />}
                                            </motion.div>
                                            <p className={`text-xs md:text-sm mt-2 font-medium text-center ${
                                                isActive || isCompleted ? 'text-forest-mid' : 'text-text-tertiary'
                                            }`}>
                                                {step.title}
                                            </p>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${
                                                currentStep > step.number ? 'bg-state-success' : 'bg-border-light'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" {...fadeInUp} className="card-elevated">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-text-primary mb-2">What type of incident are you reporting?</h2>
                                <p className="text-text-secondary">Select the category that best describes the issue</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {incidentTypes.map((type) => (
                                    <motion.button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setIncidentType(type.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                            incidentType === type.id ? 'border-forest-mid bg-forest-mid/5 shadow-md' :
                                            'border-border-light hover:border-border-medium bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <span className="text-4xl">{type.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-text-primary mb-1">{type.title}</h3>
                                                <p className="text-sm text-text-secondary">{type.description}</p>
                                            </div>
                                            {incidentType === type.id && <CheckCircle className="text-state-success shrink-0" />}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" {...fadeInUp} className="space-y-6">
                            <div className="card-elevated">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">Upload Evidence</h2>
                                    <p className="text-text-secondary">Add photos or videos of the incident</p>
                                </div>
                                <label className="block">
                                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                                    <motion.div whileHover={{ scale: 1.01 }} className="border-2 border-dashed border-border-medium rounded-xl p-8 text-center cursor-pointer hover:border-forest-mid hover:bg-forest-mid/5 transition-all duration-200">
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-forest-mid" />
                                        <p className="text-lg font-medium text-text-primary mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-text-secondary">Images or videos (Max 10MB per file)</p>
                                    </motion.div>
                                </label>
                                {files.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <p className="text-sm font-medium text-text-primary">Uploaded Files ({files.length})</p>
                                        {files.map((file, index) => (
                                            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {file.type.startsWith('image/') ? <FileImage className="text-forest-mid" /> : <Video className="text-forest-mid" />}
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary">{file.name}</p>
                                                        <p className="text-xs text-text-tertiary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeFile(index)} className="text-state-error hover:bg-state-error/10 p-2 rounded-lg transition-colors">
                                                    <X size={20} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="alert alert-info">
                                <div className="flex items-start space-x-3">
                                    <Info className="shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold mb-2">Tips for good evidence:</p>
                                        <ul className="text-sm space-y-1">
                                            <li>• Capture clear, well-lit photos</li>
                                            <li>• Include surrounding context in images</li>
                                            <li>• Show the full extent of the issue</li>
                                            <li>• Include any identifying markers or signs</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" {...fadeInUp} className="space-y-6">
                            <div className="card-elevated space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">Incident Details</h2>
                                    <p className="text-text-secondary">Provide additional information about the incident</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Location <span className="text-state-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-icon-secondary" />
                                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Street address or landmark" className="input-field pl-12" />
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-2">Be as specific as possible to help authorities locate the issue</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Description <span className="text-state-error">*</span>
                                    </label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you observed, when it happened, and any other relevant details..." rows={6} className="input-field resize-none" />
                                    <p className="text-xs text-text-tertiary mt-2">{description.length} / 500 characters</p>
                                </div>
                                <div className="bg-background-secondary rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-5 h-5 mt-0.5 text-forest-mid border-border-medium rounded focus:ring-forest-mid/30" />
                                        <div className="flex-1">
                                            <label htmlFor="anonymous" className="font-medium text-text-primary cursor-pointer flex items-center space-x-2">
                                                <span>Submit anonymously</span>
                                                <Shield size={16} className="text-forest-mid" />
                                            </label>
                                            <p className="text-sm text-text-secondary mt-1">Your identity will be kept private. Only incident details will be shared with authorities.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div key="step4" {...fadeInUp} className="space-y-6">
                            <div className="card-elevated">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">Review Your Report</h2>
                                    <p className="text-text-secondary">Please verify all information before submitting</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-border-light">
                                        <h3 className="text-sm font-medium text-text-tertiary mb-2">Incident Type</h3>
                                        <p className="text-lg font-semibold text-text-primary">{incidentTypes.find((t) => t.id === incidentType)?.title}</p>
                                    </div>
                                    <div className="pb-6 border-b border-border-light">
                                        <h3 className="text-sm font-medium text-text-tertiary mb-3">Evidence ({files.length} files)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {files.map((file, index) => (
                                                <div key={index} className="px-3 py-2 bg-background-secondary rounded-lg text-sm text-text-primary">{file.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pb-6 border-b border-border-light">
                                        <h3 className="text-sm font-medium text-text-tertiary mb-2">Location</h3>
                                        <p className="text-base text-text-primary">{location}</p>
                                    </div>
                                    <div className="pb-6 border-b border-border-light">
                                        <h3 className="text-sm font-medium text-text-tertiary mb-2">Description</h3>
                                        <p className="text-base text-text-primary">{description}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-text-tertiary mb-2">Privacy</h3>
                                        <div className="flex items-center space-x-2">
                                            {isAnonymous ? (
                                                <>
                                                    <Shield className="text-forest-mid" size={20} />
                                                    <span className="text-base text-text-primary">Anonymous submission</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="text-forest-mid" size={20} />
                                                    <span className="text-base text-text-primary">Public submission</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-background-secondary border-2 border-forest-light/30">
                                <div className="flex items-start space-x-3">
                                    <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-5 h-5 mt-0.5 text-forest-mid border-border-medium rounded focus:ring-forest-mid/30" />
                                    <div className="flex-1">
                                        <label htmlFor="terms" className="font-medium text-text-primary cursor-pointer">I agree to the terms and conditions</label>
                                        <div className="mt-3 text-sm text-text-secondary space-y-2">
                                            <p className="font-medium text-text-primary">By submitting this report, I confirm that:</p>
                                            <ul className="space-y-1 ml-2">
                                                <li>• The information provided is accurate to my knowledge</li>
                                                <li>• The evidence was obtained legally and ethically</li>
                                                <li>• I understand false reports may result in penalties</li>
                                                <li>• This report may be shared with relevant authorities</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-warning">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                    <div className="text-sm">
                                        <p className="font-semibold mb-1">Important Notice</p>
                                        <p>Your report will be reviewed by our team and forwarded to appropriate authorities. Response times may vary. For immediate hazards or emergencies, please contact local emergency services.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mt-8">
                    <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                        className="btn-tertiary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </button>
                    {currentStep < 4 ? (
                        <motion.button
                            type="button"
                            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                            disabled={!canProceed()}
                            whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>Continue</span>
                            <ChevronRight size={20} />
                        </motion.button>
                    ) : (
                        <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canProceed()}
                            whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle size={20} />
                            <span>Submit Report</span>
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </div>
    );
}