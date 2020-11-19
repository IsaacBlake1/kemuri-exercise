import React from 'react';
import { Form, Field } from 'react-final-form';
import {Button} from "@material-ui/core";
import styles from './styles.module.scss';

const PostcodeForm = (props) => (
    <Form
        onSubmit={(values)=>props.onSubmit(values.postcode)}
        validate={values => {
            const errors = {};
            if (!values.postcode) {
                errors.town = 'Required'
            }
            return errors
        }}
        render={({ handleSubmit,submitting }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Enter your postcode</h2>

                <Field name="postcode">
                    {({ input, meta }) => (
                        <div>
                            <input {...input} type="text" placeholder="Postcode" />
                            {meta.error && meta.touched && <span className={styles.form_alert}>{meta.error}</span>}
                        </div>
                    )}
                </Field>
                
                <Button variant="contained" color="primary" type="submit" disabled={submitting}>Go</Button>
            </form>
        )}
    />
);

export default PostcodeForm;