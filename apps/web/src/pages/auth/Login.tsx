import React from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Formik, ErrorMessage } from "formik";
import AppFormField from "@/components/common/appInputs/AppFormField";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppState, useAppDispatch, useAppSelector } from "@/store/store";
import { loginUser } from "@/store/actions/authActions";
import toast from "react-hot-toast";
import { Loading } from "@/components/common/Loading";
import AuthLayout from "@/layout/AuthLayout";

interface initialValues {
  email: string;
  password: string;
}

// Define your initial values and validation schema
const initialValues: initialValues = {
  email: "",
  password: "",
};

// Validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("email address is required"),
  password: Yup.string().required("password is required"),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');
  const { isAuthenticating } = useAppSelector((state: AppState) => state.auth);

  const handleSubmit = async (values: initialValues) => {
    // Dispatch the login thunk
    const resultAction = await dispatch(loginUser(values));

    // Handle successful login
    if (loginUser.fulfilled.match(resultAction)) {
      const successMessage =
        resultAction.payload?.message || "Login successful!";
      toast.success(successMessage);
      if (redirectUrl) {
        navigate(redirectUrl);
      }
      else {
      navigate("/")
        
      }
    }

    // Handle rejected login
    if (loginUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <AuthLayout title="Login" description="Enter your credentials to login">
 <div className="flex w-full items-center justify-center  md:p-5 p-[5px]">
    <div className=" w-full  shadow-sm">
     

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <>
              {/* Email Field */}
              <div className="mb-1">
                <AppFormField name="email" type="email" placeholder="Email" className="h-[54px]" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Password Field */}
              <div className="mb-1">
                  <AppFormField
                    className="h-[54px]"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                disabled={isAuthenticating}
                onClick={() => handleSubmit()}
                className="w-full bg-blue-500 h-[54px] hover:bg-blue-400 text-white rounded-lg mt-3"
              >
                {isAuthenticating ? <Loading size={20} color="" /> : "Login"}
              </Button>
              <h2 className="flex items-center gap-1 justify-end w-full text-[20px] font-normal mt-2">
                <span>don't have an account?{"  "}</span>
                <Link to={"/auth/register"} className="text-blue-600 ">
                  register
                </Link>
              </h2>
            </>
          )}
        </Formik>
        <div className=" w-full pt-5 flex items-center justify-between gap-3">
          <Separator className="w-[45%] bg-gray-200" />
          <h2 className="text-sm text-gray-400">Or</h2>
          <Separator className="w-[45%] bg-gray-200" />
        </div>
        <div className="py-3">
          <Button className="flex h-[54px] items-center justify-center gap-2 w-full !rounded-lg border border-gray-200">
            <FcGoogle fontSize={24} />
            <h2 className="text-sm font-medium text-gray-700">
              Continue with Google
            </h2>
          </Button>
        </div>
      </div>
    </div>
    </AuthLayout>
   
  );
};

export default Login;
