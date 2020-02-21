import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UserForm = ({ values, errors, touched, status }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log("status has changed", status);
        status && setUsers(users => [...users, status]);
    }, [status]);

    return (
        <div className="form">
            <Form>
                <label htmlFor="user-name">Name:</label>
                <Field id="name" type="text" name="name" />
                {touched.name && errors.name && (
                    <p className="errors">{errors.name}</p>
                )}
                <br />
                <label htmlFor="user-email">Email:</label>
                <Field id="email" type="email" name="email" />
                {errors.email && touched.email && <div>{errors.email}</div>}
                <br />
                <label htmlFor="user-password">Password: </label>
                <Field id="password" type="password" name="password" />
                {errors.password && touched.password && (
                    <div>{errors.password}</div>
                )}
                <br />
                <label htmlFor="user-password-confirmation">
                    Password Confirmation:
                </label>
                <Field
                    id="passwordConfirmation"
                    type="password"
                    name="passwordConfirmation"
                />
                {errors.passwordConfirmation &&
                    touched.passwordConfirmation && (
                        <div>{errors.passwordConfirmation}</div>
                    )}
                <br />
                <label htmlFor="uesr-role">Role: </label>
                <Field as="select" id="role" name="role">
                    <option value="Select Role">Select Role</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="iOS Engineer">iOS Engineer</option>
                    <option value="UX Designer">UX Designer</option>
                </Field>
                {touched.role && errors.role && (
                    <p className="error">{errors.role}</p>
                )}
                <br />
                <label htmlFor="user-terms">
                    Terms of Service
                    <Field type="checkbox" name="terms" check={values.terms} />
                    <span className="checkmark" />
                </label>
                {touched.terms && errors.terms && (
                    <p className="error">{errors.terms}</p>
                )}
                <br />
                <button type="submit">Add User</button>
            </Form>
            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                    <li>Password: {user.password}</li>
                    <li>Password Confirmation: {user.passwordConfirmation}</li>
                    <li>Role: {user.role}</li>
                    <li>Terms: {user.terms}</li>
                </ul>
            ))}
        </div>
    );
};
const FormikUserForm = withFormik({
    mapPropsToValues({
        name,
        email,
        password,
        passwordConfirmation,
        role,
        terms
    }) {
        return {
            name: name || "",
            email: "",
            password: "",
            passwordConfirmation: "",
            role: "",
            terms: false
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required("Name is required."),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required."),
        password: Yup.string()
            .required("Please Enter your password")
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
            ),
        passwordConfirmation: Yup.string()
            .required("This field is required")
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
        role: Yup.string()
            .oneOf([
                "Backend Engineer",
                "Frontend Engineer",
                "iOS Engineer",
                "UX Designer"
            ])
            .required("Please choose one!"),
        terms: Yup.bool().oneOf([true], "Terms of Service are required")
    }),
    handleSubmit(values, { setStatus }) {
        console.log("submitting", values);
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log("success", res);
                setStatus(res.data);
            })
            .catch(err => console.log(err.response));
    }
})(UserForm);
export default FormikUserForm;
