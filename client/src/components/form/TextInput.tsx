import { FieldError } from "react-hook-form";

type FormFieldProps = {
    type: string;
    fieldName: string;
    placeholder: string;
    name: string;
    register: any;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    onChange?: Function;
  };

function TextInput({type, fieldName, placeholder, name, register, error, valueAsNumber, onChange}: FormFieldProps ) {
    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text font-semibold secondary-text">{fieldName}</span>
            </div>
            <input 
                type={type}
                placeholder={placeholder}
                className={"primary-input " + (error && "border-red-700")}
                onChange={onChange? onChange() : null}
                {...register(name, { valueAsNumber })}/>
            <div className="label">
            {
                error && (<span className="label-text-alt text-red-700 dark:text-red-400">{error.message}</span>)
            }
            </div>
            
        </label>
    )
}

export default TextInput