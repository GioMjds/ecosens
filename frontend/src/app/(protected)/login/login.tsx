'use client';

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/stores/FormsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
    const { showPassword, setShowPassword } = useFormStore();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
        }
    });

    return (
        <h1>Login Page</h1>
    )
}