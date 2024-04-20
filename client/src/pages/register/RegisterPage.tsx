import { SubmitHandler, useForm } from "react-hook-form";
import ThemeButton from "../../components/etc/ThemeButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageType } from "react-images-uploading";
import TextInput from "../../components/form/TextInput";
import ImageInput from "../../components/form/ImageInput";
import { useState } from "react";
import { uploadImages } from "../../lib/firebase";

const schema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, { message: "Please fill username" })
      .max(32, { message: "Username should not exceed 32 characters" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Password should have more than 8 characters" }),
    confirmPassword: z.string().trim(),
    displayName: z
      .string()
      .trim()
      .min(1, { message: "Please fill display name" })
      .max(32, { message: "Display name should not exceed 32 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password does not match",
  });

type ValidationSchemaType = z.infer<typeof schema>;

const RegisterPage = () => {
  const [avatar, setAvatar] = useState<ImageType>({
    dataURL:
      "https://firebasestorage.googleapis.com/v0/b/networkchatapplication.appspot.com/o/avatar%2Favatar2.png?alt=media&token=6c4120d7-47b7-4030-909f-a4da1904561b",
  });

  const [isUsernameDuplicate, setUsernameDuplicate] = useState<boolean>(false);
  const [enableButton, setEnableButton] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data) => {
    setEnableButton(false);
    setUsernameDuplicate(false);
    const avatarURL = (await uploadImages([avatar], "avatar"))[0];

    const requestData = {
      username: data.username,
      password: data.password,
      displayName: data.displayName,
      avatar: avatarURL,
    };

    try {
      const result = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          credentials: "include",
        }
      );

      if (result.ok) {
        document.location.href = "/chat";
      } else {
        setEnableButton(true);
        setUsernameDuplicate(true);
      }
    } catch (err) {
      console.log(err);
      setEnableButton(true);
      setUsernameDuplicate(true);
    }
  };

  return (
    <div className="full-page relative">
      <div className="w-80 flex flex-col item-center">
        <form
          className="w-full flex flex-col items-center gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2>Create Account</h2>
          {isUsernameDuplicate && (
            <div className="label">
              <span className="label-text-alt text-red-700 dark:text-red-400">
                This username is already used
              </span>
            </div>
          )}

          <TextInput
            type="text"
            name="username"
            fieldName="Username"
            placeholder="Username..."
            register={register}
            error={errors.username}
          />

          <TextInput
            type="password"
            name="password"
            fieldName="Password"
            placeholder="Password..."
            register={register}
            error={errors.password}
          />

          <TextInput
            type="password"
            name="confirmPassword"
            fieldName="Confirm Password"
            placeholder="Confirm Password..."
            register={register}
            error={errors.confirmPassword}
          />

          <TextInput
            type="text"
            name="displayName"
            fieldName="Display Name"
            placeholder="Display..."
            register={register}
            error={errors.displayName}
          />

          <ImageInput
            fieldName="Avatar"
            image={avatar}
            setImage={setAvatar}
            defaultImageURL="https://firebasestorage.googleapis.com/v0/b/networkchatapplication.appspot.com/o/avatar%2Favatar2.png?alt=media&token=6c4120d7-47b7-4030-909f-a4da1904561b"
          />

          {enableButton ? (
            <button type="submit" className="primary-button">
              Register
            </button>
          ) : (
            <button className="disabled-button" disabled>
              Register
            </button>
          )}
        </form>
      </div>
      <div className="absolute top-5 right-5">
        <ThemeButton />
      </div>
    </div>
  );
};

export default RegisterPage;
